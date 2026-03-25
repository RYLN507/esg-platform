import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompanyESG, getIndustryPeers } from '../api/esgApi'
import ESGScoreCard from '../components/ESGScoreCard'
import RadarChart from '../components/RadarChart'
import PeerBarChart from '../components/PeerBarChart'
import WeightSliders from '../components/WeightSliders'
import ReportButton from '../components/ReportButton'

export default function Dashboard() {
  const { ticker } = useParams()
  const navigate = useNavigate()

  const [company, setCompany] = useState(null)
  const [peers, setPeers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [weights, setWeights] = useState({
    environmental: 0.4,
    social: 0.35,
    governance: 0.25,
  })

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCompanyESG(ticker)
      .then((data) => {
        setCompany(data)
        if (data.sector && data.sector !== 'Unknown') {
          return getIndustryPeers(data.sector)
        }
        return { peers: [] }
      })
      .then((peerData) => setPeers(peerData.peers || []))
      .catch(() => setError('Could not load data for ' + ticker))
      .finally(() => setLoading(false))
  }, [ticker])

  const compositeScore = company?.scores
    ? (
        company.scores.environmental * weights.environmental +
        company.scores.social * weights.social +
        company.scores.governance * weights.governance
      ).toFixed(2)
    : null

  if (loading) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Fetching ESG data for {ticker}...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="text-emerald-400 underline text-sm">
          Go back home
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <button onClick={() => navigate('/')} className="text-slate-500 text-sm hover:text-white mb-2 block transition-colors">
            ← Back
          </button>
          <h1 className="text-3xl font-black text-white">{company?.company_name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-slate-400 text-sm">{ticker}</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full" />
            <span className="text-slate-400 text-sm">{company?.sector}</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full" />
            <span className="text-slate-400 text-sm">{company?.country}</span>
          </div>
        </div>

        {/* Risk badge & Report Button */}
        <div className="flex items-center gap-3">
          <ReportButton ticker={ticker} />
          <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${
            company?.scores?.risk_level === 'Low'
              ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
              : company?.scores?.risk_level === 'High'
              ? 'bg-red-400/10 border-red-400/30 text-red-400'
              : 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
          }`}>
            {company?.scores?.risk_level} ESG Risk
          </div>
        </div>
      </div> {/* <--- THE MISSING DIV HAS BEEN ADDED HERE */}

      {/* Score Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ESGScoreCard
          label="Environmental"
          value={company?.scores?.environmental}
          color="emerald"
          description="Carbon, energy, water"
        />
        <ESGScoreCard
          label="Social"
          value={company?.scores?.social}
          color="blue"
          description="Labor, safety, community"
        />
        <ESGScoreCard
          label="Governance"
          value={company?.scores?.governance}
          color="purple"
          description="Board, ethics, transparency"
        />
        <ESGScoreCard
          label="Total ESG"
          value={company?.scores?.total}
          color="slate"
          description="Overall risk score"
          isTotal
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Radar Chart Container */}
        <div className="bg-[#151b28] border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-white font-bold mb-4 text-sm">ESG Breakdown vs Industry Avg</h3>
          <RadarChart company={company} peers={peers} />
        </div>

        {/* Peer Bar Chart Container */}
        <div className="bg-[#151b28] border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-white font-bold mb-4 text-sm">Industry Peer Comparison</h3>
          <PeerBarChart company={company} peers={peers} />
        </div>
        
      </div>

      {/* Weight Sliders Row */}
      <div className="bg-[#151b28] border border-slate-800 rounded-2xl p-6 mb-8 shadow-lg">
        <h3 className="text-white font-bold mb-4 text-sm">Custom ESG Weighting Simulator</h3>
        <p className="text-slate-400 text-sm mb-6">Adjust the weights to see how it affects the composite score.</p>
        
        <WeightSliders weights={weights} setWeights={setWeights} />
      </div>

    </div>
  )
}