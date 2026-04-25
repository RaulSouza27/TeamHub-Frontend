import { useNavigate } from 'react-router-dom'
import { Users, Zap, MessageSquare, CheckCircle, ArrowRight, Shield, BarChart2, Globe } from 'lucide-react'
import './Landing.css'

const features = [
  {
    icon: <Zap size={22} />,
    color: '#6C47FF',
    title: 'Admissão Digital',
    desc: 'Automatize o processo de entrada do colaborador com cadastro, envio de documentos e validação pelo RH.',
  },
  {
    icon: <CheckCircle size={22} />,
    color: '#00C9A7',
    title: 'Gestão de Onboarding',
    desc: 'Trilhas de integração, treinamentos e checklists que auxiliam na adaptação do novo colaborador.',
  },
  {
    icon: <MessageSquare size={22} />,
    color: '#FF6B9D',
    title: 'Comunicação Integrada',
    desc: 'Ambiente colaborativo com publicações, interação social e disseminação de informações institucionais.',
  },
]

const stats = [
  { value: '98%', label: 'Satisfação dos colaboradores' },
  { value: '3x', label: 'Mais rápido no onboarding' },
  { value: '500+', label: 'Empresas usando' },
  { value: '24/7', label: 'Suporte disponível' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="logo-icon"><Users size={18} /></div>
            <span>TeamHub</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Recursos</a>
            <a href="#stats">Resultados</a>
            <a href="#modulos">Módulos</a>
          </div>
          <div className="landing-nav-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>
              Entrar
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
              Começar grátis
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content fade-in">
          <div className="hero-badge">
            <span className="notif-dot" />
            Nova plataforma de RH digital
          </div>
          <h1 className="hero-title">
            Transforme a gestão de<br />
            <span className="gradient-text">pessoas da sua organização</span>
          </h1>
          <p className="hero-subtitle">
            Plataforma integrada para admissão digital, onboarding e comunicação
            interna — tudo em um só lugar, simples e poderoso.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
              Começar agora <ArrowRight size={18} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>
              Ver demonstração
            </button>
          </div>

          <div className="hero-trust">
            <span>Confiado por equipes de RH em todo o Brasil</span>
            <div className="hero-avatars">
              {['AM', 'BS', 'CR', 'DL', 'EF'].map((i, idx) => (
                <div key={idx} className="avatar avatar-sm" style={{
                  background: `hsl(${idx * 60 + 240}, 70%, 55%)`,
                  marginLeft: idx ? '-8px' : 0,
                  border: '2px solid var(--bg-dark)',
                  zIndex: 5 - idx,
                }}>{i}</div>
              ))}
              <span className="hero-trust-count">+500 empresas</span>
            </div>
          </div>
        </div>

        <div className="hero-visual fade-in">
          <div className="dashboard-preview glass">
            <div className="preview-header">
              <div className="preview-dots">
                <span style={{ background: '#FF5F57' }} />
                <span style={{ background: '#FEBC2E' }} />
                <span style={{ background: '#28C840' }} />
              </div>
              <span className="preview-title">TeamHub Dashboard</span>
            </div>
            <div className="preview-body">
              <div className="preview-stat">
                <div className="preview-stat-icon" style={{ background: 'rgba(108,71,255,0.2)' }}>👥</div>
                <div>
                  <div className="preview-stat-val">247</div>
                  <div className="preview-stat-lbl">Colaboradores</div>
                </div>
              </div>
              <div className="preview-stat">
                <div className="preview-stat-icon" style={{ background: 'rgba(0,201,167,0.2)' }}>✅</div>
                <div>
                  <div className="preview-stat-val">18</div>
                  <div className="preview-stat-lbl">Em onboarding</div>
                </div>
              </div>
              <div className="preview-stat">
                <div className="preview-stat-icon" style={{ background: 'rgba(255,107,157,0.2)' }}>💬</div>
                <div>
                  <div className="preview-stat-val">94%</div>
                  <div className="preview-stat-lbl">Engajamento</div>
                </div>
              </div>
              <div className="preview-bar-label">Admissões este mês</div>
              {[80, 60, 90, 45, 70, 55, 85].map((h, i) => (
                <div key={i} className="preview-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="landing-stats" id="stats">
        {stats.map((s, i) => (
          <div key={i} className="landing-stat-item fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="landing-stat-value gradient-text">{s.value}</div>
            <div className="landing-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features" id="features">
        <div className="landing-section-head">
          <h2>Tudo que seu RH precisa</h2>
          <p>Uma plataforma completa para gerenciar toda a jornada do colaborador</p>
        </div>
        <div className="features-grid" id="modulos">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="feature-icon" style={{ background: `${f.color}22`, color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <button className="feature-link" style={{ color: f.color }} onClick={() => navigate('/login')}>
                Saiba mais <ArrowRight size={14} />
              </button>
            </div>
          ))}

          {/* Extra cards */}
          <div className="feature-card glass feature-card-wide fade-in">
            <div className="feature-wide-content">
              <div className="feature-icon" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>
                <Shield size={22} />
              </div>
              <div>
                <h3>Segurança e Conformidade</h3>
                <p>Integração com eSocial, dados criptografados e conformidade com LGPD para total proteção dos dados.</p>
              </div>
            </div>
          </div>
          <div className="feature-card glass feature-card-wide fade-in">
            <div className="feature-wide-content">
              <div className="feature-icon" style={{ background: 'rgba(0,201,167,0.2)', color: '#00C9A7' }}>
                <BarChart2 size={22} />
              </div>
              <div>
                <h3>Analytics em tempo real</h3>
                <p>Dashboards completos com métricas de engajamento, progresso de onboarding e indicadores de RH.</p>
              </div>
            </div>
          </div>
          <div className="feature-card glass feature-card-wide fade-in">
            <div className="feature-wide-content">
              <div className="feature-icon" style={{ background: 'rgba(108,71,255,0.2)', color: '#6C47FF' }}>
                <Globe size={22} />
              </div>
              <div>
                <h3>Integrações Externas</h3>
                <p>Conecte-se com eSocial, sistemas de folha de pagamento e outras APIs governamentais facilmente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta">
        <div className="cta-orb" />
        <h2>Pronto para transformar seu RH?</h2>
        <p>Comece gratuitamente. Sem cartão de crédito. Configure em minutos.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
          Criar conta grátis <ArrowRight size={18} />
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="landing-logo" style={{ marginBottom: 8 }}>
          <div className="logo-icon"><Users size={16} /></div>
          <span>TeamHub</span>
        </div>
        <p>© 2026 TeamHub. Todos os direitos reservados.</p>
        <p>Desenvolvido por Larissa & Raul</p>
      </footer>
    </div>
  )
}
