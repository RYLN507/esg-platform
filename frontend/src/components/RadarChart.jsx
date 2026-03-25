import PlotlyChart from 'react-plotly.js'
const Plot = PlotlyChart.default || PlotlyChart

export default function RadarChart({ company, peers }) {
  if (!company?.scores) return null

  const avgE = peers.length ? (peers.reduce((s, p) => s + (p.environmental || 0), 0) / peers.length).toFixed(1) : 0
  const avgS = peers.length ? (peers.reduce((s, p) => s + (p.social || 0), 0) / peers.length).toFixed(1) : 0
  const avgG = peers.length ? (peers.reduce((s, p) => s + (p.governance || 0), 0) / peers.length).toFixed(1) : 0

  const categories = ['Environmental', 'Social', 'Governance']

  const data = [
    {
      type: 'scatterpolar',
      r: [company.scores.environmental, company.scores.social, company.scores.governance],
      theta: categories,
      fill: 'toself',
      name: company.ticker,
      line: { color: '#34d399' },
      fillcolor: 'rgba(52,211,153,0.15)',
    },
    {
      type: 'scatterpolar',
      r: [parseFloat(avgE), parseFloat(avgS), parseFloat(avgG)],
      theta: categories,
      fill: 'toself',
      name: 'Industry Avg',
      line: { color: '#60a5fa', dash: 'dash' },
      fillcolor: 'rgba(96,165,250,0.1)',
    },
  ]

  return (
    <Plot
      data={data}
      layout={{
        polar: {
          bgcolor: 'transparent',
          radialaxis: { visible: true, color: '#475569', gridcolor: '#1e293b' },
          angularaxis: { color: '#94a3b8' },
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#94a3b8', size: 11 },
        legend: { font: { color: '#94a3b8' } },
        margin: { t: 20, b: 20, l: 40, r: 40 },
        showlegend: true,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '280px' }}
    />
  )
}