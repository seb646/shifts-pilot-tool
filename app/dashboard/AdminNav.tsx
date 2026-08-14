import { createClient } from '@/lib/supabase/server'

export default async function AdminNav() {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

  return (
    <aside className="w-[264px] min-w-[264px] overflow-hidden opacity-100 transition-all duration-300 ease-in-out"
                id="sidebar" aria-label="Sidebar navigation">
                <div id="sidebar-inner"
                    className="fixed top-0 left-0 w-[264px] h-full flex flex-col overflow-auto py-10 px-6 bg-[#1a1a2e] border-r border-slate-300">

                    <div className="mb-10">
                    <a href="#"
                        className="min-h-9 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded gap-8 flex flex-col">
                        <img src="https://www.toronto-tide.ca/wp-content/uploads/2026/06/toronto-tide-1.svg" alt="logo"
                            className="w-full block" />
                        <span className="sr-only">Toronto Initiative for Diversity & Excellence</span>
                    </a>
                    </div>

                    <nav className="flex-1" aria-label="Primary sidebar navigation">
                        <div className="text-white font-heading text-lg font-bold mb-4 mt-4">SHIFTS Project</div>
                    <ul className="space-y-2 text-base text-white font-bold">
                        <li>
                            <a href="/dashboard"
                                className="flex items-center gap-2.5 hover:text-slate-900 hover:bg-slate-100 rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>

                                <span>Dashboard</span>
                            </a>
                        </li>
                        {/* <li>
                            <a href="#"
                                className="flex items-center gap-2.5 hover:text-slate-900 hover:bg-slate-100 rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-[18px] fill-current overflow-visible"
                                viewBox="0 0 512 512" aria-hidden="true">
                                <path
                                    d="M256 0C114.497 0 0 114.507 0 256c0 141.503 114.507 256 256 256 141.503 0 256-114.507 256-256C512 114.497 397.492 0 256 0m0 472c-119.393 0-216-96.615-216-216 0-119.393 96.615-216 216-216 119.393 0 216 96.615 216 216 0 119.393-96.616 216-216 216"
                                    data-original="#000000" />
                                <path
                                    d="M256 214.33c-11.046 0-20 8.954-20 20v128.793c0 11.046 8.954 20 20 20s20-8.955 20-20.001V234.33c0-11.046-8.954-20-20-20"
                                    data-original="#000000" />
                                <circle cx="256" cy="162.84" r="27" data-original="#000000" />
                                </svg>
                                <span>Survey</span>
                            </a>
                        </li> */}
                        {/* <li>
                            <a href="/chat"
                                className="flex items-center gap-2.5 hover:text-slate-900 hover:bg-slate-100 rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                </svg>


                                <span>Chat</span>
                            </a>
                        </li> */}
                        <li>
                            <a href="/documents"
                                className="flex items-center gap-2.5 hover:text-slate-900 hover:bg-slate-100 rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>

                                <span>Documents</span>
                            </a>
                        </li>
                        {/* <li>
                            <a href="/users"
                                className="flex items-center gap-2.5 hover:text-slate-900 hover:bg-slate-100 rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>

                                <span>Users</span>
                            </a>
                        </li> */}
                        {/* <li>
                            <a href="#"
                                className="flex items-center gap-2.5 hover:text-slate-900 hover:bg-slate-100 rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-[18px] fill-current overflow-visible"
                                viewBox="0 0 32 32" aria-hidden="true">
                                <g data-name="Layer 2">
                                    <path
                                        d="M24.915 3.663a3.15 3.15 0 0 0-2.688-1.554H9.774a3.15 3.15 0 0 0-2.688 1.554L.859 14.446a3.15 3.15 0 0 0 0 3.15l6.227 10.742a3.15 3.15 0 0 0 2.688 1.554h12.453a3.15 3.15 0 0 0 2.688-1.554l6.226-10.784a3.15 3.15 0 0 0 0-3.15zm4.41 12.841-6.227 10.784a1.05 1.05 0 0 1-.871.504H9.774a1.05 1.05 0 0 1-.872-.504L2.676 16.504a1.05 1.05 0 0 1 0-1.05L8.902 4.713a1.05 1.05 0 0 1 .872-.504h12.453a1.05 1.05 0 0 1 .871.504l6.227 10.783a1.05 1.05 0 0 1 0 1.008"
                                        data-original="#000000" />
                                    <path
                                        d="M16 9.7a6.3 6.3 0 1 0 6.3 6.3A6.3 6.3 0 0 0 16 9.7m0 10.5a4.2 4.2 0 1 1 4.2-4.2 4.2 4.2 0 0 1-4.2 4.2"
                                        data-original="#000000" />
                                </g>
                                </svg>
                                <span>Settings</span>
                            </a>
                        </li> */}
                    </ul>
                    </nav>

                    {/* <a href="/profile"
                    className="flex flex-wrap items-center gap-4 rounded-md mt-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <div>
                        <p className="text-white font-bold">
                            {typeof user?.user_metadata?.full_name === 'string' && user.user_metadata.full_name
                                ? user.user_metadata.full_name
                                : 'Set your name'}
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
                    </div>
                    </a> */}
                </div>
            </aside>
  )
}