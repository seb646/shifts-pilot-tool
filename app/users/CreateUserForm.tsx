'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateUserForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setCreating(true)

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const result = await res.json()
    setCreating(false)

    if (!res.ok) {
      setError(result.error || 'Failed to create user')
      return
    }

    setName('')
    setEmail('')
    setPassword('')
    setSuccess(`User ${email} created.`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div>
        <p className="text-sm font-semibold text-slate-900 font-heading">Create a user</p>
        <p className="text-sm text-slate-500 mt-0.5">The account is created and confirmed immediately</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="new-user-name" className="text-sm font-medium text-slate-700">Name</label>
        <input
          id="new-user-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional"
          className="border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="new-user-email" className="text-sm font-medium text-slate-700">Email</label>
        <input
          id="new-user-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="new-user-password" className="text-sm font-medium text-slate-700">Password</label>
        <input
          id="new-user-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={creating}
          className="bg-[#1a1a2e] text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
        >
          {creating ? 'Creating...' : 'Create user'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </div>
    </form>
  )
}
