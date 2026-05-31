import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  MessageSquare,
  LogOut,
  Building2,
  Menu,
  ChevronDown,
  Users,
} from "lucide-react";
import { useState } from "react";

export function RootLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
      roles: ["colaborador", "rh", "gestor"],
    },
    {
      icon: UserPlus,
      label: "Admissão Digital",
      path: "/admissao",
      roles: ["colaborador", "rh", "gestor"], // Acessível a todos
    },
    {
      icon: Users,
      label: "Usuários",
      path: "/usuarios",
      roles: ["rh"], // Exclusivo para RH
    },
    {
      icon: GraduationCap,
      label: "Onboarding",
      path: "/onboarding",
      roles: ["colaborador", "rh", "gestor"],
    },
    {
      icon: MessageSquare,
      label: "Comunicação",
      path: "/comunicacao",
      roles: ["colaborador", "rh", "gestor"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "rh":
        return "bg-purple-100 text-purple-700";
      case "gestor":
        return "bg-green-100 text-green-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "rh":
        return "RH";
      case "gestor":
        return "Gestor";
      default:
        return "Colaborador";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"
          } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shrink-0`}
      >
        {/* Header — Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg text-gray-900">TeamHub</h1>
                <p className="text-xs text-gray-500">Gestão de Pessoas</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 hover:bg-gray-50 transition flex items-center justify-center border-b border-gray-200"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                  } ${!sidebarOpen && "justify-center"}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Right side: topbar + content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end shrink-0">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              {/* Avatar */}
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name.charAt(0)}
              </div>
              {/* Info */}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {user.name}
                </p>
                <span
                  className={`inline-block text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}
                >
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {/* Logout */}
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sair da conta</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay para fechar o menu ao clicar fora */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
}
