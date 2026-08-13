'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function ProfileForm({ email, name }: { email: string; name: string }) {
  const router = useRouter()

  const [profileName, setProfileName] = useState(name)
  const [profileEmail, setProfileEmail] = useState(email)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setSavingProfile(true)

    const supabase = createClient()
    const emailChanged = profileEmail !== email

    const { error } = await supabase.auth.updateUser({
      email: profileEmail,
      data: { full_name: profileName },
    })

    setSavingProfile(false)

    if (error) {
      setProfileError(error.message)
      return
    }

    setProfileSuccess(
      emailChanged
        ? 'Profile updated. Check your inbox to confirm your new email address.'
        : 'Profile updated.'
    )
    router.refresh()
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setSavingPassword(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)

    if (error) {
      setPasswordError(error.message)
      return
    }

    setNewPassword('')
    setConfirmPassword('')
    setPasswordSuccess('Password updated.')
  }

  return (
    <div className="max-w-lg flex flex-col gap-10">
      <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 font-heading">Profile details</p>
          <p className="text-sm text-slate-500 mt-0.5">Your name and email address</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
          <input
            id="name"
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Your name"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            type="email"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            required
            className="border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={savingProfile}
            className="bg-[#1a1a2e] text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            {savingProfile ? 'Saving...' : 'Save changes'}
          </button>
          {profileError && <p className="text-red-600 text-sm">{profileError}</p>}
          {profileSuccess && <p className="text-green-600 text-sm">{profileSuccess}</p>}
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 pt-6 border-t border-slate-200">
        <div>
          <p className="text-sm font-semibold text-slate-900 font-heading">Change password</p>
          <p className="text-sm text-slate-500 mt-0.5">Choose a new password for your account</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-password" className="text-sm font-medium text-slate-700">New password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium text-slate-700">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={savingPassword}
            className="border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            {savingPassword ? 'Saving...' : 'Update password'}
          </button>
          {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
        </div>
      </form>
    </div>
  )
}
