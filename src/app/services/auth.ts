import { apiFetch } from "./api";

export interface LoginResponse {
  token: string | null;
  message: string;
}

export class AuthError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = "AuthError";
  }
}

export async function loginService(username: string, password: string): Promise<LoginResponse> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  const data: LoginResponse = await response.json();

  if (response.ok && response.status === 200) {
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  }

  if (response.status === 401) {
    throw new AuthError(data.message || "Credenciais inválidas", 401);
  }

  if (response.status === 403) {
    throw new AuthError(data.message || "Usuário inativo", 403);
  }

  // Erro genérico
  throw new AuthError(data.message || "Erro na autenticação", response.status);
}

export function logoutService() {
  localStorage.removeItem("token");
}
