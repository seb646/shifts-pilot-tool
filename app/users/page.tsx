import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import AdminNav from '../dashboard/AdminNav'
import CreateUserForm from './CreateUserForm'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: usersData } = await admin.auth.admin.listUsers()
  const users = usersData?.users ?? []

  return (
    <main className="h-screen">
        <div className="flex items-start h-full">

            <AdminNav />

            <div className="w-full h-full">
                <header
                    className="flex py-2 sticky top-0 w-full bg-[#f4f4f8] border-b border-slate-300 px-12 min-h-[68px] z-20"
                    aria-label="header">
                    <div className="flex flex-wrap items-center gap-4 w-full">
                        <h1 className="text-xl text-slate-900 font-bold">Users</h1>

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

                <section className="p-12 flex flex-col gap-12">
                    <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                        <CreateUserForm />
                    </div>

                    {users.length === 0 ? (
                        <p className="text-gray-600">No users yet.</p>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-300">
                                    <th className="py-2 pr-4 text-sm font-semibold text-slate-900">Name</th>
                                    <th className="py-2 pr-4 text-sm font-semibold text-slate-900">Email</th>
                                    <th className="py-2 pr-4 text-sm font-semibold text-slate-900">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b border-slate-200">
                                        <td className="py-2 pr-4 text-sm text-slate-900">
                                            {typeof u.user_metadata?.full_name === 'string' && u.user_metadata.full_name
                                                ? u.user_metadata.full_name
                                                : '—'}
                                        </td>
                                        <td className="py-2 pr-4 text-sm text-slate-900">{u.email}</td>
                                        <td className="py-2 pr-4 text-sm text-slate-600">
                                            {new Date(u.created_at).toLocaleString()}
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
