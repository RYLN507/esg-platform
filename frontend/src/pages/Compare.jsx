import { useState } from 'react'
import { compareCompanies, getSectors, getIndustryPeers } from '../api/esgApi'
import Plotly from 'plotly.js-dist-min'
import createPlotlyComponentRaw from 'react-plotly.js/factory'

// Safely unwrap the CommonJS default export
const createPlotlyComponent = createPlotlyComponentRaw.default || createPlotlyComponentRaw
const Plot = createPlotlyComponent(Plotly)

const SUGGESTED = ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 'JPM', 'XOM', 'JNJ', 'WMT', 'AMZN']

export default function Compare() {
  const [selected, setSelected] = useState([])
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addTicker = (ticker) => {
    const t = ticker.toUpperCase().trim()
    if (!t || selected.includes(t) || selected.length >= 5) return
    setSelected(prev => [...prev, t])
    setInput('')
  }

  const removeTicker = (ticker) => {
    setSelected(prev => prev.filter(t => t !== ticker))
    setResults([])
  }

  const handleCompare = async () => {
    if (selected.length < 2) return
    setLoading(true)
    setError(null)
    try {
      const data = await compareCompanies(selected)
      setResults(data.companies || [])
    } catch {
      setError('Failed to fetch comparison data.')
    } finally {
      setLoading(false)
    }
  }

  const colors = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#f87171']

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Compare Companies</h1>
        <p className="text-slate-400 text-sm">Add up to 5 companies to compare their ESG profiles side by side.</p>
      </div>

      {/* Input */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && addTicker(input)}
            placeholder="Type a ticker and press Enter (e.g. AAPL)"
            className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm transition-colors"
          />
          <button
            onClick={() => addTicker(input)}
            disabled={selected.length >= 5}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all"
          >
            Add
          </button>
        </div>

        {/* Suggested */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-slate-500 self-center">Suggested:</span>
          {SUGGESTED.map(t => (
            <button
              key={t}
              onClick={() => addTicker(t)}
              disabled={selected.includes(t) || selected.length >= 5}
              className="px-3 py-1 rounded-lg text-xs bg-slate-700/60 hover:bg-slate-600/60 disabled:opacity-30 text-slate-300 transition-all"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((t, i) => (
              <div key={t} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                style={{ background: `${colors[i]}20`, border: `1px solid ${colors[i]}40`, color: colors[i] }}>
                {t}
                <button onClick={() => removeTicker(t)} className="opacity-60 hover:opacity-100 text-xs">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare button */}
      <button
        onClick={handleCompare}
        disabled={selected.length < 2 || loading}
        className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 disabled:opacity-40 text-white font-bold py-4 rounded-xl text-sm transition-all mb-8"
      >
        {loading ? 'Comparing...' : `Compare ${selected.length} Companies →`}
      </button>

      {error && <p className="text-red-400 text-sm mb-6">{error}</p>}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">

          {/* Score table */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-5">
              Score Breakdown
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                  <th className="text-left pb-3">Company</th>
                  <th className="text-center pb-3">Environmental</th>
                  <th className="text-center pb-3">Social</th>
                  <th className="text-center pb-3">Governance</th>
                  <th className="text-center pb-3">Total ESG</th>
                  <th className="text-center pb-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {results.map((c, i) => (
                  <tr key={c.ticker} className="border-t border-slate-700/50">
                    <td className="py-3 font-bold" style={{ color: colors[i] }}>{c.ticker}
                      <span className="text-slate-500 font-normal text-xs ml-2">{c.company_name}</span>
                    </td>
                    <td className="py-3 text-center text-emerald-400">{c.scores.environmental?.toFixed(1)}</td>
                    <td className="py-3 text-center text-blue-400">{c.scores.social?.toFixed(1)}</td>
                    <td className="py-3 text-center text-purple-400">{c.scores.governance?.toFixed(1)}</td>
                    <td className="py-3 text-center text-white font-bold">{c.scores.total?.toFixed(1)}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        c.scores.risk_level === 'Low' ? 'bg-emerald-400/10 text-emerald-400' :
                        c.scores.risk_level === 'High' ? 'bg-red-400/10 text-red-400' :
                        'bg-yellow-400/10 text-yellow-400'
                      }`}>
                        {c.scores.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grouped bar chart */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Visual Comparison
            </h2>
            <Plot
              data={['environmental', 'social', 'governance'].map((dim, i) => ({
                type: 'bar',
                name: dim.charAt(0).toUpperCase() + dim.slice(1),
                x: results.map(c => c.ticker),
                y: results.map(c => c.scores[dim] || 0),
                marker: { color: ['#34d399', '#60a5fa', '#a78bfa'][i] },
              }))}
              layout={{
                barmode: 'group',
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { color: '#94a3b8', size: 11 },
                xaxis: { gridcolor: '#1e293b', color: '#475569' },
                yaxis: { gridcolor: '#1e293b', color: '#475569', title: 'Score' },
                legend: { font: { color: '#94a3b8' } },
                margin: { t: 20, b: 40, l: 50, r: 20 },
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '300px' }}
            />
          </div>

        </div>
      )}
    </div>
  )
}