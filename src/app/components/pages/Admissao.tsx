import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  X,
} from "lucide-react";

type DocumentStatus = "pending" | "uploaded" | "approved" | "rejected";

interface Document {
  id: string;
  name: string;
  status: DocumentStatus;
  uploadDate?: string;
  approvalDate?: string;
  fileUrl?: string;
}

export function Admissao() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Admissão Digital</h1>
        <p className="text-gray-600">
          {user.role === "rh"
            ? "Gerencie documentos e validações de novos colaboradores"
            : "Complete seu processo de admissão"}
        </p>
      </div>

      {user.role === "rh" ? <RHAdmissaoView /> : <ColaboradorAdmissaoView />}
    </div>
  );
}

function ColaboradorAdmissaoView() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "RG (Frente e Verso)",
      status: "approved",
      uploadDate: "12/04/2026",
      approvalDate: "13/04/2026",
    },
    {
      id: "2",
      name: "CPF",
      status: "approved",
      uploadDate: "12/04/2026",
      approvalDate: "13/04/2026",
    },
    {
      id: "3",
      name: "Comprovante de Residência",
      status: "uploaded",
      uploadDate: "15/04/2026",
    },
    {
      id: "4",
      name: "Carteira de Trabalho",
      status: "pending",
    },
    {
      id: "5",
      name: "Título de Eleitor",
      status: "pending",
    },
    {
      id: "6",
      name: "Certificado de Reservista",
      status: "pending",
    },
    {
      id: "7",
      name: "Foto 3x4",
      status: "approved",
      uploadDate: "12/04/2026",
      approvalDate: "13/04/2026",
    },
  ]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const handleFileSelect = (docId: string, file: File) => {
    setSelectedFile(file);
    setUploadingDoc(docId);
  };

  const handleUpload = () => {
    if (!selectedFile || !uploadingDoc) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === uploadingDoc
          ? {
              ...doc,
              status: "uploaded",
              uploadDate: new Date().toLocaleDateString("pt-BR"),
            }
          : doc
      )
    );

    setSelectedFile(null);
    setUploadingDoc(null);
  };

  const approved = documents.filter((d) => d.status === "approved").length;
  const uploaded = documents.filter((d) => d.status === "uploaded").length;
  const pending = documents.filter((d) => d.status === "pending").length;
  const total = documents.length;
  const progress = Math.round((approved / total) * 100);

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-2">Status da Admissão</h2>
            <p className="text-blue-100">
              {approved} de {total} documentos aprovados
            </p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">{progress}%</span>
          </div>
        </div>
        <div className="w-full bg-blue-400/50 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl text-gray-900">{approved}</p>
            <p className="text-sm text-gray-600">Aprovados</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl text-gray-900">{uploaded}</p>
            <p className="text-sm text-gray-600">Em análise</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl text-gray-900">{pending}</p>
            <p className="text-sm text-gray-600">Pendentes</p>
          </div>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-6">Documentos Necessários</h2>
        <div className="space-y-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onFileSelect={(file) => handleFileSelect(doc.id, file)}
              isUploading={uploadingDoc === doc.id}
              selectedFile={uploadingDoc === doc.id ? selectedFile : null}
              onUpload={handleUpload}
              onCancelUpload={() => {
                setUploadingDoc(null);
                setSelectedFile(null);
              }}
            />
          ))}
        </div>
      </div>

      {/* Próximos Passos */}
      {pending > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg text-blue-900 mb-2">Próximos Passos</h3>
          <p className="text-blue-700 mb-4">
            Você ainda tem {pending} documento{pending > 1 ? "s" : ""} pendente
            {pending > 1 ? "s" : ""}. Complete o envio para prosseguir com o
            onboarding.
          </p>
          <p className="text-sm text-blue-600">
            💡 Dica: Certifique-se de que os documentos estejam legíveis e em
            formato PDF ou imagem (JPG, PNG).
          </p>
        </div>
      )}
    </div>
  );
}

