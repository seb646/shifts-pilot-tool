import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminNav from '../dashboard/AdminNav'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="h-screen">
        <div className="flex items-start h-full">

            <AdminNav />

            <div className="w-full h-full">
                <header
                    className="flex py-2 sticky top-0 w-full bg-white border-b border-slate-300 px-12 min-h-[68px] z-20"
                    aria-label="header">
                    <div className="flex flex-wrap items-center gap-4 w-full">
                        <h1 className="text-xl text-slate-900 font-bold">Profile</h1>

                        <div className="flex items-center flex-wrap gap-5 ml-auto">
                            <form action="/auth/signout" method="post">
                                <button className="font-bold text-red-600" type="submit">
                                Log out
                                </button>
                            </form>
                        </div>
                    </div>
                </header>

                <section className="p-12">
                    <ProfileForm
                        email={user.email ?? ''}
                        name={typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : ''}
                    />
                </section>
            </div>

        </div>
    </main>
  )
}
