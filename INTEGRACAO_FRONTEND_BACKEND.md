# 🔗 Integração Frontend + Backend - TeamHub

Guia completo para conectar o frontend React com o backend Node.js/Express.

---

## 📋 Arquitetura da Integração

```
Frontend (React)          Backend (Node.js)         Database
Port 5173                 Port 3333                 PostgreSQL
     |                         |                          |
     |---> API REST ---------->|                          |
     |                         |----> Prisma ORM -------->|
     |<--- JSON Response ------|                          |
     |                         |                          |
     |---> WebSocket --------->|                          |
     |<--- Real-time Events ---|                          |
```

---

## 🛠️ Passo 1: Configurar Chamadas de API no Frontend

### 1.1 Criar Serviço de API

**Arquivo:** `src/app/services/api.ts`

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 1.2 Atualizar AuthContext

**Arquivo:** `src/app/context/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "../services/api";

export type UserRole = "COLABORADOR" | "RH" | "GESTOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

### 1.3 Criar Variável de Ambiente

**Arquivo:** `.env` (na raiz do frontend)

```env
VITE_API_URL=http://localhost:3333/api
VITE_WS_URL=http://localhost:3333
```

---

## 🔌 Passo 2: Integrar WebSocket para Chat

### 2.1 Instalar Socket.io Client

```bash
cd frontend
npm install socket.io-client
```

### 2.2 Criar Hook de Socket

**Arquivo:** `src/app/hooks/useSocket.ts`

```typescript
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3333';

export function useSocket(userId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(WS_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('register', userId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
}
```

### 2.3 Atualizar Componente de Chat

**Arquivo:** `src/app/components/pages/Comunicacao.tsx`

```typescript
import { useSocket } from '../../hooks/useSocket';

function ChatPanel({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const socket = useSocket(user?.id);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Escutar novas mensagens
    socket.on('receive-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !user || !socket) return;

    socket.emit('send-message', {
      senderId: user.id,
      receiverId: selectedUser,
      content: messageInput,
    });

    setMessageInput('');
  };

  // ... resto do código
}
```

---

## 📡 Passo 3: Criar Serviços para Cada Módulo

### 3.1 Serviço de Admissão

**Arquivo:** `src/app/services/admissionService.ts`

```typescript
import api from './api';

export const admissionService = {
  async list() {
    const response = await api.get('/admissions');
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/admissions', data);
    return response.data;
  },

  async uploadDocument(formData: FormData) {
    const response = await api.post('/admissions/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async approveDocument(documentId: string) {
    const response = await api.patch(`/admissions/documents/${documentId}/approve`);
    return response.data;
  },
};
```

### 3.2 Serviço de Onboarding

**Arquivo:** `src/app/services/onboardingService.ts`

```typescript
import api from './api';

export const onboardingService = {
  async list() {
    const response = await api.get('/onboarding');
    return response.data;
  },

  async create() {
    const response = await api.post('/onboarding');
    return response.data;
  },

  async updateProgress(onboardingId: string, taskId: string, completed: boolean) {
    const response = await api.patch(`/onboarding/${onboardingId}/progress`, {
      taskId,
      completed,
    });
    return response.data;
  },
};
```

### 3.3 Serviço de Comunicação

**Arquivo:** `src/app/services/communicationService.ts`

```typescript
import api from './api';

export const communicationService = {
  // Posts
  async listPosts(category?: string) {
    const response = await api.get('/posts', {
      params: { category },
    });
    return response.data;
  },

  async createPost(data: { content: string; category?: string }) {
    const response = await api.post('/posts', data);
    return response.data;
  },

  async likePost(postId: string) {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  async createComment(postId: string, content: string) {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // Messages
  async getConversations() {
    const response = await api.get('/conversations');
    return response.data;
  },

  async getMessages(userId: string) {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },

  async sendMessage(receiverId: string, content: string) {
    const response = await api.post('/messages', { receiverId, content });
    return response.data;
  },
};
```

---

## 🔄 Passo 4: Atualizar Componentes para Usar API Real

### Exemplo: Dashboard

```typescript
import { useState, useEffect } from 'react';
import { admissionService } from '../../services/admissionService';
import { onboardingService } from '../../services/onboardingService';

export function Dashboard() {
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.role === 'RH') {
          const [admissionsData, onboardingsData] = await Promise.all([
            admissionService.list(),
            onboardingService.list(),
          ]);
          setAdmissions(admissionsData);
          setOnboardings(onboardingsData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  // ... resto do código
}
```

---

## 🧪 Passo 5: Testar Integração

### 5.1 Iniciar Backend

```bash
cd backend
npm run dev
```

### 5.2 Iniciar Frontend

```bash
cd frontend
npm run dev
```

### 5.3 Testar Fluxo Completo

1. **Login:** http://localhost:5173/login
   - Usar: `colaborador@teamhub.com` / `123456`
   
2. **Dashboard:** Verificar se dados são carregados

3. **Admissão:** Testar upload de documento

4. **Onboarding:** Marcar tarefas como concluídas

5. **Chat:** Enviar mensagem em tempo real

---

## 🐛 Troubleshooting

### CORS Error

**Problema:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solução:** Verifique o `.env` do backend:
```env
CORS_ORIGIN=http://localhost:5173
```

### 401 Unauthorized

**Problema:** Token inválido ou expirado

**Solução:**
1. Faça logout
2. Limpe localStorage
3. Faça login novamente

### WebSocket não conecta

**Problema:** Socket.io não estabelece conexão

**Solução:**
1. Verifique se o backend está rodando
2. Confirme a URL do WebSocket: `http://localhost:3333`
3. Verifique firewall/antivírus

---

## 📊 Fluxo de Dados Completo

```
1. LOGIN
   Frontend → POST /api/auth/login
   Backend → Valida credenciais
   Backend → Retorna JWT token
   Frontend → Salva token no localStorage
   Frontend → Redireciona para dashboard

2. CARREGAR DADOS
   Frontend → GET /api/admissions (com token)
   Backend → Valida token
   Backend → Busca dados no banco
   Backend → Retorna JSON
   Frontend → Atualiza estado React

3. CHAT EM TEMPO REAL
   Frontend → Conecta WebSocket
   Frontend → Emite 'send-message'
   Backend → Salva no banco
   Backend → Emite 'receive-message' para destinatário
   Frontend → Atualiza lista de mensagens
```

---

## ✅ Checklist de Integração

- [ ] Backend rodando na porta 3333
- [ ] Frontend rodando na porta 5173
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Token JWT sendo enviado nos headers
- [ ] WebSocket conectando
- [ ] Login funcionando
- [ ] Dashboard carregando dados reais
- [ ] Upload de arquivos funcionando
- [ ] Chat em tempo real funcionando

---

## 🚀 Deploy Integrado

### Frontend (Vercel)

```bash
# Configurar variável de ambiente
VITE_API_URL=https://sua-api.herokuapp.com/api
VITE_WS_URL=https://sua-api.herokuapp.com

# Deploy
vercel --prod
```

### Backend (Heroku)

```bash
# Configurar CORS
heroku config:set CORS_ORIGIN=https://seu-frontend.vercel.app

# Deploy
git push heroku main
```

---

**Integração completa! Frontend e Backend comunicando perfeitamente.** 🎉
