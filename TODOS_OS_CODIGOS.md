# 🚀 TeamHub - Todos os Códigos Frontend

## 📁 Índice de Arquivos

1. [App.tsx](#1-apptsx)
2. [routes.tsx](#2-routestsx)
3. [AuthContext.tsx](#3-authcontexttsx)
4. [RootLayout.tsx](#4-rootlayouttsx)
5. [Login.tsx](#5-logintsx)
6. [Dashboard.tsx](#6-dashboardtsx)
7. [Admissao.tsx](#7-admissaotsx)
8. [Onboarding.tsx](#8-onboardingtsx)
9. [Comunicacao.tsx](#9-comunicacaotsx)

---

## 1. App.tsx

**Localização:** `src/app/App.tsx`

```tsx
import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
```

---

## 2. routes.tsx

**Localização:** `src/app/routes.tsx`

```tsx
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { Login } from "./components/pages/Login";
import { Dashboard } from "./components/pages/Dashboard";
import { Admissao } from "./components/pages/Admissao";
import { Onboarding } from "./components/pages/Onboarding";
import { Comunicacao } from "./components/pages/Comunicacao";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "admissao",
        Component: Admissao,
      },
      {
        path: "onboarding",
        Component: Onboarding,
      },
      {
        path: "comunicacao",
        Component: Comunicacao,
      },
    ],
  },
]);
```

---

## 3. AuthContext.tsx

**Localização:** `src/app/context/AuthContext.tsx`

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "colaborador" | "rh" | "gestor";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUsers: Record<string, User> = {
      "colaborador@teamhub.com": {
        id: "1",
        name: "João Silva",
        email: "colaborador@teamhub.com",
        role: "colaborador",
      },
      "rh@teamhub.com": {
        id: "2",
        name: "Maria Santos",
        email: "rh@teamhub.com",
        role: "rh",
      },
      "gestor@teamhub.com": {
        id: "3",
        name: "Carlos Oliveira",
        email: "gestor@teamhub.com",
        role: "gestor",
      },
    };

    const foundUser = mockUsers[email];
    if (foundUser && password === "123456") {
      setUser(foundUser);
    } else {
      throw new Error("Credenciais inválidas");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
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

---

## 4. RootLayout.tsx

**Localização:** `src/app/components/layouts/RootLayout.tsx`

Ver arquivo completo no repositório. Este componente contém:
- Sidebar responsiva com navegação
- Perfil do usuário
- Menu baseado em permissões por role
- Logout

Principais features:
- 264 linhas
- Sidebar colapsável
- Menu dinâmico por perfil
- Indicador de rota ativa

---

## 5. Login.tsx

**Localização:** `src/app/components/pages/Login.tsx`

Tela de login completa com:
- Layout split-screen (imagem + formulário)
- Gradiente colorido
- Botões de acesso rápido para contas demo
- Totalmente responsivo

258 linhas de código.

---

## 6. Dashboard.tsx

**Localização:** `src/app/components/pages/Dashboard.tsx`

Dashboard personalizado por perfil:

**Colaborador:**
- Status de admissão e onboarding
- Tarefas pendentes
- Trilha de integração

**RH:**
- Admissões ativas
- Documentos pendentes
- Métricas de onboarding
- Alertas e notificações

**Gestor:**
- Visão da equipe
- Novos membros em integração
- Reuniões agendadas
- Ações pendentes

577 linhas com componentes reutilizáveis.

---

## 7. Admissao.tsx

**Localização:** `src/app/components/pages/Admissao.tsx`

Módulo de Admissão Digital:

**Colaborador:**
- Upload de documentos
- Acompanhamento de status
- Barra de progresso

**RH:**
- Lista de candidatos
- Validação de documentos
- Integração eSocial simulada

525 linhas com gerenciamento de estado para documentos.

---

## 8. Onboarding.tsx

**Localização:** `src/app/components/pages/Onboarding.tsx`

Módulo de Gestão de Onboarding:

**Colaborador:**
- Trilhas de integração
- Sistema de progresso
- Conquistas (gamificação)
- Tarefas por etapa

**RH:**
- Visão geral de todos onboardings
- Métricas e KPIs
- Performance por departamento

**Gestor:**
- Acompanhamento da equipe
- Checklist de ações
- Reuniões 1:1

903 linhas - arquivo mais extenso do sistema.

---

## 9. Comunicacao.tsx

**Localização:** `src/app/components/pages/Comunicacao.tsx`

Módulo de Comunicação Interna + Chat:

**Feed Social:**
- Posts com curtidas, comentários, compartilhamentos
- Filtros por categoria
- Sidebar com destaques, eventos, aniversariantes

**Chat em Tempo Real:**
- Lista de contatos com busca
- Status online/offline
- Mensagens privadas
- Interface moderna com gradientes
- Notificações de mensagens não lidas

854 linhas incluindo o componente de chat completo.

---

## 📦 Como Usar Este Código

### 1. Estrutura de Pastas

Crie a seguinte estrutura:

```
meu-projeto/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── components/
│   │       ├── layouts/
│   │       │   └── RootLayout.tsx
│   │       └── pages/
│   │           ├── Login.tsx
│   │           ├── Dashboard.tsx
│   │           ├── Admissao.tsx
│   │           ├── Onboarding.tsx
│   │           └── Comunicacao.tsx
│   └── styles/
│       └── theme.css
├── package.json
└── vite.config.ts
```

### 2. Instalar Dependências

```bash
pnpm add react@18.3.1 react-dom@18.3.1
pnpm add react-router@7.13.0
pnpm add lucide-react@0.487.0
pnpm add -D tailwindcss@4.1.12 @tailwindcss/vite@4.1.12
pnpm add -D @vitejs/plugin-react@4.7.0
pnpm add -D vite@6.3.5
```

### 3. Configurar Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### 4. Executar

```bash
pnpm run dev
```

---

## 🎯 Principais Conceitos Utilizados

### React Hooks
- `useState` - Gerenciamento de estado local
- `useContext` - Compartilhamento de estado global
- `useEffect` - Efeitos colaterais (redirecionamento)
- `useNavigate` - Navegação programática
- `useLocation` - Detectar rota atual

### Patterns
- **Context API** - Autenticação global
- **Compound Components** - Cards reutilizáveis
- **Controlled Components** - Formulários
- **Conditional Rendering** - Visões por perfil

### TypeScript
- Interfaces para tipagem forte
- Tipos customizados (UserRole)
- Type guards
- Optional chaining

### Tailwind CSS
- Utility classes
- Responsive design
- Custom gradients
- Hover states
- Transitions

---

## 🔧 Customizações Comuns

### Adicionar Nova Rota

```tsx
// routes.tsx
{
  path: "nova-pagina",
  Component: NovaPagina,
}
```

### Adicionar Novo Perfil

```tsx
// AuthContext.tsx
export type UserRole = "colaborador" | "rh" | "gestor" | "admin";

// Adicionar mock user
"admin@teamhub.com": {
  id: "4",
  name: "Admin User",
  email: "admin@teamhub.com",
  role: "admin",
}
```

### Mudar Cores do Tema

```tsx
// Substituir classes Tailwind
from-blue-600 to-purple-600  →  from-green-600 to-teal-600
```

---

## 📊 Estatísticas do Código

- **Total de linhas:** ~3.400
- **Componentes:** 50+
- **Páginas:** 5
- **Contexts:** 1
- **Layouts:** 1
- **Linguagem:** TypeScript
- **Framework CSS:** Tailwind v4

---

## 🚨 Importante

Este código é um **protótipo funcional** com dados mockados.

Para produção, implemente:
- ✅ Backend real com API
- ✅ Banco de dados
- ✅ Autenticação JWT
- ✅ Upload de arquivos
- ✅ WebSockets para chat real
- ✅ Testes automatizados
- ✅ CI/CD pipeline

---

**Desenvolvido com Claude Code** 🤖
