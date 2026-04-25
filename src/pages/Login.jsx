import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, Users, ArrowRight } from 'lucide-react'
import './Login.css'

const MOCK_USERS = [
  { email: 'colaborador@teamhub.com', password: '123456', role: 'Colaborador', name: 'Ana Silva' },
  { email: 'rh@teamhub.com',          password: '123456', role: 'RH',          name: 'Bruno Santos' },
  { email: 'gestor@teamhub.com',      password: '123456', role: 'Gestor',       name: 'Carlos Mendes' },
]

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      navigate('/dashboard')
    } else {
      setError('E-mail ou senha incorretos.')
    }
    setLoading(false)
  }

  const quickLogin = (u) => {
    setEmail(u.email)
    setPassword(u.password)
  }

  return (
    <div className="login-page">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-bg">
          <div className="login-orb login-orb-1" />
          <div className="login-orb login-orb-2" />
          <div className="login-grid" />
        </div>
        <div className="login-left-content">
          <div className="landing-logo" style={{marginBottom: 40}}>
            <div className="logo-icon"><Users size={18} /></div>
            <span style={{fontSize:20, fontWeight:800}}>TeamHub</span>
          </div>
          <h2 className="login-tagline">
            Transforme a gestão de<br />
            <span className="gradient-text">pessoas da sua organização</span>
          </h2>
          <p className="login-desc">
            Plataforma integrada para admissão digital, onboarding e comunicação interna.
          </p>
          <div className="login-features">
            {[
              { icon: '⚡', label: 'Admissão Digital', desc: 'Automatize processos de entrada' },
              { icon: '🎯', label: 'Trilhas de Onboarding', desc: 'Integração personalizada ao colaborador' },
              { icon: '💬', label: 'Comunicação Integrada', desc: 'Canal interno de comunicação' },
            ].map((f, i) => (
              <div key={i} className="login-feat-item">
                <div className="login-feat-icon">{f.icon}</div>
                <div>
                  <div className="login-feat-title">{f.label}</div>
                  <div className="login-feat-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-form-wrap fade-in">
          <h1 className="login-title">Bem-vindo de volta!</h1>
          <p className="login-subtitle">Acesse sua conta para continuar</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>E-mail</label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder="seuemail@empresa.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Senha
                <span className="forgot-link" onClick={() => {}}>Esqueceu?</span>
              </label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button id="login-submit" type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Entrar na Plataforma <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="login-divider"><span>Acesso rápido para demo</span></div>

          <div className="quick-logins">
            {MOCK_USERS.map((u, i) => (
              <button key={i} className="quick-login-btn" onClick={() => quickLogin(u)}>
                <div className="avatar avatar-sm" style={{
                  background: `hsl(${i*120+240},70%,55%)`
                }}>{u.name[0]}</div>
                <div>
                  <div className="quick-name">{u.name}</div>
                  <div className="quick-role">{u.role}</div>
                </div>
                <ArrowRight size={14} style={{marginLeft:'auto', opacity:0.4}} />
              </button>
            ))}
          </div>

          <p className="login-footer-txt">
            Não tem conta? <span className="text-link" onClick={() => navigate('/')}>Saiba mais</span>
          </p>
        </div>
      </div>
    </div>
  )
}
