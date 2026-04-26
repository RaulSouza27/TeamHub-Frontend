# 📦 TeamHub - Código Completo do Frontend

Sistema completo de Gestão de Pessoas desenvolvido com React, TypeScript, React Router e Tailwind CSS.

---

## 🗂️ Estrutura de Pastas

```
src/
├── app/
│   ├── App.tsx                          # Componente raiz
│   ├── routes.tsx                       # Configuração de rotas
│   ├── context/
│   │   └── AuthContext.tsx              # Contexto de autenticação
│   ├── components/
│   │   ├── layouts/
│   │   │   └── RootLayout.tsx           # Layout principal com sidebar
│   │   └── pages/
│   │       ├── Login.tsx                # Tela de login
│   │       ├── Dashboard.tsx            # Dashboard por perfil
│   │       ├── Admissao.tsx             # Módulo de Admissão Digital
│   │       ├── Onboarding.tsx           # Módulo de Onboarding
│   │       └── Comunicacao.tsx          # Módulo de Comunicação + Chat
└── styles/
    └── theme.css                         # Tema customizado
```

---

## 🔑 Credenciais de Acesso

**Colaborador:**
- Email: `colaborador@teamhub.com`
- Senha: `123456`

**RH:**
- Email: `rh@teamhub.com`
- Senha: `123456`

**Gestor:**
- Email: `gestor@teamhub.com`
- Senha: `123456`

---

## 🎯 Funcionalidades por Módulo

### 1. **Sistema de Autenticação**
- Login com validação
- 3 perfis de usuário (Colaborador, RH, Gestor)
- Proteção de rotas
- Persistência de sessão via Context API

### 2. **Dashboard**
- **Colaborador:** Tarefas, trilha de onboarding, próximas atividades
- **RH:** Admissões pendentes, métricas de onboarding, alertas
- **Gestor:** Equipe, novos membros, reuniões agendadas

### 3. **Admissão Digital**
- **Colaborador:** Upload de documentos, acompanhamento de status
- **RH:** Validação de documentos, gestão de candidatos, integração eSocial

### 4. **Onboarding**
- **Colaborador:** Trilhas de integração, progresso, conquistas
- **RH:** Gestão de colaboradores em onboarding, métricas por departamento
- **Gestor:** Acompanhamento individual da equipe

### 5. **Comunicação Interna**
- Feed social corporativo
- Sistema de posts com curtidas, comentários e compartilhamentos
- Filtros por categoria
- **Chat em tempo real** com lista de contatos e status online/offline

---

## 📚 Tecnologias Utilizadas

- **React 18.3.1** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset tipado de JavaScript
- **React Router 7** - Navegação e roteamento
- **Tailwind CSS v4** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones
- **Vite** - Build tool e dev server

---

## 🚀 Como Executar

1. **Instalar dependências:**
```bash
pnpm install
```

2. **Iniciar servidor de desenvolvimento:**
```bash
pnpm run dev
```

3. **Acessar no navegador:**
```
http://localhost:5173
```

---

## 📋 Dependências Principais

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router": "7.13.0",
    "lucide-react": "0.487.0",
    "tailwindcss": "4.1.12"
  }
}
```

---

## 🎨 Paleta de Cores

**Gradientes principais:**
- Login: `blue-600 → purple-600 → pink-500`
- Botões primários: `blue-600 → purple-600`
- Chat: `blue-600 → purple-600`

**Cores de status:**
- Sucesso: `green-500`
- Aviso: `orange-500`
- Erro: `red-500`
- Informação: `blue-500`

---

## 🔐 Segurança

⚠️ **IMPORTANTE:** Este é um protótipo com autenticação simulada (mock).

Para produção, implemente:
- Autenticação JWT com backend real
- Criptografia de senhas (bcrypt)
- HTTPS obrigatório
- Rate limiting
- Validação de inputs
- Sanitização de dados
- CSRF protection

---

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (375px+)

---

## 🧩 Componentes Reutilizáveis

### Cards de Estatística
```tsx
<StatCard
  icon={Users}
  title="Total"
  value="24"
  color="blue"
  description="Colaboradores ativos"
/>
```

### Barra de Progresso
```tsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }} />
</div>
```

### Badge de Status
```tsx
<span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
  Aprovado
</span>
```

---

## 🔄 Fluxo de Dados

1. **Login** → Valida credenciais → Atualiza AuthContext
2. **AuthContext** → Fornece `user`, `login`, `logout`, `isAuthenticated`
3. **RootLayout** → Verifica autenticação → Redireciona se necessário
4. **Páginas** → Consomem `user` do contexto → Renderizam conteúdo específico

---

## 📊 Arquitetura MVC

### Model (Camada de Negócio)
- Interfaces TypeScript para tipagem
- Regras de validação
- Dados mock para demonstração

### View (Camada de Apresentação)
- Componentes React
- Tailwind CSS para estilos
- Responsividade mobile-first

### Controller (Camada de Aplicação)
- Context API para estado global
- React Router para navegação
- Event handlers para interações

---

## 🎯 Próximos Passos para Produção

1. **Backend Integration**
   - Criar API REST ou GraphQL
   - Conectar com banco de dados
   - Implementar autenticação real

2. **Upload de Arquivos**
   - Integrar com S3 ou storage similar
   - Validação de tipo e tamanho
   - Preview de documentos

3. **Notificações em Tempo Real**
   - WebSockets ou Server-Sent Events
   - Push notifications
   - Email notifications

4. **Testes**
   - Unit tests (Jest + React Testing Library)
   - Integration tests
   - E2E tests (Playwright/Cypress)

5. **Performance**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

---

## 📄 Licença

Este é um protótipo desenvolvido para demonstração.

---

## 👨‍💻 Suporte

Para dúvidas ou melhorias, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ usando Claude Code**
