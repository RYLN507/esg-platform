const colorMap = {
    emerald: { bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', text: 'text-emerald-400' },
    blue: { bg: 'bg-blue-400/10', border: 'border-blue-400/20', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-400/10', border: 'border-purple-400/20', text: 'text-purple-400' },
    slate: { bg: 'bg-slate-700/40', border: 'border-slate-600', text: 'text-white' },
  }
  
  export default function ESGScoreCard({ label, value, color, description, isTotal }) {
    const c = colorMap[color] || colorMap.slate
  
    return (
      <div className={`${c.bg} border ${c.border} rounded-2xl p-5`}>
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</div>
        <div className={`text-4xl font-black ${c.text} mb-1`}>
          {value !== null && value !== undefined ? value.toFixed(1) : '—'}
        </div>
        <div className="text-xs text-slate-600">{description}</div>
        {isTotal && (
          <div className="text-xs text-slate-500 mt-2">Lower = better</div>
        )}
      </div>
    )
  }