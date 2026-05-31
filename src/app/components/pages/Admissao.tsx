import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  X,
  ShieldCheck,
  RotateCcw,
  Image as ImageIcon
} from "lucide-react";
import {
  submitDocumentsService,
  getMySubmissionService,
  getAllSubmissionsService,
  approveSubmissionService,
  rejectSubmissionService,
  DocumentSubmissionResponse
} from "../../services/admissions";

export function Admissao() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admissão Digital</h1>
        <p className="text-gray-600">
          {user.role === "rh"
            ? "Gerencie e aprove os documentos admissionais dos colaboradores"
            : "Faça o upload dos documentos solicitados para concluir seu onboarding"}
        </p>
      </div>

      {user.role === "rh" ? <RHAdmissaoView /> : <ColaboradorAdmissaoView />}
    </div>
  );
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

function ColaboradorAdmissaoView() {
  const [submission, setSubmission] = useState<DocumentSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Files state
  const [rgFile, setRgFile] = useState<File | null>(null);
  const [cpfFile, setCpfFile] = useState<File | null>(null);
  const [workCardFile, setWorkCardFile] = useState<File | null>(null);

  // Base64 state
  const [rgBase64, setRgBase64] = useState<string>("");
  const [cpfBase64, setCpfBase64] = useState<string>("");
  const [workCardBase64, setWorkCardBase64] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ name: string; base64: string } | null>(null);

  const fetchMySubmission = async () => {
    setLoading(true);
    try {
      const data = await getMySubmissionService();
      setSubmission(data);
      setIsReconnecting(false);
    } catch (err) {
      console.error("Erro ao carregar admissão:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySubmission();
  }, []);

  const handleFileChange = async (type: "rg" | "cpf" | "workCard", file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem (PNG, JPG, JPEG).");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      if (type === "rg") {
        setRgFile(file);
        setRgBase64(base64);
      } else if (type === "cpf") {
        setCpfFile(file);
        setCpfBase64(base64);
      } else {
        setWorkCardFile(file);
        setWorkCardBase64(base64);
      }
    } catch (err) {
      alert("Erro ao processar imagem: " + err);
    }
  };

  const handleRemoveFile = (type: "rg" | "cpf" | "workCard") => {
    if (type === "rg") {
      setRgFile(null);
      setRgBase64("");
    } else if (type === "cpf") {
      setCpfFile(null);
      setCpfBase64("");
    } else {
      setWorkCardFile(null);
      setWorkCardBase64("");
    }
  };

  const handleSubmit = async () => {
    if (!rgBase64 || !cpfBase64 || !workCardBase64) {
      alert("Por favor, faça o upload de todos os três documentos.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await submitDocumentsService({
        rgBase64,
        cpfBase64,
        workCardBase64,
      });
      setSubmission(data);
      setIsReconnecting(false);
      // Reset local file states
      setRgFile(null);
      setCpfFile(null);
      setWorkCardFile(null);
      setRgBase64("");
      setCpfBase64("");
      setWorkCardBase64("");
      alert("Documentos enviados com sucesso!");
    } catch (err: any) {
      alert(err.message || "Erro ao enviar documentos.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Clock className="w-8 h-8 text-blue-600 animate-spin mr-2" />
        <span className="text-gray-600">Carregando status de admissão...</span>
      </div>
    );
  }

  // Se houver uma submissão ativa e o colaborador não estiver no modo de reenvio
  if (submission && !isReconnecting) {
    const getStatusStyle = () => {
      switch (submission.status) {
        case "APROVADO":
          return {
            bg: "bg-green-50 border-green-200",
            icon: <CheckCircle className="w-12 h-12 text-green-600" />,
            title: "Documentação Aprovada!",
            desc: "Parabéns! Seus documentos foram validados e aprovados pelo setor de RH. Seu processo de contratação está concluído.",
            badge: "bg-green-100 text-green-800",
          };
        case "REJEITADO":
          return {
            bg: "bg-red-50 border-red-200",
            icon: <AlertCircle className="w-12 h-12 text-red-600" />,
            title: "Documentação Rejeitada",
            desc: "Ocorreu um problema com a validação dos seus documentos. Por favor, verifique as imagens e envie novamente com melhor resolução ou dados corretos.",
            badge: "bg-red-100 text-red-800",
          };
        default:
          return {
            bg: "bg-amber-50 border-amber-200",
            icon: <Clock className="w-12 h-12 text-amber-600 animate-pulse" />,
            title: "Documentação em Análise",
            desc: "Recebemos os seus documentos! Eles estão passando por auditoria pelo setor de Recursos Humanos. Entraremos em contato em breve.",
            badge: "bg-amber-100 text-amber-800",
          };
      }
    };

    const statusStyle = getStatusStyle();

    return (
      <div className="space-y-6">
        {/* Banner de Status */}
        <div className={`border rounded-xl p-6 ${statusStyle.bg} flex flex-col md:flex-row items-center gap-4 shadow-sm`}>
          {statusStyle.icon}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{statusStyle.title}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.badge}`}>
                {submission.status}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{statusStyle.desc}</p>
            <p className="text-xs text-gray-500 mt-2">
              Enviado em: {new Date(submission.submittedAt).toLocaleString("pt-BR")}
            </p>
          </div>
          {submission.status === "REJEITADO" && (
            <button
              onClick={() => setIsReconnecting(true)}
              className="mt-4 md:mt-0 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center gap-2 shrink-0 shadow"
            >
              <RotateCcw className="w-4 h-4" />
              Reenviar Documentos
            </button>
          )}
        </div>

        {/* Visualização dos documentos enviados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Documentos Enviados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
              <p className="text-sm font-semibold text-gray-700 mb-3">RG (Identidade)</p>
              <div className="relative group w-full aspect-video bg-gray-50 rounded-md border overflow-hidden flex items-center justify-center">
                <img
                  src={submission.rgBase64}
                  alt="RG"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPreviewImage({ name: "RG (Identidade)", base64: submission.rgBase64 })}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-2 text-sm"
                >
                  <Eye className="w-5 h-5" />
                  Visualizar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
              <p className="text-sm font-semibold text-gray-700 mb-3">CPF</p>
              <div className="relative group w-full aspect-video bg-gray-50 rounded-md border overflow-hidden flex items-center justify-center">
                <img
                  src={submission.cpfBase64}
                  alt="CPF"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPreviewImage({ name: "CPF", base64: submission.cpfBase64 })}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-2 text-sm"
                >
                  <Eye className="w-5 h-5" />
                  Visualizar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
              <p className="text-sm font-semibold text-gray-700 mb-3">Carteira de Trabalho</p>
              <div className="relative group w-full aspect-video bg-gray-50 rounded-md border overflow-hidden flex items-center justify-center">
                <img
                  src={submission.workCardBase64}
                  alt="Carteira de Trabalho"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPreviewImage({ name: "Carteira de Trabalho", base64: submission.workCardBase64 })}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-2 text-sm"
                >
                  <Eye className="w-5 h-5" />
                  Visualizar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Zoom da Imagem */}
        {previewImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-4 relative flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center pb-3 border-b mb-4">
                <h4 className="text-lg font-bold text-gray-900">{previewImage.name}</h4>
                <button onClick={() => setPreviewImage(null)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-900 rounded-lg">
                <img src={previewImage.base64} alt={previewImage.name} className="max-h-[70vh] object-contain" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Formulário de Upload (quando não há submissão ou no modo de reenvio)
  return (
    <div className="space-y-6">
      {isReconnecting && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 text-sm">
              Você está reconfigurando sua admissão. O envio destes novos documentos substituirá os anteriores.
            </span>
          </div>
          <button
            onClick={() => setIsReconnecting(false)}
            className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1.5 rounded font-medium transition"
          >
            Cancelar Reenvio
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Envio de Documentos</h2>
        <p className="text-sm text-gray-600 mb-6">
          Suba as fotos/imagens nítidas dos seguintes documentos de admissão. Todos são obrigatórios.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card RG */}
          <div className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-md font-bold text-gray-800">1. RG</h3>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">Obrigatório</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Registro Geral de Identidade (Frente e Verso)</p>

              {rgBase64 ? (
                <div className="relative rounded-lg border overflow-hidden bg-gray-50 aspect-video">
                  <img src={rgBase64} alt="RG Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveFile("rg")}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition aspect-video">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-600 font-medium">Selecionar Imagem</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange("rg", file);
                    }}
                  />
                </label>
              )}
            </div>
            {rgFile && (
              <p className="text-xs text-gray-500 truncate mt-3">📂 {rgFile.name}</p>
            )}
          </div>

          {/* Card CPF */}
          <div className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-md font-bold text-gray-800">2. CPF</h3>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">Obrigatório</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Cadastro de Pessoas Físicas ou CPF digital</p>

              {cpfBase64 ? (
                <div className="relative rounded-lg border overflow-hidden bg-gray-50 aspect-video">
                  <img src={cpfBase64} alt="CPF Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveFile("cpf")}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition aspect-video">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-600 font-medium">Selecionar Imagem</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange("cpf", file);
                    }}
                  />
                </label>
              )}
            </div>
            {cpfFile && (
              <p className="text-xs text-gray-500 truncate mt-3">📂 {cpfFile.name}</p>
            )}
          </div>

          {/* Card Carteira de Trabalho */}
          <div className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-md font-bold text-gray-800">3. Carteira de Trabalho</h3>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">Obrigatório</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Carteira de Trabalho e Previdência Social (CTPS)</p>

              {workCardBase64 ? (
                <div className="relative rounded-lg border overflow-hidden bg-gray-50 aspect-video">
                  <img src={workCardBase64} alt="CTPS Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveFile("workCard")}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition aspect-video">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-600 font-medium">Selecionar Imagem</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange("workCard", file);
                    }}
                  />
                </label>
              )}
            </div>
            {workCardFile && (
              <p className="text-xs text-gray-500 truncate mt-3">📂 {workCardFile.name}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={submitting || !rgBase64 || !cpfBase64 || !workCardBase64}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 font-semibold rounded-lg shadow-md disabled:shadow-none hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Enviar Documentação
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function RHAdmissaoView() {
  const [submissions, setSubmissions] = useState<DocumentSubmissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<DocumentSubmissionResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"rg" | "cpf" | "workCard">("rg");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAllSubmissionsService();
      setSubmissions(data);
    } catch (err: any) {
      alert(err.message || "Erro ao carregar submissões.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = async (id: number) => {
    setUpdatingId(id);
    try {
      await approveSubmissionService(id);
      alert("Admissão aprovada com sucesso!");
      setSelectedSub(null);
      fetchSubmissions();
    } catch (err: any) {
      alert(err.message || "Erro ao aprovar.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setUpdatingId(id);
    try {
      await rejectSubmissionService(id);
      alert("Admissão rejeitada!");
      setSelectedSub(null);
      fetchSubmissions();
    } catch (err: any) {
      alert(err.message || "Erro ao rejeitar.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Clock className="w-8 h-8 text-blue-600 animate-spin mr-2" />
        <span className="text-gray-600">Carregando auditoria de admissões...</span>
      </div>
    );
  }

  // Contadores
  const totalSubmissions = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "PENDENTE").length;
  const approvedCount = submissions.filter((s) => s.status === "APROVADO").length;
  const rejectedCount = submissions.filter((s) => s.status === "REJEITADO").length;

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Enviado</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
          <p className="text-sm font-medium text-gray-600">Pendentes de Revisão</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
          </div>
          <p className="text-sm font-medium text-gray-600">Aprovados</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
          </div>
          <p className="text-sm font-medium text-gray-600">Rejeitados</p>
        </div>
      </div>

      {/* Lista de Envios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Auditoria de Admissão Digital</h2>
        {submissions.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg text-gray-500">
            Nenhuma submissão de documentos encontrada até o momento.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const progress = sub.status === "APROVADO" ? 100 : sub.status === "REJEITADO" ? 0 : 50;
              return (
                <div key={sub.id} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50/50 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {sub.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{sub.username}</h3>
                        <p className="text-xs text-gray-500">
                          Enviado em: {new Date(sub.submittedAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sub.status === "APROVADO"
                            ? "bg-green-100 text-green-800"
                            : sub.status === "REJEITADO"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedSub(sub);
                          setActiveTab("rg");
                        }}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                      >
                        Revisar Documentos
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progresso de Validação</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          sub.status === "APROVADO"
                            ? "bg-green-500"
                            : sub.status === "REJEITADO"
                              ? "bg-red-500"
                              : "bg-amber-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal do Auditor de Documentos */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">Revisão de Documentos</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedSub.status === "APROVADO"
                      ? "bg-green-100 text-green-800"
                      : selectedSub.status === "REJEITADO"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                  }`}>
                    {selectedSub.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Candidato: <span className="font-semibold">{selectedSub.username}</span></p>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Abas e Visualização */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Barra lateral de abas */}
              <div className="w-full md:w-64 border-r bg-gray-50/50 p-4 flex flex-col gap-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Documentos</p>
                <button
                  onClick={() => setActiveTab("rg")}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === "rg" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  RG (Identidade)
                </button>
                <button
                  onClick={() => setActiveTab("cpf")}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === "cpf" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  CPF
                </button>
                <button
                  onClick={() => setActiveTab("workCard")}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === "workCard" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Carteira de Trabalho
                </button>
              </div>

              {/* Área de Visualização do Documento */}
              <div className="flex-1 bg-gray-900 p-6 flex items-center justify-center overflow-auto">
                <img
                  src={
                    activeTab === "rg"
                      ? selectedSub.rgBase64
                      : activeTab === "cpf"
                        ? selectedSub.cpfBase64
                        : selectedSub.workCardBase64
                  }
                  alt={activeTab.toUpperCase()}
                  className="max-h-[55vh] object-contain rounded border border-gray-700 shadow-2xl"
                />
              </div>
            </div>

            {/* Footer de ações */}
            <div className="p-5 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-gray-500 text-center sm:text-left">
                Verifique se todos os dados estão legíveis antes de tomar uma decisão.
              </p>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleReject(selectedSub.id)}
                  disabled={updatingId !== null}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition shadow flex items-center justify-center gap-2"
                >
                  {updatingId === selectedSub.id ? "Aguarde..." : "Rejeitar Documentos"}
                </button>
                <button
                  onClick={() => handleApprove(selectedSub.id)}
                  disabled={updatingId !== null}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg transition shadow flex items-center justify-center gap-2"
                >
                  {updatingId === selectedSub.id ? "Aguarde..." : "Aprovar Documentos"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
