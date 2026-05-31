import { apiFetch } from "./api";

export interface ComunicadoResponse {
  id: number;
  titulo: string;
  conteudo: string;
  createdAt: string;
  authorUsername: string;
}

export interface ComunicadoRequest {
  titulo: string;
  conteudo: string;
}

export async function getFeedService(): Promise<ComunicadoResponse[]> {
  const response = await apiFetch("/api/comunicacao/feed");
  if (!response.ok) {
    throw new Error("Erro ao carregar o mural de avisos.");
  }
  return response.json();
}

export async function postAnnouncementService(announcement: ComunicadoRequest): Promise<ComunicadoResponse> {
  const response = await apiFetch("/api/comunicacao/global-announcements", {
    method: "POST",
    body: JSON.stringify(announcement),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "Erro ao publicar comunicado.");
  }
  return response.json();
}
