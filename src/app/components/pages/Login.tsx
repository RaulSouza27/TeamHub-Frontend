import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Building2, Mail, Lock, Loader2, Users, Target, TrendingUp, Sparkles } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Imagem e Informações */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Imagem de fundo com overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1758691736843-90f58dce465e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Equipe colaborando"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-500/90" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo e Nome */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl">TeamHub</h1>
              <p className="text-sm text-white/80">Gestão de Pessoas</p>
            </div>
          </div>

          {/* Informações Centrais */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl mb-4 leading-tight">
                Transforme a gestão
                <br />
                de pessoas da sua
                <br />
                organização
              </h2>
              <p className="text-lg text-white/90 max-w-md">
                Plataforma integrada para admissão digital, onboarding e comunicação interna.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Admissão Digital</p>
                  <p className="text-sm text-white/80">Automatize processos de entrada</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Onboarding Estruturado</p>
                  <p className="text-sm text-white/80">Trilhas personalizadas de integração</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Comunicação Integrada</p>
                  <p className="text-sm text-white/80">Conecte toda a organização</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Sparkles className="w-4 h-4" />
            <p>Desenvolvido para equipes modernas e ágeis</p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Header Mobile */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Building2 className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-1">TeamHub</h1>
            <p className="text-gray-600">Bem-vindo de volta!</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl text-gray-900 mb-2">Bem-vindo de volta!</h2>
            <p className="text-gray-600">Acesse sua conta para continuar</p>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-gray-700">
                    Senha
                  </label>
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
                    Esqueceu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar na Plataforma"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Contas de demonstração</span>
              </div>
            </div>

            {/* Usuários Demo - Compacto */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("colaborador@teamhub.com");
                  setPassword("123456");
                }}
                className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200"
              >
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Colaborador</span> · colaborador@teamhub.com
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("rh@teamhub.com");
                  setPassword("123456");
                }}
                className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition border border-purple-200"
              >
                <p className="text-sm text-purple-900">
                  <span className="font-medium">RH</span> · rh@teamhub.com
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("gestor@teamhub.com");
                  setPassword("123456");
                }}
                className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition border border-green-200"
              >
                <p className="text-sm text-green-900">
                  <span className="font-medium">Gestor</span> · gestor@teamhub.com
                </p>
              </button>

              <p className="text-xs text-gray-500 text-center pt-2">
                Clique em qualquer conta para preencher automaticamente (senha: 123456)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
