import { apiFetch } from "./api";

export interface DocumentSubmissionResponse {
  id: number;
  userId: number;
  username: string;
  rgBase64: string;
  cpfBase64: string;
  workCardBase64: string;
  status: string; // PENDENTE, APROVADO, REJEITADO
  submittedAt: string;
}

export interface DocumentSubmissionRequest {
  rgBase64: string;
  cpfBase64: string;
  workCardBase64: string;
}

export async function submitDocumentsService(
  request: DocumentSubmissionRequest
): Promise<DocumentSubmissionResponse> {
  const response = await apiFetch("/api/admissions/submit", {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao enviar os documentos.");
  }
  return response.json();
}

export async function getMySubmissionService(): Promise<DocumentSubmissionResponse | null> {
  const response = await apiFetch("/api/admissions/my-submission");
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao carregar seu status de admissão.");
  }
  return response.json();
}

export async function getAllSubmissionsService(): Promise<DocumentSubmissionResponse[]> {
  const response = await apiFetch("/api/admissions/all-submissions");
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao carregar a lista de admissões.");
  }
  return response.json();
}

export async function approveSubmissionService(
  id: number
): Promise<DocumentSubmissionResponse> {
  const response = await apiFetch(`/api/admissions/${id}/approve`, {
    method: "POST",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao aprovar a admissão.");
  }
  return response.json();
}

export async function rejectSubmissionService(
  id: number
): Promise<DocumentSubmissionResponse> {
  const response = await apiFetch(`/api/admissions/${id}/reject`, {
    method: "POST",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao rejeitar a admissão.");
  }
  return response.json();
}
