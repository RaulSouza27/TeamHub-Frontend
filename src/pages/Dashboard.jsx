import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { Users, UserPlus, BookOpen, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import './Dashboard.css'

const stats = [
  { icon: <Users size={20}/>,       bg: 'rgba(108,71,255,0.2)', color:'#8B6CFF', label: 'Colaboradores',    value: '247', change: '+12 este mês', up: true },
  { icon: <UserPlus size={20}/>,    bg: 'rgba(0,201,167,0.2)',  color:'#00C9A7', label: 'Em Admissão',      value: '8',   change: '3 aguardando RH', up: true },
  { icon: <BookOpen size={20}/>,    bg: 'rgba(255,107,157,0.2)',color:'#FF6B9D', label: 'Em Onboarding',    value: '18',  change: '5 concluídos hoje', up: true },
  { icon: <MessageSquare size={20}/>,bg:'rgba(245,158,11,0.2)', color:'#F59E0B', label: 'Mensagens Hoje',   value: '134', change: '+28% vs ontem', up: true },
]

const recentAdmissions = [
  { name: 'Fernanda Lima',    role: 'Analista de RH',      status: 'Em análise',   date: '24/04/2026', avatar: 'FL', color: '#6C47FF' },
  { name: 'Rafael Souza',     role: 'Dev Frontend',         status: 'Aprovado',     date: '23/04/2026', avatar: 'RS', color: '#00C9A7' },
  { name: 'Mariana Costa',    role: 'Designer UX',          status: 'Documentação', date: '22/04/2026', avatar: 'MC', color: '#FF6B9D' },
  { name: 'Thiago Alves',     role: 'Gerente de Projetos',  status: 'Aprovado',     date: '21/04/2026', avatar: 'TA', color: '#F59E0B' },
  { name: 'Juliana Martins',  role: 'Analista Financeiro',  status: 'Em análise',   date: '20/04/2026', avatar: 'JM', color: '#8B6CFF' },
]

const onboardingProgress = [
  { name: 'Rafael Souza',  progress: 80,  day: 'Dia 8' },
  { name: 'Mariana Costa', progress: 55,  day: 'Dia 5' },
  { name: 'Thiago Alves',  progress: 30,  day: 'Dia 2' },
]

const statusBadge = (s) => {
  if (s === 'Aprovado')     return <span className="badge badge-success">{s}</span>
  if (s === 'Em análise')   return <span className="badge badge-warning">{s}</span>
  if (s === 'Documentação') return <span className="badge badge-primary">{s}</span>
  return <span className="badge">{s}</span>
}

export default function Dashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <div className="page-body fade-in">
          {/* Header */}
          <div className="dash-header">
            <div>
              <h1 className="section-title">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="section-subtitle">Aqui está um resumo do dia na sua plataforma</p>
            </div>
            <div className="dash-header-right">
              <div className="date-chip">
                <Clock size={14} />
                {new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long'})}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{marginBottom: 28}}>
            {stats.map((s, i) => (
              <div key={i} className="stat-card fade-in" style={{animationDelay:`${i*0.08}s`}}>
                <div className="stat-icon" style={{background: s.bg, color: s.color}}>
                  {s.icon}
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
                  <TrendingUp size={12} /> {s.change}
                </div>
              </div>
            ))}
          </div>

          <div className="grid-2">
            {/* Tabela de admissões */}
            <div className="dash-section">
              <div className="section-header">
                <div>
                  <div className="section-title" style={{fontSize:17}}>Admissões Recentes</div>
                  <div className="section-subtitle">Últimas entradas no sistema</div>
                </div>
                <span className="badge badge-primary">{recentAdmissions.length} registros</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Colaborador</th>
                      <th>Cargo</th>
                      <th>Status</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAdmissions.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar avatar-sm" style={{background: r.color}}>{r.avatar}</div>
                            <span style={{fontWeight:500, color:'var(--text-primary)'}}>{r.name}</span>
                          </div>
                        </td>
                        <td>{r.role}</td>
                        <td>{statusBadge(r.status)}</td>
                        <td>{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Onboarding progress */}
            <div className="dash-section">
              <div className="section-header">
                <div>
                  <div className="section-title" style={{fontSize:17}}>Progresso de Onboarding</div>
                  <div className="section-subtitle">Colaboradores em integração</div>
                </div>
              </div>

              <div className="onboarding-list">
                {onboardingProgress.map((o, i) => (
                  <div key={i} className="onboarding-item">
                    <div className="flex items-center gap-3" style={{marginBottom: 10}}>
                      <div className="avatar avatar-sm">{o.name[0]}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600, fontSize:14}}>{o.name}</div>
                        <div style={{fontSize:12, color:'var(--text-muted)'}}>{o.day} de integração</div>
                      </div>
                      <span style={{fontSize:13, fontWeight:700, color:'var(--primary-light)'}}>{o.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${o.progress}%`}} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick alerts */}
              <div className="dash-alerts">
                <div className="dash-alert dash-alert-warn">
                  <AlertCircle size={14} />
                  3 documentos aguardando validação do RH
                </div>
                <div className="dash-alert dash-alert-ok">
                  <CheckCircle size={14} />
                  5 onboardings concluídos esta semana
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
