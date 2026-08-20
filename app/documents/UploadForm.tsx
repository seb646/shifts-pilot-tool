'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadForm() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setUploading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json()
    setUploading(false)

    if (!res.ok) {
      setError(result.error || 'Upload failed')
      return
    }

    form.reset()
    setFileName('')
    router.refresh()
  }

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-900 font-heading">Upload a document</p>
        <p className="text-sm text-slate-500 mt-0.5">PDF files only</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept="application/pdf"
          required
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e4e9c] cursor-pointer"
        >
          Choose file
        </button>
        <span className="text-sm text-slate-500 truncate">
          {fileName || 'No file selected'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={uploading}
          className="bg-[#4e4e9c] text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-80 transition-opacity disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e4e9c] cursor-pointer"
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </form>
  )
}