import Plotly from 'plotly.js-dist-min'
import createPlotlyComponentRaw from 'react-plotly.js/factory'

// Safely unwrap the CommonJS default export so Vite can read it
const createPlotlyComponent = createPlotlyComponentRaw.default || createPlotlyComponentRaw
const Plot = createPlotlyComponent(Plotly)

export default function PeerBarChart({ peers, currentTicker }) {
  if (!peers.length) return (
    <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
      No peer data available
    </div>
  )

  const sorted = [...peers].sort((a, b) => a.total - b.total)
  const colors = sorted.map(p =>
    p.ticker === currentTicker ? '#34d399' : '#334155'
  )

  return (
    <Plot
      data={[{
        type: 'bar',
        x: sorted.map(p => p.ticker),
        y: sorted.map(p => p.total),
        marker: { color: colors },
        text: sorted.map(p => p.total.toFixed(1)),
        textposition: 'outside',
        textfont: { color: '#94a3b8', size: 10 },
      }]}
      layout={{
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#94a3b8', size: 10 },
        xaxis: { gridcolor: '#1e293b', color: '#475569' },
        yaxis: { gridcolor: '#1e293b', color: '#475569', title: 'ESG Risk Score' },
        margin: { t: 20, b: 40, l: 50, r: 20 },
        showlegend: false,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '280px' }}
    />
  )
}