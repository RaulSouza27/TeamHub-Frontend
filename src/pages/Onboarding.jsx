import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { CheckCircle, Clock, BookOpen, Video, FileText, Award, ChevronRight, Lock } from 'lucide-react'
import './Onboarding.css'

const TRILHAS = [
  {
    id: 1, title: 'Integração Corporativa', progress: 100, done: true, color: '#6C47FF',
    modules: [
      { title: 'Bem-vindo à empresa',         type: 'video',     done: true,  duration: '10 min' },
      { title: 'Cultura e valores',           type: 'leitura',   done: true,  duration: '15 min' },
      { title: 'Organograma e equipes',       type: 'leitura',   done: true,  duration: '8 min'  },
      { title: 'Quiz de integração',          type: 'quiz',      done: true,  duration: '5 min'  },
    ]
  },
  {
    id: 2, title: 'Ferramentas e Sistemas', progress: 60, done: false, color: '#00C9A7',
    modules: [
      { title: 'Introdução ao TeamHub',       type: 'video',     done: true,  duration: '12 min' },
      { title: 'Sistemas internos – Tour',    type: 'video',     done: true,  duration: '20 min' },
      { title: 'Fluxo de aprovações',         type: 'leitura',   done: true,  duration: '10 min' },
      { title: 'Configuração de acesso',      type: 'tarefa',    done: false, duration: '15 min' },
      { title: 'Quiz de ferramentas',         type: 'quiz',      done: false, duration: '5 min'  },
    ]
  },
  {
    id: 3, title: 'Treinamento Técnico',   progress: 20, done: false, color: '#FF6B9D',
    modules: [
      { title: 'Boas práticas do setor',      type: 'leitura',   done: true,  duration: '25 min' },
      { title: 'Reunião com o gestor',        type: 'tarefa',    done: false, duration: '60 min' },
      { title: 'Capacitação técnica – Parte 1', type:'video',    done: false, duration: '45 min' },
      { title: 'Capacitação técnica – Parte 2', type:'video',    done: false, duration: '45 min' },
    ]
  },
  {
    id: 4, title: 'Avaliação de 30 dias',  progress: 0, done: false, color: '#F59E0B', locked: true,
    modules: [
      { title: 'Autoavaliação',              type: 'quiz',      done: false, duration: '20 min' },
      { title: 'Feedback do gestor',         type: 'tarefa',    done: false, duration: '30 min' },
      { title: 'Plano de desenvolvimento',   type: 'leitura',   done: false, duration: '15 min' },
    ]
  },
]

const typeIcon = (t) => {
  if (t === 'video')   return <Video size={14} style={{color:'#FF6B9D'}} />
  if (t === 'leitura') return <FileText size={14} style={{color:'#6C47FF'}} />
  if (t === 'quiz')    return <Award size={14} style={{color:'#F59E0B'}} />
  return <CheckCircle size={14} style={{color:'#00C9A7'}} />
}

export default function Onboarding() {
  const [active, setActive] = useState(1)
  const trilha = TRILHAS.find(t => t.id === active)
  const totalDone = TRILHAS.reduce((acc, t) => acc + t.modules.filter(m => m.done).length, 0)
  const totalModules = TRILHAS.reduce((acc, t) => acc + t.modules.length, 0)

  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <div className="page-body fade-in">
          <div className="section-header">
            <div>
              <h1 className="section-title">Gestão de Onboarding</h1>
              <p className="section-subtitle">Trilhas de integração e treinamento</p>
            </div>
            <div className="onb-summary">
              <div className="onb-summary-item">
                <strong>{totalDone}/{totalModules}</strong>
                <span>Módulos concluídos</span>
              </div>
              <div className="onb-summary-sep" />
              <div className="onb-summary-item">
                <strong>{Math.round(totalDone/totalModules*100)}%</strong>
                <span>Progresso geral</span>
              </div>
            </div>
          </div>

          {/* Global progress */}
          <div className="onb-global-progress">
            <div className="progress-bar" style={{height:8}}>
              <div className="progress-fill" style={{width:`${Math.round(totalDone/totalModules*100)}%`}} />
            </div>
          </div>

          <div className="onb-layout">
            {/* Sidebar de trilhas */}
            <div className="onb-trilhas">
              <p className="sidebar-section-label" style={{padding:'0 4px', marginBottom:12}}>Trilhas</p>
              {TRILHAS.map(t => (
                <button
                  key={t.id}
                  className={`onb-trilha-btn ${active === t.id ? 'active' : ''} ${t.locked ? 'locked' : ''}`}
                  onClick={() => !t.locked && setActive(t.id)}
                >
                  <div className="onb-trilha-top">
                    <div className="onb-trilha-icon" style={{background:`${t.color}22`, color:t.color}}>
                      {t.locked ? <Lock size={16}/> : t.done ? <CheckCircle size={16}/> : <BookOpen size={16}/>}
                    </div>
                    <div className="onb-trilha-info">
                      <div className="onb-trilha-title">{t.title}</div>
                      <div className="onb-trilha-sub">{t.modules.length} módulos</div>
                    </div>
                    <span className="onb-trilha-pct" style={{color:t.color}}>{t.progress}%</span>
                  </div>
                  <div className="progress-bar" style={{marginTop:10}}>
                    <div className="progress-fill" style={{width:`${t.progress}%`, background:`linear-gradient(90deg,${t.color},${t.color}99)`}} />
                  </div>
                </button>
              ))}
            </div>

            {/* Módulos da trilha ativa */}
            <div className="onb-content">
              {trilha && (
                <>
                  <div className="onb-trilha-header">
                    <div className="onb-trilha-icon-lg" style={{background:`${trilha.color}22`, color:trilha.color}}>
                      {trilha.done ? <CheckCircle size={24}/> : <BookOpen size={24}/>}
                    </div>
                    <div>
                      <h2>{trilha.title}</h2>
                      <p>{trilha.modules.filter(m=>m.done).length} de {trilha.modules.length} módulos concluídos</p>
                    </div>
                    {trilha.done && <span className="badge badge-success" style={{marginLeft:'auto'}}><Award size={12}/> Concluído</span>}
                  </div>

                  <div className="onb-modules">
                    {trilha.modules.map((mod, i) => (
                      <div key={i} className={`onb-module-item ${mod.done ? 'done' : ''}`}>
                        <div className={`check-box ${mod.done ? 'checked' : ''}`}>
                          {mod.done && <CheckCircle size={12} />}
                        </div>
                        <div className="onb-module-info">
                          <div className="onb-module-title">{mod.title}</div>
                          <div className="onb-module-meta">
                            {typeIcon(mod.type)}
                            <span style={{textTransform:'capitalize'}}>{mod.type}</span>
                            <span>·</span>
                            <Clock size={12} style={{opacity:0.5}} />
                            <span>{mod.duration}</span>
                          </div>
                        </div>
                        {!mod.done && (
                          <button className="btn btn-primary btn-sm" style={{marginLeft:'auto'}}>
                            Iniciar <ChevronRight size={13}/>
                          </button>
                        )}
                        {mod.done && (
                          <span className="badge badge-success" style={{marginLeft:'auto'}}>Feito</span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
