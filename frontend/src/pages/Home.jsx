import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const QUICK_PICKS = [
  { ticker: 'AAPL', name: 'Apple', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Google', sector: 'Technology' },
  { ticker: 'JPM', name: 'JPMorgan', sector: 'Finance' },
  { ticker: 'XOM', name: 'ExxonMobil', sector: 'Energy' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/dashboard/${query.trim().toUpperCase()}`)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[88vh] px-4">

      {/* Hero */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 mb-6">
          ESG ANALYTICS PLATFORM
        </div>
        <h1 className="text-5xl font-black tracking-tight leading-tight mb-4">
          Understand Any Company's{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            ESG Impact
          </span>
        </h1>
        <p className="text-slate-400 text-lg">
          Search for any publicly traded company to see their Environmental,
          Social & Governance scores, peer benchmarking, and download a full client report.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="w-full max-w-lg mb-10">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Enter ticker (e.g. AAPL, MSFT, JPM)"
            className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors text-sm"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold px-6 py-4 rounded-xl transition-all text-sm"
          >
            Analyse →
          </button>
        </div>
      </form>

      {/* Quick picks */}
      <div className="w-full max-w-lg">
        <p className="text-xs text-slate-500 uppercase tracking-widest text-center mb-4">
          Quick picks
        </p>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_PICKS.map((c) => (
            <button
              key={c.ticker}
              onClick={() => navigate(`/dashboard/${c.ticker}`)}
              className="bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 hover:border-emerald-400/40 rounded-xl p-3 text-left transition-all group"
            >
              <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                {c.ticker}
              </div>
              <div className="text-slate-500 text-xs">{c.name}</div>
              <div className="text-slate-600 text-xs mt-1">{c.sector}</div>
            </button>
          ))}
        </div>
      </div>

    </main>
  )
}