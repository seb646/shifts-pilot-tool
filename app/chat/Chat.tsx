'use client'

import { useEffect, useRef, useState } from 'react'

type Citation = {
  start: number
  end: number
  text: string
  sources: { id: string }[]
}

type Message = {
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  sources?: { document_id: string; content: string }[]
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const question = input
    setInput('')
    setError('')
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })

    const result = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(result.error || 'Something went wrong')
      return
    }

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: result.answer,
        citations: result.citations,
        sources: result.sources,
      },
    ])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-slate-400">
            <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
            <p className="font-bold text-lg text-slate-900">Ask a question about your documents</p>
            <p className="text-slate-500 max-w-md">Answers are grounded in the PDFs you&apos;ve uploaded, with sources cited below each response.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 py-6 max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                    msg.role === 'user'
                      ? 'bg-[#1a1a2e] text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>

                <div className={`flex flex-col gap-1.5 max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#1a1a2e] text-white rounded-2xl rounded-tr-sm'
                        : 'bg-slate-100 text-slate-900 rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {msg.sources.map((s, j) => (
                        <span
                          key={j}
                          className="text-[11px] font-medium text-slate-500 bg-white border border-slate-200 rounded-full px-2 py-0.5"
                        >
                          Source {j + 1} · doc {s.document_id.slice(0, 8)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="size-8 shrink-0 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                  AI
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-slate-400 animate-bounce" />
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="max-w-3xl w-full mx-auto pt-2">
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white border border-slate-300 rounded-full px-2 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#4e4e9c]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 bg-transparent px-3 py-1.5 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="size-9 shrink-0 rounded-full bg-[#4e4e9c] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0-6 6m6-6 6 6" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
