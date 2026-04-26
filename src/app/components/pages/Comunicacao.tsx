import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Image,
  Smile,
  MoreHorizontal,
  Pin,
  TrendingUp,
  Bell,
  Filter,
  Search,
  Paperclip,
  MoreVertical,
  X,
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  pinned?: boolean;
  category?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface ChatUser {
  id: string;
  name: string;
  role: string;
  online: boolean;
  unreadCount?: number;
}

export function Comunicacao() {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: { name: "RH TeamHub", role: "Recursos Humanos" },
      content:
        "🎉 Bem-vindos aos novos colaboradores que iniciaram esta semana! Estamos muito felizes em tê-los conosco. Não hesitem em compartilhar suas primeiras impressões e experiências aqui!",
      timestamp: "Há 2 horas",
      likes: 24,
      comments: 8,
      shares: 3,
      pinned: true,
      category: "Anúncio",
    },
    {
      id: "2",
      author: { name: "Carlos Oliveira", role: "Gestor de Tecnologia" },
      content:
        "Equipe, estou muito orgulhoso do trabalho que fizemos neste sprint! Conseguimos entregar todas as features planejadas com qualidade excepcional. Parabéns a todos! 🚀",
      timestamp: "Há 4 horas",
      likes: 42,
      comments: 15,
      shares: 5,
      category: "Reconhecimento",
    },
    {
      id: "3",
      author: { name: "Maria Santos", role: "RH" },
      content:
        "📚 Lembrete: Hoje às 15h teremos o workshop sobre Gestão de Tempo e Produtividade. A sessão será online e todos estão convidados! Link na agenda compartilhada.",
      timestamp: "Há 6 horas",
      likes: 18,
      comments: 4,
      shares: 12,
      category: "Evento",
    },
    {
      id: "4",
      author: { name: "João Silva", role: "Desenvolvedor Frontend" },
      content:
        "Meu primeiro dia foi incrível! A equipe me recebeu super bem e já me sinto parte do time. Muito animado para começar a contribuir com os projetos! 💙",
      timestamp: "Há 1 dia",
      likes: 56,
      comments: 23,
      shares: 2,
      category: "Geral",
    },
    {
      id: "5",
      author: { name: "Ana Paula Costa", role: "Desenvolvedora Backend" },
      content:
        "Alguém tem dicas de bons restaurantes perto do escritório? Estou nova na região e procurando opções para o almoço! 🍽️",
      timestamp: "Há 1 dia",
      likes: 12,
      comments: 18,
      shares: 0,
      category: "Geral",
    },
    {
      id: "6",
      author: { name: "Beatriz Carvalho", role: "Product Manager" },
      content:
        "📊 Compartilhando os resultados do roadmap Q1: entregamos 89% das features planejadas, reduzimos o tempo de ciclo em 18% e tivemos NPS de 4.7 com os stakeholders. Orgulhosa da evolução do time! 💪",
      timestamp: "Há 2 dias",
      likes: 67,
      comments: 29,
      shares: 14,
      category: "Reconhecimento",
    },
    {
      id: "7",
      author: { name: "RH TeamHub", role: "Recursos Humanos" },
      content:
        "📋 Pesquisa de Clima Organizacional 2026 — Sua opinião é fundamental para continuarmos evoluindo! A pesquisa é anônima e leva apenas 8 minutos. O prazo encerra dia 30/04. Contamos com a sua participação! 🙏",
      timestamp: "Há 2 dias",
      likes: 31,
      comments: 7,
      shares: 22,
      pinned: false,
      category: "Anúncio",
    },
    {
      id: "8",
      author: { name: "Lucas Ferreira", role: "Engenheiro de Software" },
      content:
        "Acabei de concluir minha primeira semana aqui e posso dizer: a cultura da empresa é incrível! O ambiente é colaborativo, as pessoas são acessíveis e os projetos são desafiadores. Mal posso esperar pelo que vem aí! 🔥",
      timestamp: "Há 3 dias",
      likes: 44,
      comments: 11,
      shares: 1,
      category: "Geral",
    },
    {
      id: "9",
      author: { name: "Fernanda Lima", role: "Coordenadora de Marketing" },
      content:
        "🎯 EVENTO: Na próxima sexta-feira teremos o nosso Happy Hour Mensal presencial no escritório! Haverá música, petiscos e muita integração. Confirme sua presença no formulário da intranet. Esperamos por você! 🎊",
      timestamp: "Há 3 dias",
      likes: 89,
      comments: 34,
      shares: 19,
      category: "Evento",
    },
    {
      id: "10",
      author: { name: "Carlos Oliveira", role: "Gestor de Tecnologia" },
      content:
        "Parabéns ao Pedro Santos pela certificação AWS Solutions Architect que conquistou essa semana! É o tipo de iniciativa que inspira toda a equipe. 🏆 Continue crescendo!",
      timestamp: "Há 4 dias",
      likes: 73,
      comments: 18,
      shares: 6,
      category: "Reconhecimento",
    },
  ]);

  const [newPostContent, setNewPostContent] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleNewPost = () => {
    if (!newPostContent.trim() || !user) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: user.name,
        role:
          user.role === "rh"
            ? "RH"
            : user.role === "gestor"
              ? "Gestor"
              : "Colaborador",
      },
      content: newPostContent,
      timestamp: "Agora",
      likes: 0,
      comments: 0,
      shares: 0,
      category: "Geral",
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };

  const filters = ["Todos", "Anúncio", "Reconhecimento", "Evento", "Geral"];
  const filteredPosts =
    selectedFilter === "Todos"
      ? posts
      : posts.filter((post) => post.category === selectedFilter);

  if (!user) return null;

  return (
    <div className="p-8">
      {/* Botão de Chat Flutuante */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
            3
          </span>
        </button>
      )}

      {/* Chat Modal */}
      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}

      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Comunicação Interna</h1>
        <p className="text-gray-600">
          Conecte-se com seus colegas e fique por dentro das novidades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Criar Post */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Compartilhe algo com a equipe..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Image className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={handleNewPost}
                    disabled={!newPostContent.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-600 shrink-0" />
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedFilter === filter
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => handleLike(post.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Destaques */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg text-gray-900">Em Alta</h2>
            </div>
            <div className="space-y-3">
              <TrendingItem title="Nova política de home office" engagement="127 interações" />
              <TrendingItem title="Resultados do trimestre Q1" engagement="98 interações" />
              <TrendingItem title="Evento de integração de maio" engagement="84 interações" />
              <TrendingItem title="Pesquisa de clima 2026" engagement="71 interações" />
              <TrendingItem title="Certificação AWS do Pedro" engagement="54 interações" />
            </div>
          </div>

          {/* Próximos Eventos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg text-gray-900">Próximos Eventos</h2>
            </div>
            <div className="space-y-3">
              <EventItem title="Workshop de Produtividade" date="Hoje às 15:00" color="blue" />
              <EventItem title="Happy Hour Mensal" date="Sexta às 18:00" color="purple" />
              <EventItem title="Palestra sobre Inovação" date="28/04 às 10:00" color="green" />
              <EventItem title="All-Hands — Resultados Q1" date="29/04 às 09:00" color="blue" />
              <EventItem title="Confraternização de boas-vindas" date="02/05 às 17:30" color="purple" />
            </div>
          </div>

          {/* Aniversariantes */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-sm p-6 border border-pink-100">
            <h2 className="text-lg text-gray-900 mb-4">🎂 Aniversariantes</h2>
            <div className="space-y-3">
              <BirthdayItem name="Juliana Martins" date="Hoje" />
              <BirthdayItem name="Roberto Lima" date="Amanhã" />
              <BirthdayItem name="Fernanda Costa" date="27/04" />
              <BirthdayItem name="Thiago Mendonça" date="29/04" />
              <BirthdayItem name="Camila Rodrigues" date="02/05" />
            </div>
          </div>

          {/* Conquistas Recentes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg text-gray-900 mb-4">🏆 Conquistas</h2>
            <div className="space-y-3">
              <AchievementItem name="Pedro Santos" achievement="Certificação AWS Solutions Architect" />
              <AchievementItem name="Ana Costa" achievement="3 anos de empresa" />
              <AchievementItem name="Fernando Alves" achievement="Completou onboarding em 15 dias" />
              <AchievementItem name="Maria Souza" achievement="1° entrega do trimestre aprovada" />
              <AchievementItem name="Renata Dias" achievement="5 anos de empresa" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, onLike }: { post: Post; onLike: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header do Post */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg shrink-0">
            {post.author.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-gray-900">{post.author.name}</h3>
              {post.pinned && (
                <Pin className="w-4 h-4 text-blue-600" fill="currentColor" />
              )}
            </div>
            <p className="text-sm text-gray-600">{post.author.role}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.category && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {post.category}
            </span>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="mt-4 rounded-lg w-full object-cover"
          />
        )}
      </div>

      {/* Estatísticas */}
      <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 text-sm text-gray-600">
        <span>{post.likes} curtidas</span>
        <div className="flex gap-4">
          <span>{post.comments} comentários</span>
          <span>{post.shares} compartilhamentos</span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 pt-3">
        <button
          onClick={onLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
            post.liked
              ? "text-red-600 bg-red-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Heart
            className="w-5 h-5"
            fill={post.liked ? "currentColor" : "none"}
          />
          <span className="text-sm">Curtir</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">Comentar</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
          <Share2 className="w-5 h-5" />
          <span className="text-sm">Compartilhar</span>
        </button>
      </div>
    </div>
  );
}

function TrendingItem({
  title,
  engagement,
}: {
  title: string;
  engagement: string;
}) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
      <p className="text-sm text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-600">{engagement}</p>
    </div>
  );
}

