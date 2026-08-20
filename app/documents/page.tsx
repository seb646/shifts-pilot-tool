import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminNav from '../dashboard/AdminNav'
import DeleteButton from './DeleteButton'
import UploadForm from './UploadForm'

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: rows } = await supabase
    .from('documents')
    .select('id, filename, storage_path, created_at')
    .order('created_at', { ascending: false })

  const documents = await Promise.all(
    (rows ?? []).map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from('pdfs')
        .createSignedUrl(doc.storage_path, 60 * 60)

      return { ...doc, url: signed?.signedUrl ?? null }
    })
  )

  return (
    <main className="h-screen">
        <div className="flex items-start h-full">

            <AdminNav />

            <div className="w-full h-full">
                <header
                    className="flex py-2 sticky top-0 w-full bg-white border-b border-slate-300 px-12 min-h-[68px] z-20"
                    aria-label="header">
                    <div className="flex flex-wrap items-center gap-4 w-full">
                        <h1 className="text-xl text-slate-900 font-bold">Documents</h1>

                        <div className="flex items-center flex-wrap gap-5 ml-auto">
                            <form action="/auth/signout" method="post">
                                <button className="font-bold text-slate-600 flex gap-1 cursor-pointer hover:text-slate-500 items-center" type="submit">
                                <span>Log out</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </header>

                <section className="p-12">
                    <div className="border border-slate-200 rounded-lg p-6 mb-12 bg-slate-50">
                        <UploadForm />
                    </div>
                    {documents.length === 0 ? (
                        <p className="text-gray-600">No documents have been uploaded yet.</p>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-300">
                                    <th className="py-2 pr-4 text-sm font-semibold text-slate-900">Filename</th>
                                    <th className="py-2 pr-4 text-sm font-semibold text-slate-900">Uploaded</th>
                                    <th className="py-2 pr-4 text-sm font-semibold text-slate-900"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="border-b border-slate-200">
                                        <td className="py-2 pr-4 text-sm text-slate-900 max-w-xs" title={doc.filename}>
                                            {doc.url ? (
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block truncate hover:underline text-[#4e4e9c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e4e9c] rounded"
                                                >
                                                    {doc.filename}
                                                </a>
                                            ) : (
                                                <span className="block truncate">{doc.filename}</span>
                                            )}
                                        </td>
                                        <td className="py-2 pr-4 text-sm text-slate-600">
                                            {new Date(doc.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-2 pr-4 text-right">
                                            <DeleteButton id={doc.id} filename={doc.filename} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>

        </div>
    </main>
  )
}
