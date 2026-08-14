'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ id, filename }: { id: string; filename: string }) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return

    setDeleting(true)
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
    setDeleting(false)

    if (!res.ok) {
      const result = await res.json().catch(() => ({}))
      alert(result.error || 'Failed to delete document')
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-red-600 font-medium hover:underline disabled:opacity-50 cursor-pointer"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
