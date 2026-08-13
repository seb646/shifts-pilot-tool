import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (fetchError || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  const { error: chunksError } = await supabase
    .from('chunks')
    .delete()
    .eq('document_id', id)

  if (chunksError) {
    return NextResponse.json({ error: chunksError.message }, { status: 500 })
  }

  const { error: storageError } = await supabase.storage
    .from('pdfs')
    .remove([doc.storage_path])

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 })
  }

  const { error: docError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  if (docError) {
    return NextResponse.json({ error: docError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
