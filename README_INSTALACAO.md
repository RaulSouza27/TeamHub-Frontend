# 🚀 TeamHub - Guia Completo de Instalação

## 📋 Pré-requisitos

- Node.js 18+ ou superior
- pnpm (gerenciador de pacotes)

### Instalar pnpm (se não tiver)

```bash
npm install -g pnpm
```

---

## 🛠️ Passo a Passo de Instalação

### 1. Criar Novo Projeto Vite + React

```bash
pnpm create vite@latest teamhub --template react-ts
cd teamhub
```

### 2. Instalar Dependências do Projeto

```bash
# Dependências principais
pnpm add react@18.3.1 react-dom@18.3.1
pnpm add react-router@7.13.0
pnpm add lucide-react@0.487.0

# Dependências de desenvolvimento
pnpm add -D tailwindcss@4.1.12
pnpm add -D @tailwindcss/vite@4.1.12
pnpm add -D @vitejs/plugin-react@4.7.0
pnpm add -D vite@6.3.5
pnpm add -D typescript@5.6.3
```

### 3. Criar Estrutura de Pastas

```bash
# Criar pastas necessárias
mkdir -p src/app/context
mkdir -p src/app/components/layouts
mkdir -p src/app/components/pages
mkdir -p src/styles
```

### 4. Copiar Arquivos do Código

Copie os arquivos na seguinte ordem:

#### 4.1. Arquivos Base

```
src/app/App.tsx
src/app/routes.tsx
src/app/context/AuthContext.tsx
```

#### 4.2. Layouts

```
src/app/components/layouts/RootLayout.tsx
```

#### 4.3. Páginas

```
src/app/components/pages/Login.tsx
src/app/components/pages/Dashboard.tsx
src/app/components/pages/Admissao.tsx
src/app/components/pages/Onboarding.tsx
src/app/components/pages/Comunicacao.tsx
```

### 5. Configurar Vite

**Arquivo:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    open: true,
  },
});
```

### 6. Configurar Tailwind CSS

**Arquivo:** `src/styles/theme.css`

```css
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --switch-background: #cbced4;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }

  html {
    font-size: var(--font-size);
  }

  h1 {
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h2 {
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  button {
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }
}
```

### 7. Atualizar main.tsx

**Arquivo:** `src/main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### 8. Atualizar index.html

**Arquivo:** `index.html`

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TeamHub - Gestão de Pessoas</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 9. Configurar TypeScript

**Arquivo:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 10. Executar o Projeto

```bash
# Instalar todas as dependências
pnpm install

# Executar em modo de desenvolvimento
pnpm run dev
```

O projeto estará disponível em: **http://localhost:5173**

---

## 🔑 Credenciais de Teste

### Colaborador
- **Email:** colaborador@teamhub.com
- **Senha:** 123456

### RH
- **Email:** rh@teamhub.com
- **Senha:** 123456

### Gestor
- **Email:** gestor@teamhub.com
- **Senha:** 123456

---

## 📦 package.json Completo

```json
{
  "name": "teamhub",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router": "7.13.0",
    "lucide-react": "0.487.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "typescript": "5.6.3",
    "vite": "6.3.5"
  }
}
```

---

## 🎨 Recursos do Sistema

### Módulos Principais

1. **Login** - Autenticação com 3 perfis
2. **Dashboard** - Visão personalizada por perfil
3. **Admissão Digital** - Gestão de documentos
4. **Onboarding** - Trilhas de integração
5. **Comunicação** - Feed social + Chat em tempo real

### Funcionalidades

✅ Autenticação com Context API
✅ Navegação com React Router 7
✅ Design responsivo com Tailwind CSS
✅ Componentes reutilizáveis
✅ TypeScript para tipagem forte
✅ Layout moderno com gradientes
✅ Chat em tempo real
✅ Upload de documentos (mock)
✅ Sistema de notificações
✅ Gamificação (conquistas)

---

## 🐛 Solução de Problemas

### Erro: "Cannot find module 'react-router'"

```bash
pnpm add react-router@7.13.0
```

### Erro: Tailwind não está funcionando

```bash
pnpm add -D @tailwindcss/vite@4.1.12
```

Verifique se `tailwindcss()` está no `vite.config.ts`

### Erro: "Module not found: Can't resolve 'lucide-react'"

```bash
pnpm add lucide-react@0.487.0
```

### Porta 5173 já está em uso

Altere a porta em `vite.config.ts`:

```typescript
server: {
  port: 3000, // ou outra porta
}
```

---

## 📚 Próximos Passos

### Para Desenvolvimento

1. Conectar com backend real
2. Implementar upload de arquivos
3. Adicionar WebSockets para chat real
4. Implementar notificações push
5. Criar testes automatizados

### Para Produção

1. Build otimizado: `pnpm run build`
2. Configurar variáveis de ambiente
3. Implementar autenticação JWT
4. Adicionar analytics
5. Configurar CI/CD

---

## 📖 Documentação Adicional

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org)

---

## 🤝 Suporte

Para dúvidas ou problemas:
- Verifique os logs no console do navegador (F12)
- Verifique os logs do terminal
- Confirme que todas as dependências estão instaladas

---

**Desenvolvido com ❤️ usando Claude Code**

Última atualização: Abril 2026
