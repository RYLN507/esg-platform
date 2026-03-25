import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Compare from './pages/Compare'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:ticker" element={<Dashboard />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </div>
  )
}