const BASE_URL = 'backend-production-b3b6.up.railway.app:2630';

/**
 * Função wrapper para o fetch que já adiciona o token JWT nas requisições.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers = new Headers(options.headers || {});

  // Adiciona Content-Type padrão se não foi definido e se não for FormData
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Adiciona o token JWT
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}
