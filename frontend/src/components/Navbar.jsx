import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    if (location.pathname === path) {
      return 'text-emerald-400 border-b border-emerald-400'
    }
    return 'text-slate-400 hover:text-white transition-colors'
  }

  return (
    <nav className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-xs font-black text-white">
          E
        </div>
        <span className="font-bold text-white tracking-tight">
          ESG<span className="text-emerald-400">Platform</span>
        </span>
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/compare" className={isActive('/compare')}>Compare</Link>
        
        {/* Added the opening <a tag here */}
        <a 
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 hover:text-white transition-colors"
        >
          API Docs
        </a>
      </div>
    </nav>
  )
}