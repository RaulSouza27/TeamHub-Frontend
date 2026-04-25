import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, UserPlus, BookOpen, MessageSquare,
  LogOut, Users, Bell, Settings, ChevronRight
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { to: '/dashboard',   icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admissao',    icon: <UserPlus size={18} />,        label: 'Admissão' },
  { to: '/onboarding',  icon: <BookOpen size={18} />,        label: 'Onboarding' },
  { to: '/comunicacao', icon: <MessageSquare size={18} />,   label: 'Comunicação' },
]

export default function Sidebar() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const logout = () => {
    setUser(null)
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"><Users size={16} /></div>
        <span className="sidebar-logo-text">TeamHub</span>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Menu Principal</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
            <ChevronRight size={14} className="sidebar-arrow" />
          </NavLink>
        ))}

        <p className="sidebar-section-label" style={{marginTop: 24}}>Sistema</p>
        <button className="sidebar-link">
          <span className="sidebar-link-icon"><Bell size={18} /></span>
          <span className="sidebar-link-label">Notificações</span>
          <span className="sidebar-badge">3</span>
        </button>
        <button className="sidebar-link">
          <span className="sidebar-link-icon"><Settings size={18} /></span>
          <span className="sidebar-link-label">Configurações</span>
        </button>
      </nav>

      <div className="sidebar-user">
        <div className="avatar avatar-md" style={{background:`linear-gradient(135deg, #6C47FF, #FF6B9D)`}}>
          {user?.name?.[0] || 'U'}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name || 'Usuário'}</div>
          <div className="sidebar-user-role">{user?.role || 'Colaborador'}</div>
        </div>
        <button className="sidebar-logout" onClick={logout} title="Sair">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
