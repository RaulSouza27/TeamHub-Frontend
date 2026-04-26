# 🚀 TeamHub - Plataforma Integrada de Gestão de Pessoas

Sistema completo de gestão de pessoas com módulos de Admissão Digital, Onboarding e Comunicação Interna.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Uso](#uso)
- [API](#api)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 📖 Sobre o Projeto

O TeamHub é uma plataforma moderna e integrada para gestão de pessoas que automatiza e otimiza a jornada do colaborador desde a admissão até a integração completa na organização.

### Módulos Principais

1. **Admissão Digital** - Automatização do processo de entrada
2. **Gestão de Onboarding** - Trilhas personalizadas de integração
3. **Comunicação Interna** - Feed social + Chat em tempo real

### Perfis de Usuário

- **Colaborador** - Usuário padrão
- **RH** - Gerenciamento de admissões e onboarding
- **Gestor** - Gestão de equipes

---

## 🛠️ Tecnologias

### Frontend

- React 18.3.1
- TypeScript
- React Router 7
- Tailwind CSS v4
- Lucide Icons
- Vite

### Backend

- Node.js 18+
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Socket.io (WebSocket)
- Bcrypt

---

## 📁 Estrutura do Projeto

```
teamhub/
├── src/                      # Frontend React
│   ├── app/
│   │   ├── components/       # Componentes React
│   │   ├── context/          # Context API
│   │   └── routes.tsx        # Rotas
│   └── styles/               # Estilos Tailwind
│
├── backend/                  # Backend Node.js
│   ├── src/
│   │   ├── config/           # Configurações
│   │   ├── controllers/      # Controllers
│   │   ├── middlewares/      # Middlewares
│   │   ├── routes/           # Rotas da API
│   │   └── server.ts         # Entry point
│   └── prisma/               # Schema e migrations
│
├── TODOS_OS_CODIGOS.md      # Documentação frontend
├── INSTALACAO_BACKEND.md    # Guia instalação backend
└── README.md                # Este arquivo
```

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ ou superior
- PostgreSQL 12+ ou superior
- pnpm (recomendado) ou npm

### 1. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/teamhub.git
cd teamhub
```

### 2. Instalar Frontend

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
pnpm run dev
```

Frontend estará em: **http://localhost:5173**

### 3. Instalar Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Configurar DATABASE_URL no .env
# Exemplo: DATABASE_URL="postgresql://postgres:postgres@localhost:5432/teamhub"

# Executar migrations
npx prisma migrate dev

# Popular banco de dados
npm run prisma:seed

# Iniciar servidor
npm run dev
```

Backend estará em: **http://localhost:3333**

---

## 🎯 Uso

### Credenciais de Teste

Após executar o seed do backend:

| Perfil | Email | Senha |
|--------|-------|-------|
| Colaborador | colaborador@teamhub.com | 123456 |
| RH | rh@teamhub.com | 123456 |
| Gestor | gestor@teamhub.com | 123456 |

### Acessar Aplicação

1. Abra http://localhost:5173
2. Faça login com uma das credenciais acima
3. Explore os módulos disponíveis

---

## 📡 API

### Base URL

```
http://localhost:3333/api
```

### Endpoints Principais

#### Autenticação

```bash
# Login
POST /auth/login
Content-Type: application/json

{
  "email": "colaborador@teamhub.com",
  "password": "123456"
}

# Resposta
{
  "user": { ... },
  "token": "jwt-token"
}
```

#### Admissões

```bash
# Listar admissões
GET /admissions
Authorization: Bearer {token}

# Upload de documento
POST /admissions/documents/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

#### Onboarding

```bash
# Listar onboardings
GET /onboarding
Authorization: Bearer {token}

# Atualizar progresso
PATCH /onboarding/:id/progress
Authorization: Bearer {token}
```

#### Comunicação

```bash
# Listar posts
GET /posts
Authorization: Bearer {token}

# Curtir post
POST /posts/:id/like
Authorization: Bearer {token}
```

#### Chat

```bash
# Enviar mensagem
POST /messages
Authorization: Bearer {token}

{
  "receiverId": "user-id",
  "content": "Mensagem"
}

# Buscar conversas
GET /conversations
Authorization: Bearer {token}
```

Para documentação completa da API, veja [backend/README.md](backend/README.md)

---

## 🔌 WebSocket

### Conectar ao Chat

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3333');

// Registrar usuário
socket.emit('register', userId);

// Enviar mensagem
socket.emit('send-message', {
  senderId: 'user-id',
  receiverId: 'recipient-id',
  content: 'Olá!'
});

// Receber mensagem
socket.on('receive-message', (message) => {
  console.log('Nova mensagem:', message);
});
```

---

## 🗄️ Banco de Dados

### Visualizar Dados

```bash
cd backend
npx prisma studio
```

Abrirá interface em: **http://localhost:5555**

### Resetar Banco de Dados

```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

---

## 🚀 Deploy

### Frontend (Vercel)

```bash
# Configurar variável de ambiente
VITE_API_URL=https://sua-api.herokuapp.com/api

# Deploy
vercel --prod
```

### Backend (Heroku)

```bash
# Criar app
heroku create teamhub-api

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variáveis
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set CORS_ORIGIN=https://seu-frontend.vercel.app

# Deploy
git push heroku main

# Executar migrations
heroku run npx prisma migrate deploy
```

---

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
npm test
```

---

## 📚 Documentação Adicional

- [Código Frontend Completo](TODOS_OS_CODIGOS.md)
- [Instalação Backend](INSTALACAO_BACKEND.md)
- [Integração Frontend-Backend](INTEGRACAO_FRONTEND_BACKEND.md)
- [API Backend](backend/README.md)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Autores

- **TeamHub Development Team**

---

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou envie um email para suporte@teamhub.com

---

## 🙏 Agradecimentos

- React Team
- Prisma Team
- Express Team
- Todos os contribuidores open source

---

**Desenvolvido com ❤️ usando Claude Code**

Última atualização: Abril 2026
