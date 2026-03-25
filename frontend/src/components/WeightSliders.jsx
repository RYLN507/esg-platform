export default function WeightSliders({ weights, setWeights }) {
    const handleChange = (key, value) => {
      setWeights(prev => ({ ...prev, [key]: parseFloat(value) }))
    }
  
    const sliders = [
      { key: 'environmental', label: 'Environmental', color: 'accent-emerald-400' },
      { key: 'social', label: 'Social', color: 'accent-blue-400' },
      { key: 'governance', label: 'Governance', color: 'accent-purple-400' },
    ]
  
    // Calculate the total sum of the current weights
    const totalPercentage = Math.round(
      (weights.environmental + weights.social + weights.governance) * 100
    )
  
    return (
      <div className="space-y-5">
        {sliders.map(({ key, label, color }) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">{label}</span>
              <span className="text-slate-400">{(weights[key] * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.90"
              step="0.05"
              value={weights[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className={`w-full h-1.5 rounded-full ${color} bg-slate-700 cursor-pointer`}
            />
          </div>
        ))}
  
        {/* Warning/Total UI */}
        <div className="pt-4 mt-2 border-t border-slate-700 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Total Allocation</span>
          <span className={`text-sm font-bold ${totalPercentage === 100 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPercentage}%
          </span>
        </div>
        
        <p className={`text-xs pt-1 ${totalPercentage === 100 ? 'text-slate-500' : 'text-red-400'}`}>
          {totalPercentage !== 100 
            ? "Weights must add up to exactly 100% for an accurate composite score." 
            : "Adjust the weights to reflect what matters most to your client."}
        </p>
      </div>
    )
  }