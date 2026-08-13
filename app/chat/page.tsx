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

                    <section className="flex-1 min-h-0 px-12 py-6">
                        <Chat />
                    </section>
                </div>
    
            </div>
        </main>
  )
}