import { apiFetch } from "./api";

export interface ComunicadoResponse {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorUsername: string;
}

export interface ComunicadoRequest {
  title: string;
  content: string;
}

export async function getFeedService(): Promise<ComunicadoResponse[]> {
  const response = await apiFetch("/api/statements/feed");
  if (!response.ok) {
    throw new Error("Erro ao carregar o mural de avisos.");
  }
  return response.json();
}

export async function postAnnouncementService(announcement: ComunicadoRequest): Promise<ComunicadoResponse> {
  const response = await apiFetch("/api/statements/global-announcements", {
    method: "POST",
    body: JSON.stringify(announcement),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "Erro ao publicar comunicado.");
  }
  return response.json();
}
