import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Chat from './Chat'
import AdminNav from '../dashboard/AdminNav'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="h-screen">
            <div className="flex items-start h-full">
    
                <AdminNav />
    
                <div className="w-full h-full flex flex-col">
                    <header
                        className="flex py-2 sticky top-0 w-full bg-white border-b border-slate-300 px-12 min-h-[68px] z-20"
                        aria-label="header">
                        <div className="flex flex-wrap items-center gap-4 w-full">
                            <h1 className="text-xl text-slate-900 font-bold">Chat</h1>

                            <div className="flex items-center flex-wrap gap-5 ml-auto">
                                <form action="/auth/signout" method="post">
                                    <button className="font-bold text-red-600" type="submit">
                                    Log out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </header>

                    <section className="flex-1 min-h-0 px-12 py-6">
                        <Chat />
                    </section>
                </div>
    
            </div>
        </main>
  )
}