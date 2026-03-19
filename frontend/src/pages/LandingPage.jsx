import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const [keyword, setKeyword] = useState('AI SaaS')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const cleanKeyword = keyword.trim()
    const query = cleanKeyword ? `?keyword=${encodeURIComponent(cleanKeyword)}` : ''
    navigate(`/dashboard${query}`)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-16 sm:px-8">
      <section className="w-full rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-lg sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Lead Engine</p>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-slate-900 sm:text-5xl">
          Discover startup leads worth contacting in minutes.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Search by keyword, review why each lead matters, and generate outreach messages from one dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="AI SaaS"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Generate Leads
          </button>
        </form>
      </section>
    </main>
  )
}
