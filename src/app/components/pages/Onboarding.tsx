import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  CheckCircle,
  Circle,
  Clock,
  Play,
  BookOpen,
  Users,
  Video,
  FileText,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  type: "video" | "reading" | "task" | "meeting";
  duration: string;
  completed: boolean;
  current?: boolean;
}

interface OnboardingTrack {
  id: string;
  title: string;
  description: string;
  progress: number;
  tasks: OnboardingTask[];
}

export function Onboarding() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Gestão de Onboarding</h1>
        <p className="text-gray-600">
          {user.role === "rh" || user.role === "gestor"
            ? "Acompanhe e gerencie o processo de integração"
            : "Sua trilha de integração e desenvolvimento"}
        </p>
      </div>

      {user.role === "colaborador" && <ColaboradorOnboardingView />}
      {user.role === "rh" && <RHOnboardingView />}
      {user.role === "gestor" && <GestorOnboardingView />}
    </div>
  );
}

function ColaboradorOnboardingView() {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [tracks] = useState<OnboardingTrack[]>([
    {
      id: "1",
      title: "Integração Inicial",
      description: "Conhecendo a empresa e a cultura",
      progress: 80,
      tasks: [
        {
          id: "1-1",
          title: "Vídeo de Boas-vindas",
          description: "Mensagem do CEO e visão geral da empresa",
          type: "video",
          duration: "15 min",
          completed: true,
        },
        {
          id: "1-2",
          title: "História e Cultura",
          description: "Conheça nossa história, missão e valores",
          type: "reading",
          duration: "20 min",
          completed: true,
        },
        {
          id: "1-3",
          title: "Tour Virtual",
          description: "Conheça as instalações e departamentos",
          type: "video",
          duration: "10 min",
          completed: true,
        },
        {
          id: "1-4",
          title: "Código de Conduta",
          description: "Leia e assine o código de conduta",
          type: "task",
          duration: "30 min",
          completed: true,
          current: true,
        },
        {
          id: "1-5",
          title: "Políticas da Empresa",
          description: "Conheça as principais políticas internas",
          type: "reading",
          duration: "25 min",
          completed: false,
        },
      ],
    },
    {
      id: "2",
      title: "Conhecendo a Equipe",
      description: "Integração com colegas e gestores",
      progress: 60,
      tasks: [
        {
          id: "2-1",
          title: "Reunião com Gestor",
          description: "Alinhamento de expectativas e objetivos",
          type: "meeting",
          duration: "45 min",
          completed: true,
        },
        {
          id: "2-2",
          title: "Apresentação para a Equipe",
          description: "Conheça seus colegas de trabalho",
          type: "meeting",
          duration: "30 min",
          completed: true,
        },
        {
          id: "2-3",
          title: "Coffee Break Virtual",
          description: "Momento informal com a equipe",
          type: "meeting",
          duration: "30 min",
          completed: true,
          current: true,
        },
        {
          id: "2-4",
          title: "Entrevistas 1:1",
          description: "Converse individualmente com membros-chave",
          type: "meeting",
          duration: "2 horas",
          completed: false,
        },
        {
          id: "2-5",
          title: "Mapeamento de Stakeholders",
          description: "Identifique pessoas importantes para seu trabalho",
          type: "task",
          duration: "20 min",
          completed: false,
        },
      ],
    },
    {
      id: "3",
      title: "Capacitação Técnica",
      description: "Treinamentos e ferramentas",
      progress: 40,
      tasks: [
        {
          id: "3-1",
          title: "Ferramentas de Trabalho",
          description: "Configuração e uso das ferramentas principais",
          type: "video",
          duration: "40 min",
          completed: true,
        },
        {
          id: "3-2",
          title: "Processos e Metodologias",
          description: "Como trabalhamos e nossos frameworks",
          type: "reading",
          duration: "35 min",
          completed: true,
        },
        {
          id: "3-3",
          title: "Segurança da Informação",
          description: "Boas práticas e políticas de segurança",
          type: "video",
          duration: "25 min",
          completed: false,
          current: true,
        },
        {
          id: "3-4",
          title: "Treinamento Específico",
          description: "Capacitação técnica para sua função",
          type: "video",
          duration: "2 horas",
          completed: false,
        },
        {
          id: "3-5",
          title: "Certificação Interna",
          description: "Avaliação de conhecimentos adquiridos",
          type: "task",
          duration: "45 min",
          completed: false,
        },
      ],
    },
    {
      id: "4",
      title: "Primeiro Projeto",
      description: "Mãos à obra!",
      progress: 0,
      tasks: [
        {
          id: "4-1",
          title: "Briefing do Projeto",
          description: "Entenda o contexto e objetivos",
          type: "meeting",
          duration: "1 hora",
          completed: false,
        },
        {
          id: "4-2",
          title: "Planejamento",
          description: "Crie seu plano de ação",
          type: "task",
          duration: "3 horas",
          completed: false,
        },
        {
          id: "4-3",
          title: "Execução",
          description: "Coloque em prática o que aprendeu",
          type: "task",
          duration: "2 semanas",
          completed: false,
        },
        {
          id: "4-4",
          title: "Apresentação de Resultados",
          description: "Compartilhe seu trabalho com a equipe",
          type: "meeting",
          duration: "45 min",
          completed: false,
        },
        {
          id: "4-5",
          title: "Feedback e Ajustes",
          description: "Receba feedback e implemente melhorias",
          type: "meeting",
          duration: "30 min",
          completed: false,
        },
      ],
    },
  ]);

  const overallProgress = Math.round(
    tracks.reduce((acc, track) => acc + track.progress, 0) / tracks.length
  );

  const completedTasks = tracks.reduce(
    (acc, track) => acc + track.tasks.filter((t) => t.completed).length,
    0
  );
  const totalTasks = tracks.reduce((acc, track) => acc + track.tasks.length, 0);

  return (
    <div className="space-y-6">
      {/* Header de Progresso */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-2">Sua Jornada de Integração</h2>
            <p className="text-purple-100">
              {completedTasks} de {totalTasks} atividades concluídas
            </p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">{overallProgress}%</span>
          </div>
        </div>
        <div className="w-full bg-purple-400/50 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Trilhas de Onboarding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition"
            onClick={() =>
              setSelectedTrack(selectedTrack === track.id ? null : track.id)
            }
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg text-gray-900 mb-2">{track.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {track.description}
                </p>
              </div>
              {track.progress === 100 && (
                <Award className="w-6 h-6 text-yellow-500" />
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso</span>
                <span className="text-gray-900">{track.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    track.progress === 100 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${track.progress}%` }}
                />
              </div>
            </div>

            {selectedTrack === track.id && (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                {track.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              {track.tasks.filter((t) => t.completed).length} de{" "}
              {track.tasks.length} atividades concluídas
            </p>
          </div>
        ))}
      </div>

      {/* Conquistas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-6">Suas Conquistas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AchievementBadge
            icon={CheckCircle}
            title="Primeiro Dia"
            unlocked
            color="green"
          />
          <AchievementBadge
            icon={BookOpen}
            title="Estudioso"
            unlocked
            color="blue"
          />
          <AchievementBadge
            icon={Users}
            title="Socializado"
            unlocked
            color="purple"
          />
          <AchievementBadge icon={Award} title="Certificado" color="gray" />
        </div>
      </div>
    </div>
  );
}

function RHOnboardingView() {
  const [employees] = useState([
    {
      id: "1",
      name: "João Silva",
      position: "Desenvolvedor Frontend",
      department: "Tecnologia",
      startDate: "15/04/2026",
      progress: 60,
      currentTrack: "Capacitação Técnica",
      daysInRole: 10,
    },
    {
      id: "2",
      name: "Maria Souza",
      position: "Designer UX/UI",
      department: "Produto",
      startDate: "10/04/2026",
      progress: 85,
      currentTrack: "Primeiro Projeto",
      daysInRole: 15,
    },
    {
      id: "3",
      name: "Pedro Santos",
      position: "Analista de Dados",
      department: "Business Intelligence",
      startDate: "18/04/2026",
      progress: 30,
      currentTrack: "Integração Inicial",
      daysInRole: 7,
    },
    {
      id: "4",
      name: "Ana Paula Costa",
      position: "Desenvolvedora Backend",
      department: "Tecnologia",
      startDate: "22/04/2026",
      progress: 20,
      currentTrack: "Integração Inicial",
      daysInRole: 3,
    },
    {
      id: "5",
      name: "Beatriz Carvalho",
      position: "Product Manager",
      department: "Produto",
      startDate: "22/04/2026",
      progress: 15,
      currentTrack: "Integração Inicial",
      daysInRole: 3,
    },
    {
      id: "6",
      name: "Lucas Ferreira",
      position: "Engenheiro de Software Sênior",
      department: "Tecnologia",
      startDate: "23/04/2026",
      progress: 10,
      currentTrack: "Integração Inicial",
      daysInRole: 2,
    },
    {
      id: "7",
      name: "Juliana Santos",
      position: "Executiva de Contas",
      department: "Vendas",
      startDate: "08/04/2026",
      progress: 95,
      currentTrack: "Primeiro Projeto",
      daysInRole: 17,
    },
    {
      id: "8",
      name: "Fernando Alves",
      position: "Analista Financeiro",
      department: "Financeiro",
      startDate: "01/04/2026",
      progress: 100,
      currentTrack: "Concluído ✅",
      daysInRole: 24,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">15</p>
          </div>
          <p className="text-sm text-gray-600">Onboardings Ativos</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900">8</p>
          </div>
          <p className="text-sm text-gray-600">Concluídos (30 dias)</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl text-gray-900">94%</p>
          </div>
          <p className="text-sm text-gray-600">Taxa de Conclusão</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl text-gray-900">4.8</p>
          </div>
          <p className="text-sm text-gray-600">Avaliação Média</p>
        </div>
      </div>

      {/* Lista de Colaboradores */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-6">
          Colaboradores em Onboarding
        </h2>
        <div className="space-y-4">
          {employees.map((employee) => (
            <EmployeeOnboardingCard key={employee.id} employee={employee} />
          ))}
        </div>
      </div>

      {/* Gerenciamento de Trilhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Trilhas Disponíveis</h2>
          <div className="space-y-3">
            <TrackTemplateItem title="Integração Padrão" employees={18} duration="30 dias" />
            <TrackTemplateItem title="Liderança e Gestão" employees={4} duration="45 dias" />
            <TrackTemplateItem title="Técnica Avançada" employees={7} duration="60 dias" />
            <TrackTemplateItem title="Vendas e Negociação" employees={5} duration="21 dias" />
            <TrackTemplateItem title="Trilha Executiva" employees={2} duration="90 dias" />
          </div>
          <button className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition">
            + Criar Nova Trilha
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">
            Performance por Departamento
          </h2>
          <div className="space-y-4">
            <DepartmentPerformance department="Tecnologia" progress={88} count={9} />
            <DepartmentPerformance department="Produto" progress={92} count={5} />
            <DepartmentPerformance department="Vendas" progress={97} count={3} />
            <DepartmentPerformance department="Financeiro" progress={84} count={2} />
            <DepartmentPerformance department="RH" progress={100} count={1} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GestorOnboardingView() {
  const [teamMembers] = useState([
    {
      id: "1",
      name: "João Silva",
      position: "Desenvolvedor Frontend",
      startDate: "15/04/2026",
      progress: 60,
      daysInRole: 10,
      nextMeeting: "Amanhã às 10:00",
    },
    {
      id: "2",
      name: "Maria Souza",
      position: "Designer UX/UI",
      startDate: "10/04/2026",
      progress: 85,
      daysInRole: 15,
      nextMeeting: "Hoje às 15:00",
    },
    {
      id: "3",
      name: "Pedro Santos",
      position: "Analista de Dados",
      startDate: "18/04/2026",
      progress: 35,
      daysInRole: 7,
      nextMeeting: "26/04 às 14:00",
    },
    {
      id: "4",
      name: "Beatriz Carvalho",
      position: "Product Manager",
      startDate: "22/04/2026",
      progress: 15,
      daysInRole: 3,
      nextMeeting: "27/04 às 09:00",
    },
    {
      id: "5",
      name: "Lucas Ferreira",
      position: "Engenheiro de Software Sênior",
      startDate: "23/04/2026",
      progress: 10,
      daysInRole: 2,
      nextMeeting: "28/04 às 11:00",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Visão Geral da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">2</p>
          </div>
          <p className="text-sm text-gray-600">Novos Membros</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900">73%</p>
          </div>
          <p className="text-sm text-gray-600">Progresso Médio</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl text-gray-900">3</p>
          </div>
          <p className="text-sm text-gray-600">Ações Pendentes</p>
        </div>
      </div>

      {/* Membros da Equipe */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-6">Acompanhamento Individual</h2>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <GestorTeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      {/* Próximas Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Próximas Reuniões</h2>
          <div className="space-y-3">
            <MeetingItem name="Maria Souza" type="1:1 de acompanhamento" time="Hoje às 15:00" />
            <MeetingItem name="João Silva" type="Feedback semanal" time="Amanhã às 10:00" />
            <MeetingItem name="Pedro Santos" type="Check-in de integração" time="26/04 às 14:00" />
            <MeetingItem name="Beatriz Carvalho" type="Alinhamento inicial" time="27/04 às 09:00" />
            <MeetingItem name="Lucas Ferreira" type="Apresentação da equipe" time="28/04 às 11:00" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Checklist do Gestor</h2>
          <div className="space-y-3">
            <ChecklistItem task="Revisar progresso semanal de todos os novos membros" completed={false} />
            <ChecklistItem task="Preparar feedback para Maria Souza" completed={true} />
            <ChecklistItem task="Definir primeiro projeto do João Silva" completed={false} />
            <ChecklistItem task="Enviar plano de metas para Pedro Santos" completed={false} />
            <ChecklistItem task="Validação do kit de onboarding de Beatriz" completed={true} />
            <ChecklistItem task="Apresentar Lucas Ferreira à equipe de arquitetura" completed={false} />
            <ChecklistItem task="Revisar desempenho do trimestre com RH" completed={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
function TaskCard({ task }: { task: OnboardingTask }) {
  const getTaskIcon = () => {
    switch (task.type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "reading":
        return <BookOpen className="w-4 h-4" />;
      case "meeting":
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg ${
        task.completed
          ? "bg-green-50"
          : task.current
            ? "bg-blue-50 border-2 border-blue-200"
            : "bg-gray-50"
      }`}
    >
      <div className="mt-1">
        {task.completed ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : task.current ? (
          <Play className="w-5 h-5 text-blue-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <p
            className={`text-sm ${
              task.completed ? "text-green-900" : "text-gray-900"
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-1 text-gray-500">
            {getTaskIcon()}
            <span className="text-xs">{task.duration}</span>
          </div>
        </div>
        <p className="text-xs text-gray-600">{task.description}</p>
        {task.current && !task.completed && (
          <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition">
            Começar Agora
          </button>
        )}
      </div>
    </div>
  );
}

function AchievementBadge({
  icon: Icon,
  title,
  unlocked = false,
  color,
}: {
  icon: any;
  title: string;
  unlocked?: boolean;
  color: string;
}) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    gray: "bg-gray-100 text-gray-400",
  };

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-lg ${
        unlocked ? "opacity-100" : "opacity-50"
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <p className="text-sm text-gray-900 text-center">{title}</p>
      {unlocked && (
        <p className="text-xs text-green-600 mt-1">Desbloqueado!</p>
      )}
    </div>
  );
}

function EmployeeOnboardingCard({ employee }: { employee: any }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg text-gray-900">{employee.name}</h3>
            <p className="text-sm text-gray-600">{employee.position}</p>
            <p className="text-xs text-gray-500">
              {employee.department} • {employee.daysInRole} dias no cargo
            </p>
          </div>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {employee.currentTrack}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progresso Geral</span>
          <span className="text-gray-900">{employee.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${employee.progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Ver Detalhes
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Clock className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function TrackTemplateItem({
  title,
  employees,
  duration,
}: {
  title: string;
  employees: number;
  duration: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">
          {employees} colaboradores • {duration}
        </p>
      </div>
      <button className="text-blue-600 hover:text-blue-700">Editar</button>
    </div>
  );
}

function DepartmentPerformance({
  department,
  progress,
  count,
}: {
  department: string;
  progress: number;
  count: number;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-700">{department}</span>
        <span className="text-sm text-gray-900">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{count} colaboradores ativos</p>
    </div>
  );
}

function GestorTeamMemberCard({ member }: { member: any }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg">
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.position}</p>
            <p className="text-xs text-gray-500">
              {member.daysInRole} dias • Próxima reunião: {member.nextMeeting}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progresso do onboarding</span>
          <span className="text-gray-900">{member.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full"
            style={{ width: `${member.progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          Dar Feedback
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Ver Progresso
        </button>
      </div>
    </div>
  );
}

function MeetingItem({
  name,
  type,
  time,
}: {
  name: string;
  type: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
        <Users className="w-5 h-5 text-purple-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{name}</p>
        <p className="text-xs text-gray-600">{type}</p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}

function ChecklistItem({
  task,
  completed,
}: {
  task: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          completed
            ? "bg-green-500 border-green-500"
            : "border-gray-300"
        }`}
      >
        {completed && <CheckCircle className="w-4 h-4 text-white" />}
      </div>
      <p
        className={`text-sm flex-1 ${
          completed ? "text-gray-500 line-through" : "text-gray-900"
        }`}
      >
        {task}
      </p>
    </div>
  );
}
