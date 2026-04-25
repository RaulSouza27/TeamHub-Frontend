import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admissao from './pages/Admissao'
import Onboarding from './pages/Onboarding'
import Comunicacao from './pages/Comunicacao'
import { AuthContext } from './context/AuthContext'

export default function App() {
  const [user, setUser] = useState(null)

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admissao"  element={user ? <Admissao />  : <Navigate to="/login" />} />
        <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" />} />
        <Route path="/comunicacao" element={user ? <Comunicacao /> : <Navigate to="/login" />} />
        <Route path="*"         element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  )
}
