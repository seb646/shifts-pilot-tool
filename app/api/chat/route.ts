import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { question } = await request.json()

  if (!question || typeof question !== 'string') {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 })
  }

  // 1. Embed the question
  const embedRes = await fetch('https://api.cohere.com/v2/embed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      texts: [question],
      model: 'embed-v4.0',
      input_type: 'search_query',
      output_dimension: 1024,
      embedding_types: ['float'],
    }),
  })

  if (!embedRes.ok) {
    return NextResponse.json({ error: `Embed failed: ${await embedRes.text()}` }, { status: 500 })
  }

  const embedData = await embedRes.json()
  const queryEmbedding = embedData.embeddings.float[0]

  // 2. Search chunks via pgvector
  const { data: matches, error: searchError } = await supabase.rpc('match_chunks', {
    query_embedding: queryEmbedding,
    match_count: 8,
  })

  if (searchError) {
    return NextResponse.json({ error: searchError.message }, { status: 500 })
  }

  if (!matches || matches.length === 0) {
    return NextResponse.json({
      answer: "I couldn't find anything relevant in the uploaded documents.",
      citations: [],
    })
  }

  // 3. Rerank the matches
  const rerankRes = await fetch('https://api.cohere.com/v2/rerank', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: question,
      documents: matches.map((m: { content: string }) => m.content),
      model: 'rerank-v3.5',
      top_n: 5,
    }),
  })

  if (!rerankRes.ok) {
    return NextResponse.json({ error: `Rerank failed: ${await rerankRes.text()}` }, { status: 500 })
  }

  const rerankData = await rerankRes.json()
  const topChunks = rerankData.results.map(
    (r: { index: number }) => matches[r.index]
  )

  // 4. Generate an answer with citations via Chat
  const chatRes = await fetch('https://api.cohere.com/v2/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command-a-03-2025',
      messages: [{ role: 'user', content: question }],
      documents: topChunks.map((c: { id: string; content: string }) => ({
        id: c.id,
        data: { text: c.content },
      })),
    }),
  })

  if (!chatRes.ok) {
    return NextResponse.json({ error: `Chat failed: ${await chatRes.text()}` }, { status: 500 })
  }

  const chatData = await chatRes.json()
  const answerText = chatData.message.content[0].text
  const citations = chatData.message.citations || []

  return NextResponse.json({
    answer: answerText,
    citations,
    sources: topChunks,
  })
}