function RHAdmissaoView() {
  const [candidates] = useState([
    {
      id: "1",
      name: "Ana Paula Costa",
      department: "Tecnologia",
      position: "Desenvolvedora Backend",
      startDate: "22/04/2026",
      docsApproved: 5,
      docsTotal: 7,
      status: "pending",
    },
    {
      id: "2",
      name: "Ricardo Mendes",
      department: "Marketing",
      position: "Analista de Marketing Digital",
      startDate: "25/04/2026",
      docsApproved: 7,
      docsTotal: 7,
      status: "approved",
    },
    {
      id: "3",
      name: "Juliana Santos",
      department: "Vendas",
      position: "Executiva de Contas",
      startDate: "20/04/2026",
      docsApproved: 4,
      docsTotal: 7,
      status: "review",
    },
    {
      id: "4",
      name: "Fernando Alves",
      department: "Financeiro",
      position: "Analista Financeiro Pleno",
      startDate: "28/04/2026",
      docsApproved: 3,
      docsTotal: 7,
      status: "pending",
    },
    {
      id: "5",
      name: "Beatriz Carvalho",
      department: "Produto",
      position: "Product Manager",
      startDate: "29/04/2026",
      docsApproved: 6,
      docsTotal: 7,
      status: "review",
    },
    {
      id: "6",
      name: "Lucas Ferreira",
      department: "Tecnologia",
      position: "Engenheiro de Software Sênior",
      startDate: "02/05/2026",
      docsApproved: 2,
      docsTotal: 7,
      status: "pending",
    },
    {
      id: "7",
      name: "Renata Dias",
      department: "RH",
      position: "Analista de Recursos Humanos",
      startDate: "05/05/2026",
      docsApproved: 7,
      docsTotal: 7,
      status: "approved",
    },
    {
      id: "8",
      name: "Thiago Mendonça",
      department: "Operações",
      position: "Coordenador de Operações",
      startDate: "06/05/2026",
      docsApproved: 1,
      docsTotal: 7,
      status: "pending",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">18</p>
          </div>
          <p className="text-sm text-gray-600">Admissões Ativas</p>
          <p className="text-xs text-green-600 mt-1">+5 esta semana</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl text-gray-900">14</p>
          </div>
          <p className="text-sm text-gray-600">Docs Pendentes</p>
          <p className="text-xs text-orange-600 mt-1">Aguardando validação</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900">9</p>
          </div>
          <p className="text-sm text-gray-600">Concluídas no Mês</p>
          <p className="text-xs text-green-600 mt-1">2 a mais vs. mês anterior</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl text-gray-900">4</p>
          </div>
          <p className="text-sm text-gray-600">Necessitam Atenção</p>
          <p className="text-xs text-red-500 mt-1">Documentos rejeitados ou atrasados</p>
        </div>
      </div>

      {/* Lista de Candidatos */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-6">
          Candidatos em Processo de Admissão
        </h2>
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>

      {/* Integração eSocial */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl text-gray-900 mb-4">Integração eSocial</h2>
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-900">Sistema conectado</p>
              <p className="text-sm text-green-700">
                Última sincronização: Hoje às 14:30
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Sincronizar Agora
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({
  document,
  onFileSelect,
  isUploading,
  selectedFile,
  onUpload,
  onCancelUpload,
}: {
  document: Document;
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  selectedFile: File | null;
  onUpload: () => void;
  onCancelUpload: () => void;
}) {
  const getStatusIcon = () => {
    switch (document.status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "uploaded":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const badges = {
      approved: "bg-green-100 text-green-700",
      uploaded: "bg-blue-100 text-blue-700",
      rejected: "bg-red-100 text-red-700",
      pending: "bg-gray-100 text-gray-700",
    };

    const labels = {
      approved: "Aprovado",
      uploaded: "Em análise",
      rejected: "Rejeitado",
      pending: "Pendente",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs ${badges[document.status]}`}
      >
        {labels[document.status]}
      </span>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <p className="text-gray-900">{document.name}</p>
            {document.uploadDate && (
              <p className="text-xs text-gray-500">
                Enviado em {document.uploadDate}
              </p>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {isUploading && selectedFile ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-900">{selectedFile.name}</span>
            </div>
            <button
              onClick={onCancelUpload}
              className="text-blue-600 hover:text-blue-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={onUpload}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Confirmar Upload
          </button>
        </div>
      ) : document.status === "pending" ? (
        <label className="block">
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Clique para fazer upload ou arraste o arquivo
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, JPG ou PNG (máx. 5MB)
            </p>
          </div>
        </label>
      ) : (
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Visualizar</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
        </div>
      )}
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: any }) {
  const progress = Math.round(
    (candidate.docsApproved / candidate.docsTotal) * 100
  );

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{candidate.position}</p>
            <p className="text-xs text-gray-500">
              {candidate.department} • Início: {candidate.startDate}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            candidate.status === "approved"
              ? "bg-green-100 text-green-700"
              : candidate.status === "review"
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
          }`}
        >
          {candidate.status === "approved"
            ? "Aprovado"
            : candidate.status === "review"
              ? "Em análise"
              : "Ação necessária"}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Documentos</span>
          <span className="text-gray-900">
            {candidate.docsApproved}/{candidate.docsTotal}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              progress === 100 ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Revisar Documentos
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Eye className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
