import { apiFetch } from "./api";

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  status: boolean;
  accessLevel: string;
}

export interface UserRequest {
  username?: string;
  email?: string;
  password?: string;
  accessLevel?: string;
  status?: boolean;
}

export async function getUsersService(): Promise<UserResponse[]> {
  const response = await apiFetch("/users");
  if (!response.ok) {
    throw new Error("Erro ao buscar usuários");
  }
  return response.json();
}

export async function getUserByIdService(id: number): Promise<UserResponse> {
  const response = await apiFetch(`/users/${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }
  return response.json();
}

export async function createUserService(user: UserRequest): Promise<UserResponse> {
  const response = await apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "Erro ao criar usuário");
  }
  return response.json();
}

export async function updateUserService(id: number, user: UserRequest): Promise<UserResponse> {
  const response = await apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "Erro ao atualizar usuário");
  }
  return response.json();
}

export async function deleteUserService(id: number): Promise<void> {
  const response = await apiFetch(`/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Erro ao deletar usuário");
  }
}