function EventItem({
  title,
  date,
  color,
}: {
  title: string;
  date: string;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div
        className={`w-2 h-2 rounded-full mt-2 ${colorClasses[color as keyof typeof colorClasses]}`}
      />
      <div className="flex-1">
        <p className="text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{date}</p>
      </div>
    </div>
  );
}

function BirthdayItem({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm text-gray-900">{name}</p>
          <p className="text-xs text-gray-600">{date}</p>
        </div>
      </div>
      <button className="text-xs bg-pink-600 text-white px-3 py-1 rounded-full hover:bg-pink-700 transition">
        Parabenizar
      </button>
    </div>
  );
}

function AchievementItem({
  name,
  achievement,
}: {
  name: string;
  achievement: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
        🏆
      </div>
      <div>
        <p className="text-sm text-gray-900">{name}</p>
        <p className="text-xs text-gray-600">{achievement}</p>
      </div>
    </div>
  );
}

// Componente de Chat
function ChatPanel({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [users] = useState<ChatUser[]>([
    { id: "2", name: "Maria Santos", role: "RH", online: true, unreadCount: 2 },
    { id: "3", name: "Carlos Oliveira", role: "Gestor de Tecnologia", online: true },
    { id: "4", name: "João Silva", role: "Desenvolvedor Frontend", online: true, unreadCount: 1 },
    { id: "5", name: "Ana Paula Costa", role: "Desenvolvedora Backend", online: false },
    { id: "6", name: "Juliana Martins", role: "Analista de Marketing", online: true, unreadCount: 3 },
    { id: "7", name: "Pedro Santos", role: "Analista de Dados", online: true },
    { id: "8", name: "Beatriz Carvalho", role: "Product Manager", online: false },
    { id: "9", name: "Lucas Ferreira", role: "Engenheiro de Software", online: true },
    { id: "10", name: "Fernando Alves", role: "Analista Financeiro", online: false },
    { id: "11", name: "Fernanda Lima", role: "Coordenadora de Marketing", online: true },
    { id: "12", name: "Renata Dias", role: "Analista de RH", online: false },
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "2",
      senderName: "Maria Santos",
      content: "Oi! Não esqueça de preencher a pesquisa de clima até amanhã 😊",
      timestamp: "10:30",
    },
    {
      id: "2",
      senderId: "1",
      senderName: "Você",
      content: "Olá Maria! Pode deixar, vou preencher hoje mesmo!",
      timestamp: "10:32",
    },
    {
      id: "3",
      senderId: "2",
      senderName: "Maria Santos",
      content: "Perfeito! Qualquer dúvida estou à disposição.",
      timestamp: "10:33",
    },
    {
      id: "4",
      senderId: "4",
      senderName: "João Silva",
      content: "Pessoal, alguém sabe onde fica a sala de reunião 3?",
      timestamp: "11:15",
    },
    {
      id: "5",
      senderId: "1",
      senderName: "Você",
      content: "Fica no segundo andar, ao lado da copa!",
      timestamp: "11:16",
    },
    {
      id: "6",
      senderId: "4",
      senderName: "João Silva",
      content: "Obrigado! 🙏",
      timestamp: "11:17",
    },
    {
      id: "7",
      senderId: "6",
      senderName: "Juliana Martins",
      content: "Oi pessoal! Alguém vai ao happy hour de sexta?",
      timestamp: "13:05",
    },
    {
      id: "8",
      senderId: "1",
      senderName: "Você",
      content: "Com certeza! Já marquei na agenda 🎉",
      timestamp: "13:07",
    },
    {
      id: "9",
      senderId: "3",
      senderName: "Carlos Oliveira",
      content: "Toda a equipe de TI vai estar lá. Vejo vocês sexta!",
      timestamp: "13:10",
    },
    {
      id: "10",
      senderId: "9",
      senderName: "Lucas Ferreira",
      content: "Acabei de chegar e já fui convidado pro happy hour hahaha. Esse time é demais 😄",
      timestamp: "14:22",
    },
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: "Você",
      content: messageInput,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUserData = users.find((u) => u.id === selectedUser);
  const userMessages = selectedUser
    ? messages.filter(
        (m) => m.senderId === selectedUser || m.senderId === user?.id
      )
    : messages;

  const totalUnread = users.reduce((acc, u) => acc + (u.unreadCount || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[700px] flex overflow-hidden">
        {/* Sidebar - Lista de Conversas */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl text-gray-900">Chat</h2>
                <p className="text-xs text-gray-500">
                  {totalUnread} mensagens não lidas
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar pessoas..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
              />
            </div>
          </div>

          {/* Lista de Conversas */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.map((chatUser) => (
              <button
                key={chatUser.id}
                onClick={() => setSelectedUser(chatUser.id)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-white transition border-b border-gray-100 ${
                  selectedUser === chatUser.id ? "bg-white" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shrink-0">
                    {chatUser.name.charAt(0)}
                  </div>
                  {chatUser.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-900 truncate font-medium">
                      {chatUser.name}
                    </p>
                    {chatUser.unreadCount && chatUser.unreadCount > 0 && (
                      <span className="ml-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shrink-0">
                        {chatUser.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {chatUser.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header do Chat */}
          {selectedUserData ? (
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                    {selectedUserData.name.charAt(0)}
                  </div>
                  {selectedUserData.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{selectedUserData.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedUserData.online ? "🟢 Online" : "⚪ Offline"}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Chat TeamHub</p>
                  <p className="text-xs text-gray-600">
                    Selecione uma conversa para começar
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {!selectedUser ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="w-20 h-20 mb-4 text-gray-300" />
                <p className="text-lg text-gray-500">Selecione uma conversa</p>
                <p className="text-sm text-gray-400">
                  Escolha um contato para começar a conversar
                </p>
              </div>
            ) : userMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="w-20 h-20 mb-4 text-gray-300" />
                <p className="text-lg text-gray-500">Nenhuma mensagem ainda</p>
                <p className="text-sm text-gray-400">
                  Seja o primeiro a iniciar a conversa!
                </p>
              </div>
            ) : (
              userMessages.map((message) => {
                const isOwn = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-md ${isOwn ? "order-2" : "order-1"}`}>
                      {!isOwn && (
                        <p className="text-xs text-gray-500 mb-1 ml-3">
                          {message.senderName}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-5 py-3 ${
                          isOwn
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                            : "bg-white text-gray-900 shadow-md border border-gray-100"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-1.5 ${
                            isOwn ? "text-white/80" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input de Mensagem */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-3">
              <button className="p-2.5 hover:bg-gray-100 rounded-lg transition">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-lg transition">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  rows={2}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-24">
              Pressione <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">Enter</kbd> para enviar • <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">Shift + Enter</kbd> para nova linha
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
