import { useState, useRef, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { Send, Search, Image, Paperclip, Heart, MessageSquare, Bell, Megaphone, Hash, ChevronRight, MoreHorizontal } from 'lucide-react'
import './Comunicacao.css'

/* ── Mock data ── */
const CHANNELS = [
  { id: 'geral',      name: 'geral',         icon: <Hash size={14}/>,   unread: 2 },
  { id: 'rh',         name: 'rh-avisos',     icon: <Hash size={14}/>,   unread: 0 },
  { id: 'onboarding', name: 'onboarding',    icon: <Hash size={14}/>,   unread: 5 },
  { id: 'tech',       name: 'tecnologia',    icon: <Hash size={14}/>,   unread: 0 },
]

const DMS = [
  { id: 'dm1', name: 'Bruno Santos',  role: 'RH',     online: true,  avatar: 'BS', color:'#6C47FF' },
  { id: 'dm2', name: 'Carlos Mendes', role: 'Gestor', online: true,  avatar: 'CM', color:'#00C9A7' },
  { id: 'dm3', name: 'Fernanda Lima', role: 'RH',     online: false, avatar: 'FL', color:'#FF6B9D' },
]

const INITIAL_MESSAGES = {
  geral: [
    { id:1, user:'Bruno Santos',  avatar:'BS', color:'#6C47FF', time:'09:12', text:'Bom dia pessoal! Bem-vindos ao TeamHub 🎉', mine:false },
    { id:2, user:'Carlos Mendes', avatar:'CM', color:'#00C9A7', time:'09:15', text:'Bom dia! Muito bom ter esse canal de comunicação.', mine:false },
    { id:3, user:'Você',          avatar:'VC', color:'#8B6CFF', time:'09:18', text:'Olá equipe! Animado para começar! 🚀', mine:true },
    { id:4, user:'Bruno Santos',  avatar:'BS', color:'#6C47FF', time:'09:20', text:'Lembrando que amanhã às 10h tem reunião de alinhamento no Teams.', mine:false },
  ],
  rh: [
    { id:1, user:'Bruno Santos',  avatar:'BS', color:'#6C47FF', time:'08:30', text:'📢 Novo colaborador iniciando hoje: Thiago Alves, Gerente de Projetos.', mine:false },
    { id:2, user:'Fernanda Lima', avatar:'FL', color:'#FF6B9D', time:'08:45', text:'Bem-vindo Thiago! 🎊', mine:false },
  ],
  onboarding: [
    { id:1, user:'Carlos Mendes', avatar:'CM', color:'#00C9A7', time:'10:00', text:'Pessoal, como está indo o onboarding de vocês?', mine:false },
    { id:2, user:'Você',          avatar:'VC', color:'#8B6CFF', time:'10:05', text:'Estou no módulo de ferramentas, muito bom até aqui!', mine:true },
    { id:3, user:'Bruno Santos',  avatar:'BS', color:'#6C47FF', time:'10:08', text:'Ótimo! Se precisar de ajuda é só chamar 😊', mine:false },
    { id:4, user:'Você',          avatar:'VC', color:'#8B6CFF', time:'10:10', text:'Obrigado! Adorei a trilha de integração corporativa.', mine:true },
    { id:5, user:'Carlos Mendes', avatar:'CM', color:'#00C9A7', time:'10:12', text:'Que bom! O feedback de vocês é muito importante. Continuem assim! 💪', mine:false },
  ],
  tech: [
    { id:1, user:'Carlos Mendes', avatar:'CM', color:'#00C9A7', time:'14:00', text:'Atualização do sistema agendada para sexta-feira à noite.', mine:false },
  ],
  dm1: [
    { id:1, user:'Bruno Santos',  avatar:'BS', color:'#6C47FF', time:'11:00', text:'Oi! Seus documentos foram recebidos com sucesso ✅', mine:false },
    { id:2, user:'Você',          avatar:'VC', color:'#8B6CFF', time:'11:02', text:'Ótimo! Quando sai o resultado da análise?', mine:true },
    { id:3, user:'Bruno Santos',  avatar:'BS', color:'#6C47FF', time:'11:05', text:'Normalmente em até 2 dias úteis. Qualquer dúvida pode me chamar!', mine:false },
  ],
  dm2: [
    { id:1, user:'Carlos Mendes', avatar:'CM', color:'#00C9A7', time:'09:00', text:'Olá! Bem-vindo à equipe! Vamos agendar nossa primeira reunião?', mine:false },
    { id:2, user:'Você',          avatar:'VC', color:'#8B6CFF', time:'09:05', text:'Olá Carlos! Claro, pode me passar os horários disponíveis.', mine:true },
  ],
  dm3: [],
}

const POSTS = [
  {
    id: 1, author: 'Bruno Santos', role: 'RH', avatar: 'BS', color: '#6C47FF', time: 'há 2h',
    content: '🎉 Bem-vindos ao novo portal de comunicação interna da empresa! Agora vocês podem acompanhar todos os comunicados e interagir com a equipe em tempo real.',
    likes: 12, comments: 4, pinned: true,
  },
  {
    id: 2, author: 'Carlos Mendes', role: 'Gestor', avatar: 'CM', color: '#00C9A7', time: 'há 5h',
    content: '📊 Resultado do mês de março: batemos 108% da meta de contratações! Parabéns a toda a equipe de RH pelo excelente trabalho. 💪',
    likes: 28, comments: 9, pinned: false,
  },
  {
    id: 3, author: 'Fernanda Lima', role: 'Analista de RH', avatar: 'FL', color: '#FF6B9D', time: 'há 1d',
    content: '📢 Lembrete: Prazo para entrega da autoavaliação de desempenho é dia 30/04. Por favor, acessem o formulário no módulo de onboarding.',
    likes: 7, comments: 2, pinned: false,
  },
]

let msgIdCounter = 100

export default function Comunicacao() {
  const { user } = useAuth()
  const [activeTab, setActiveTab]     = useState('chat')
  const [activeChannel, setActiveChannel] = useState('onboarding')
  const [messages, setMessages]       = useState(INITIAL_MESSAGES)
  const [input, setInput]             = useState('')
  const [search, setSearch]           = useState('')
  const [likedPosts, setLikedPosts]   = useState({})
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeChannel])

  const sendMessage = (e) => {
    e && e.preventDefault()
    if (!input.trim()) return
    const newMsg = {
      id: ++msgIdCounter,
      user: user?.name || 'Você',
      avatar: (user?.name || 'VC').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
      color: '#8B6CFF',
      time: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}),
      text: input.trim(),
      mine: true,
    }
    setMessages(prev => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), newMsg] }))
    setInput('')
  }

  const channelLabel = () => {
    const ch = CHANNELS.find(c => c.id === activeChannel)
    if (ch) return `#${ch.name}`
    const dm = DMS.find(d => d.id === activeChannel)
    return dm ? dm.name : activeChannel
  }

  const toggleLike = (id) => setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <div className="page-body fade-in" style={{padding: 0}}>
          <div className="comm-layout">

            {/* ── Channels sidebar ── */}
            <div className="comm-sidebar">
              <div className="comm-sidebar-head">
                <div className="comm-sidebar-title">Comunicação</div>
              </div>

              <div className="comm-tab-row">
                <button className={`comm-tab ${activeTab==='chat' ? 'active':''}`} onClick={()=>setActiveTab('chat')}>
                  <MessageSquare size={14}/> Chat
                </button>
                <button className={`comm-tab ${activeTab==='mural' ? 'active':''}`} onClick={()=>setActiveTab('mural')}>
                  <Megaphone size={14}/> Mural
                </button>
              </div>

              {activeTab === 'chat' && (
                <>
                  <p className="comm-ch-label">Canais</p>
                  {CHANNELS.map(ch => (
                    <button
                      key={ch.id}
                      className={`comm-ch-btn ${activeChannel === ch.id ? 'active' : ''}`}
                      onClick={() => setActiveChannel(ch.id)}
                    >
                      <span className="comm-ch-icon">{ch.icon}</span>
                      <span>{ch.name}</span>
                      {ch.unread > 0 && <span className="comm-unread">{ch.unread}</span>}
                    </button>
                  ))}

                  <p className="comm-ch-label" style={{marginTop:16}}>Mensagens Diretas</p>
                  {DMS.map(dm => (
                    <button
                      key={dm.id}
                      className={`comm-ch-btn ${activeChannel === dm.id ? 'active' : ''}`}
                      onClick={() => setActiveChannel(dm.id)}
                    >
                      <div style={{position:'relative'}}>
                        <div className="avatar avatar-sm" style={{background: dm.color}}>{dm.avatar}</div>
                        {dm.online && <div className="online-dot" />}
                      </div>
                      <span style={{flex:1}}>{dm.name}</span>
                    </button>
                  ))}
                </>
              )}

              {activeTab === 'mural' && (
                <div style={{padding:'8px 0'}}>
                  <p className="comm-ch-label">Publicações</p>
                  {POSTS.map(p => (
                    <button
                      key={p.id}
                      className="comm-ch-btn"
                      style={{flexDirection:'column', alignItems:'flex-start', gap:4}}
                    >
                      <span style={{fontWeight:600, fontSize:13}}>{p.author}</span>
                      <span style={{fontSize:11, color:'var(--text-muted)', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', width:'100%'}}>
                        {p.content.slice(0,40)}...
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Main area ── */}
            <div className="comm-main">
              {activeTab === 'chat' && (
                <>
                  <div className="comm-topbar">
                    <div className="comm-topbar-info">
                      <span className="comm-channel-name">{channelLabel()}</span>
                      {CHANNELS.find(c => c.id === activeChannel) && (
                        <span className="comm-channel-desc">Canal da equipe • {(messages[activeChannel]||[]).length} mensagens</span>
                      )}
                      {DMS.find(d => d.id === activeChannel) && (
                        <span className="comm-channel-desc">
                          {DMS.find(d=>d.id===activeChannel)?.online ? '🟢 Online agora' : '⚫ Offline'}
                        </span>
                      )}
                    </div>
                    <div className="comm-topbar-actions">
                      <div className="input-wrap" style={{width:200}}>
                        <Search size={14} className="input-icon" />
                        <input
                          className="form-input"
                          placeholder="Buscar..."
                          value={search}
                          onChange={e=>setSearch(e.target.value)}
                          style={{padding:'7px 10px 7px 34px', fontSize:13}}
                        />
                      </div>
                      <button className="btn btn-ghost btn-sm"><Bell size={14}/></button>
                      <button className="btn btn-ghost btn-sm"><MoreHorizontal size={14}/></button>
                    </div>
                  </div>

                  <div className="chat-messages">
                    {(messages[activeChannel] || [])
                      .filter(m => !search || m.text.toLowerCase().includes(search.toLowerCase()))
                      .map((msg, i, arr) => {
                        const showName = i === 0 || arr[i-1].user !== msg.user
                        return (
                          <div key={msg.id} className={`msg-row ${msg.mine ? 'mine':''}`}>
                            {!msg.mine && showName && (
                              <div className="avatar avatar-sm" style={{background:msg.color, alignSelf:'flex-end'}}>{msg.avatar}</div>
                            )}
                            {!msg.mine && !showName && <div style={{width:32}} />}
                            <div>
                              {showName && !msg.mine && (
                                <div className="msg-name">{msg.user} <span className="msg-time-top">{msg.time}</span></div>
                              )}
                              <div className={`chat-bubble ${msg.mine ? 'mine':'other'}`}>
                                {msg.text}
                                {msg.mine && <span className="chat-time">{msg.time}</span>}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    <div ref={bottomRef} />
                  </div>

                  <form className="chat-input-row" onSubmit={sendMessage}>
                    <button type="button" className="chat-attach"><Paperclip size={16}/></button>
                    <button type="button" className="chat-attach"><Image size={16}/></button>
                    <input
                      className="chat-input"
                      placeholder={`Mensagem em ${channelLabel()}...`}
                      value={input}
                      onChange={e=>setInput(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendMessage()}
                    />
                    <button type="submit" className="chat-send-btn" disabled={!input.trim()}>
                      <Send size={16}/>
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'mural' && (
                <div className="mural-content">
                  <div className="mural-header">
                    <h2>Mural de Comunicados</h2>
                    <button className="btn btn-primary btn-sm"><Megaphone size={14}/> Publicar</button>
                  </div>
                  <div className="mural-posts">
                    {POSTS.map(post => (
                      <div key={post.id} className="mural-post">
                        {post.pinned && (
                          <div className="mural-pinned"><Bell size={12}/> Fixado</div>
                        )}
                        <div className="mural-post-header">
                          <div className="avatar avatar-md" style={{background:post.color}}>{post.avatar}</div>
                          <div>
                            <div className="mural-author">{post.author}</div>
                            <div className="mural-meta">{post.role} · {post.time}</div>
                          </div>
                          <button className="btn btn-ghost btn-sm" style={{marginLeft:'auto'}}><MoreHorizontal size={14}/></button>
                        </div>
                        <div className="mural-post-body">{post.content}</div>
                        <div className="mural-post-footer">
                          <button
                            className={`mural-action ${likedPosts[post.id] ? 'liked':''}`}
                            onClick={() => toggleLike(post.id)}
                          >
                            <Heart size={14} fill={likedPosts[post.id] ? 'currentColor':''} />
                            {post.likes + (likedPosts[post.id] ? 1 : 0)}
                          </button>
                          <button className="mural-action">
                            <MessageSquare size={14}/> {post.comments}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
