import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { chunkText } from '@/lib/chunk'
import pdf from 'pdf-parse/lib/pdf-parse.js'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Please upload a PDF' }, { status: 400 })
  }

  const storagePath = `${crypto.randomUUID()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(storagePath, file)

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: doc, error: dbError } = await supabase
    .from('documents')
    .insert({ filename: file.name, storage_path: storagePath, uploaded_by: user.id })
    .select()
    .single()

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  // Extract text
  const buffer = Buffer.from(await file.arrayBuffer())
  const parsed = await pdf(buffer)
  const chunks = chunkText(parsed.text)

  if (chunks.length === 0) {
    return NextResponse.json({ error: 'No extractable text found in PDF' }, { status: 400 })
  }

  // Embed all chunks in one Cohere call
const embedRes = await fetch('https://api.cohere.com/v2/embed', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    texts: chunks,
    model: 'embed-v4.0',
    input_type: 'search_document',
    output_dimension: 1024,
    embedding_types: ['float'],
  }),
})

if (!embedRes.ok) {
  const errText = await embedRes.text()
  return NextResponse.json({ error: `Cohere embed failed: ${errText}` }, { status: 500 })
}

const embedData = await embedRes.json()
const embeddings: number[][] = embedData.embeddings.float

  // Store chunks + embeddings
  const rows = chunks.map((content, i) => ({
    document_id: doc.id,
    content,
    embedding: embeddings[i],
    chunk_index: i,
  }))

  const { error: chunksError } = await supabase.from('chunks').insert(rows)

  if (chunksError) {
    return NextResponse.json({ error: chunksError.message }, { status: 500 })
  }

  return NextResponse.json({ document: doc, chunkCount: chunks.length })
}