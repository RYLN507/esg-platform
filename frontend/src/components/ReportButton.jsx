import { useState } from 'react'
import axios from 'axios'

export default function ReportButton({ ticker }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/report/${ticker}`,
        {},
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ESG_Report_${ticker}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch {
      alert('Failed to generate report.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-emerald-400/50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          Generating...
        </>
      ) : (
        <>
          ↓ Download PDF Report
        </>
      )}
    </button>
  )
}