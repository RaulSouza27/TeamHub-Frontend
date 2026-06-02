import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../services/api";
import {
  Users,
  FileCheck,
  Clock,
  TrendingUp,
  UserCheck,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const [apiMessage, setApiMessage] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    let endpoint = "";
    if (user.role === "rh") {
      endpoint = "/api/dashboard/admin";
    } else if (user.role === "gestor") {
      endpoint = "/api/dashboard/team";
    } else {
      endpoint = "/api/dashboard/me";
    }

    apiFetch(endpoint)
      .then(async (res) => {
        if (res.ok) {
          // Usamos .text() porque atualmente a API retorna apenas uma String simples
          const text = await res.text();
          setApiMessage(text);
        }
      })
      .catch((err) => console.error("Erro ao buscar dados do dashboard:", err));
  }, [user]);

  if (!user) return null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">
          Bem-vindo, {user.name}!
        </h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Dashboard por perfil */}
      {user.role === "colaborador" && <ColaboradorDashboard />}
      {user.role === "rh" && <RHDashboard />}
      {user.role === "gestor" && <GestorDashboard />}
    </div>
  );
}

function ColaboradorDashboard() {
  return (
    <div className="space-y-6">
      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={CheckCircle}
          title="Admissão"
          value="Concluída"
          color="green"
          description="7 de 7 documentos aprovados"
        />
        <StatCard
          icon={Clock}
          title="Onboarding"
          value="Em andamento"
          color="blue"
          description="8 de 20 atividades concluídas"
        />
        <StatCard
          icon={Calendar}
          title="Próxima Atividade"
          value="Hoje"
          color="purple"
          description="Workshop de Segurança da Informação — 14h"
        />
      </div>

      {/* Minhas Tarefas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-4">Minhas Tarefas</h2>
        <div className="space-y-3">
          <TaskItem title="Completar treinamento de integração" status="pending" date="Hoje" />
          <TaskItem title="Assinar código de conduta" status="pending" date="Até 28/04" />
          <TaskItem title="Preencher pesquisa de clima organizacional" status="pending" date="Até 30/04" />
          <TaskItem title="Agendar 1:1 com gestor direto" status="pending" date="Até 29/04" />
          <TaskItem title="Conhecer a equipe de Tecnologia" status="completed" date="Concluído" />
          <TaskItem title="Tour virtual pela empresa" status="completed" date="Concluído" />
          <TaskItem title="Configurar ferramentas de trabalho" status="completed" date="Concluído" />
          <TaskItem title="Reunião de alinhamento com gestor" status="completed" date="Concluído" />
        </div>
      </div>

      {/* Trilha de Onboarding */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-4">Minha Trilha de Integração</h2>
        <div className="space-y-4">
          <ProgressStep title="Boas-vindas e Documentação" completed />
          <ProgressStep title="Ferramentas e Sistemas" completed />
          <ProgressStep title="Cultura e Processos" current />
          <ProgressStep title="Capacitação Técnica" upcoming />
          <ProgressStep title="Primeiro Projeto" upcoming />
        </div>
      </div>

      {/* Agenda da Semana */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-4">Agenda da Semana</h2>
        <div className="space-y-3">
          <EventItem title="Workshop: Segurança da Informação" date="25/04/2026" time="14:00" />
          <EventItem title="1:1 com Carlos Oliveira (Gestor)" date="26/04/2026" time="10:00" />
          <EventItem title="Happy Hour de Boas-vindas" date="26/04/2026" time="18:00" />
          <EventItem title="Treinamento técnico — Arquitetura do Sistema" date="28/04/2026" time="09:00" />
          <EventItem title="Apresentação de resultados do sprint" date="29/04/2026" time="15:00" />
        </div>
      </div>
    </div>
  );
}

function RHDashboard() {
  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Admissões Ativas" value="18" color="blue" description="+5 esta semana" />
        <StatCard icon={FileCheck} title="Docs Pendentes" value="14" color="orange" description="Aguardando validação" />
        <StatCard icon={UserCheck} title="Onboardings Ativos" value="22" color="green" description="7 concluem esta semana" />
        <StatCard icon={TrendingUp} title="Taxa de Conclusão" value="96%" color="purple" description="+2% vs. mês anterior" />
      </div>

      {/* Admissões Pendentes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-4">
          Admissões Pendentes de Validação
        </h2>
        <div className="space-y-3">
          <AdmissionItem name="Ana Paula Costa" department="Tecnologia" status="pending" date="22/04/2026" />
          <AdmissionItem name="Ricardo Mendes" department="Marketing" status="review" date="23/04/2026" />
          <AdmissionItem name="Juliana Santos" department="Vendas" status="pending" date="24/04/2026" />
          <AdmissionItem name="Fernando Alves" department="Financeiro" status="review" date="24/04/2026" />
          <AdmissionItem name="Beatriz Carvalho" department="Produto" status="pending" date="25/04/2026" />
          <AdmissionItem name="Lucas Ferreira" department="Tecnologia" status="review" date="25/04/2026" />
        </div>
      </div>

      {/* Métricas de Onboarding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">
            Onboardings por Departamento
          </h2>
          <div className="space-y-3">
            <DepartmentBar department="Tecnologia" count={9} total={22} />
            <DepartmentBar department="Vendas" count={5} total={22} />
            <DepartmentBar department="Marketing" count={4} total={22} />
            <DepartmentBar department="Produto" count={2} total={22} />
            <DepartmentBar department="Financeiro" count={2} total={22} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Alertas e Notificações</h2>
          <div className="space-y-3">
            <AlertItem type="warning" message="5 colaboradores com documentos vencendo em 7 dias" />
            <AlertItem type="warning" message="Ricardo Mendes não acessa a plataforma há 3 dias" />
            <AlertItem type="info" message="7 onboardings serão concluídos esta semana" />
            <AlertItem type="info" message="Pesquisa de clima encerra em 5 dias — 42% de resposta" />
            <AlertItem type="success" message="Taxa de satisfação do onboarding: 4.9/5 este mês" />
            <AlertItem type="success" message="Beatriz Carvalho completou admissão em tempo recorde" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GestorDashboard() {
  return (
    <div className="space-y-6">
      {/* Métricas da equipe */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Minha Equipe" value="31" color="blue" description="Colaboradores ativos" />
        <StatCard icon={UserCheck} title="Novos Membros" value="5" color="green" description="Em integração" />
        <StatCard icon={Calendar} title="Reuniões Agendadas" value="8" color="purple" description="Esta semana" />
        <StatCard icon={TrendingUp} title="Performance" value="94%" color="orange" description="Metas atingidas no trimestre" />
      </div>

      {/* Novos Colaboradores */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-4">
          Novos Membros da Equipe
        </h2>
        <div className="space-y-4">
          <TeamMemberCard name="João Silva" role="Desenvolvedor Frontend" startDate="15/04/2026" progress={60} status="Em integração" />
          <TeamMemberCard name="Maria Souza" role="Designer UX/UI" startDate="10/04/2026" progress={85} status="Quase concluído" />
          <TeamMemberCard name="Pedro Santos" role="Analista de Dados" startDate="18/04/2026" progress={35} status="Início" />
          <TeamMemberCard name="Beatriz Carvalho" role="Product Manager" startDate="22/04/2026" progress={15} status="Início" />
          <TeamMemberCard name="Lucas Ferreira" role="Engenheiro de Software" startDate="23/04/2026" progress={10} status="Início" />
        </div>
      </div>

      {/* Ações Pendentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Ações Pendentes</h2>
          <div className="space-y-3">
            <TaskItem title="Revisar plano de desenvolvimento — João Silva" status="pending" date="Hoje" />
            <TaskItem title="Reunião 1:1 com Maria Souza" status="pending" date="Hoje" />
            <TaskItem title="Aprovar objetivos do trimestre — Equipe de TI" status="pending" date="26/04" />
            <TaskItem title="Definir primeiro projeto para Pedro Santos" status="pending" date="27/04" />
            <TaskItem title="Avaliar proposta de promoção — Ana Lima" status="pending" date="28/04" />
            <TaskItem title="Entrevista de onboarding — Beatriz Carvalho" status="completed" date="Concluído" />
            <TaskItem title="Feedback trimestral — Renata Dias" status="completed" date="Concluído" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Próximos Eventos</h2>
          <div className="space-y-3">
            <EventItem title="Reunião de equipe semanal" date="25/04/2026" time="09:00" />
            <EventItem title="1:1 com Maria Souza" date="25/04/2026" time="15:00" />
            <EventItem title="1:1 com João Silva" date="26/04/2026" time="10:00" />
            <EventItem title="Apresentação de novos membros" date="27/04/2026" time="14:00" />
            <EventItem title="Workshop de liderança" date="28/04/2026" time="09:00" />
            <EventItem title="Revisão de sprint Q2" date="29/04/2026" time="16:00" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
function StatCard({
  icon: Icon,
  title,
  value,
  color,
  description,
}: {
  icon: any;
  title: string;
  value: string;
  color: string;
  description: string;
}) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

function TaskItem({
  title,
  status,
  date,
}: {
  title: string;
  status: "pending" | "completed";
  date: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          status === "completed"
            ? "bg-green-500 border-green-500"
            : "border-gray-300"
        }`}
      >
        {status === "completed" && (
          <CheckCircle className="w-4 h-4 text-white" />
        )}
      </div>
      <div className="flex-1">
        <p
          className={`text-sm ${
            status === "completed"
              ? "text-gray-500 line-through"
              : "text-gray-900"
          }`}
        >
          {title}
        </p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{date}</span>
    </div>
  );
}

function ProgressStep({
  title,
  completed = false,
  current = false,
  upcoming = false,
}: {
  title: string;
  completed?: boolean;
  current?: boolean;
  upcoming?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          completed ? "bg-green-500" : current ? "bg-blue-500" : "bg-gray-200"
        }`}
      >
        {completed ? (
          <CheckCircle className="w-5 h-5 text-white" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-white" />
        )}
      </div>
      <p className={`${completed || current ? "text-gray-900" : "text-gray-400"}`}>
        {title}
      </p>
    </div>
  );
}

function AdmissionItem({
  name,
  department,
  status,
  date,
}: {
  name: string;
  department: string;
  status: string;
  date: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">{department}</p>
      </div>
      <div className="text-right">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs ${
            status === "pending"
              ? "bg-orange-100 text-orange-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {status === "pending" ? "Pendente" : "Em análise"}
        </span>
        <p className="text-xs text-gray-500 mt-1">{date}</p>
      </div>
    </div>
  );
}

function DepartmentBar({
  department,
  count,
  total,
}: {
  department: string;
  count: number;
  total: number;
}) {
  const percentage = (count / total) * 100;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-700">{department}</span>
        <span className="text-sm text-gray-600">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function AlertItem({ type, message }: { type: string; message: string }) {
  const typeStyles = {
    warning: "bg-orange-50 border-orange-200 text-orange-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div
      className={`p-3 border rounded-lg flex items-start gap-2 ${typeStyles[type as keyof typeof typeStyles]}`}
    >
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function TeamMemberCard({
  name,
  role,
  startDate,
  progress,
  status,
}: {
  name: string;
  role: string;
  startDate: string;
  progress: number;
  status: string;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{role}</p>
          <p className="text-xs text-gray-500 mt-1">Início: {startDate}</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {status}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progresso do onboarding</span>
          <span className="text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function EventItem({
  title,
  date,
  time,
}: {
  title: string;
  date: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center shrink-0">
        <span className="text-xs text-blue-600">{date.split("/")[0]}</span>
        <span className="text-xs text-blue-600">{date.split("/")[1]}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{time}</p>
      </div>
    </div>
  );
}
