# 🚀 TeamHub Backend API

Backend completo da plataforma TeamHub - Sistema de Gestão de Pessoas.

## 📋 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado
- **Express** - Framework web
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Socket.io** - WebSocket para chat em tempo real
- **Bcrypt** - Hash de senhas

---

## 🛠️ Instalação

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/teamhub?schema=public"
JWT_SECRET=sua-chave-secreta-super-segura
CORS_ORIGIN=http://localhost:5173
```

### 3. Configurar Banco de Dados PostgreSQL

**Opção 1: Docker**

```bash
docker run --name teamhub-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=teamhub \
  -p 5432:5432 \
  -d postgres:15
```

**Opção 2: PostgreSQL Local**

Instale o PostgreSQL e crie o banco:

```sql
CREATE DATABASE teamhub;
```

### 4. Executar Migrations

```bash
npx prisma migrate dev
```

### 5. Popular Banco de Dados (Seed)

```bash
npm run prisma:seed
```

### 6. Iniciar Servidor

```bash
npm run dev
```

O servidor estará rodando em: **http://localhost:3333**

---

## 📡 Endpoints da API

### 🔐 Autenticação

#### POST `/api/auth/register`
Registrar novo usuário

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "COLABORADOR"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "COLABORADOR"
  },
  "token": "jwt-token"
}
```

#### POST `/api/auth/login`
Fazer login

**Body:**
```json
{
  "email": "colaborador@teamhub.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "colaborador@teamhub.com",
    "role": "COLABORADOR"
  },
  "token": "jwt-token"
}
```

#### GET `/api/auth/me`
Buscar usuário autenticado

**Headers:**
```
Authorization: Bearer {token}
```

---

### 📄 Admissão Digital

#### POST `/api/admissions`
Criar nova admissão

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "department": "Tecnologia",
  "position": "Desenvolvedor",
  "startDate": "2026-05-01"
}
```

#### GET `/api/admissions`
Listar admissões

#### GET `/api/admissions/:id`
Buscar admissão específica

#### POST `/api/admissions/documents/upload`
Upload de documento

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (FormData):**
- `file`: Arquivo
- `admissionId`: ID da admissão
- `documentName`: Nome do documento

#### PATCH `/api/admissions/documents/:id/approve`
Aprovar documento (RH/Gestor apenas)

---

### 🎓 Onboarding

#### POST `/api/onboarding`
Criar onboarding

#### GET `/api/onboarding`
Listar onboardings

#### GET `/api/onboarding/:id`
Buscar onboarding específico

#### PATCH `/api/onboarding/:id/progress`
Atualizar progresso

**Body:**
```json
{
  "taskId": "uuid",
  "completed": true
}
```

---

### 💬 Comunicação

#### POST `/api/posts`
Criar post

**Body:**
```json
{
  "content": "Mensagem do post",
  "category": "Anúncio",
  "imageUrl": "url-opcional"
}
```

#### GET `/api/posts`
Listar posts

**Query params:**
- `category`: Filtrar por categoria (opcional)

#### POST `/api/posts/:id/like`
Curtir/descurtir post

#### POST `/api/posts/:id/comments`
Comentar em post

**Body:**
```json
{
  "content": "Texto do comentário"
}
```

---

### 💬 Mensagens (Chat)

#### POST `/api/messages`
Enviar mensagem

**Body:**
```json
{
  "receiverId": "uuid",
  "content": "Olá!"
}
```

#### GET `/api/messages/:userId`
Buscar mensagens com usuário específico

#### GET `/api/conversations`
Listar todas as conversas

---

## 🔌 WebSocket (Socket.io)

### Eventos do Cliente

#### `register`
Registrar usuário online

```javascript
socket.emit('register', userId);
```

#### `send-message`
Enviar mensagem em tempo real

```javascript
socket.emit('send-message', {
  senderId: 'uuid',
  receiverId: 'uuid',
  content: 'Mensagem'
});
```

#### `typing`
Notificar que está digitando

```javascript
socket.emit('typing', { receiverId: 'uuid' });
```

### Eventos do Servidor

#### `user-online`
Usuário ficou online

```javascript
socket.on('user-online', (userId) => {
  console.log('User online:', userId);
});
```

#### `user-offline`
Usuário ficou offline

```javascript
socket.on('user-offline', (userId) => {
  console.log('User offline:', userId);
});
```

#### `receive-message`
Receber nova mensagem

```javascript
socket.on('receive-message', (message) => {
  console.log('New message:', message);
});
```

#### `user-typing`
Usuário está digitando

```javascript
socket.on('user-typing', ({ userId }) => {
  console.log('User typing:', userId);
});
```

---

## 🗄️ Schema do Banco de Dados

### Principais Tabelas

- **users** - Usuários do sistema
- **admissions** - Processos de admissão
- **documents** - Documentos enviados
- **onboardings** - Processos de onboarding
- **onboarding_tracks** - Trilhas de integração
- **onboarding_tasks** - Tarefas das trilhas
- **posts** - Posts do feed
- **comments** - Comentários nos posts
- **likes** - Curtidas nos posts
- **messages** - Mensagens do chat

---

## 📊 Comandos Úteis do Prisma

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar migration
npx prisma migrate dev --name nome-da-migration

# Visualizar banco de dados
npm run prisma:studio

# Reset banco de dados
npx prisma migrate reset

# Popular banco (seed)
npm run prisma:seed
```

---

## 🔒 Autenticação e Autorização

### Middleware de Autenticação

Todas as rotas protegidas requerem o header:

```
Authorization: Bearer {jwt-token}
```

### Roles (Perfis)

- **COLABORADOR** - Acesso básico
- **RH** - Gerenciamento de admissões e onboarding
- **GESTOR** - Gerenciamento de equipe

### Middleware de Role

Algumas rotas são restritas por role:

```typescript
router.patch(
  '/admissions/documents/:id/approve',
  authMiddleware,
  roleMiddleware('RH', 'GESTOR'),
  controller.approveDocument
);
```

---

## 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/           # Configurações (DB, env)
│   ├── controllers/      # Controllers das rotas
│   ├── middlewares/      # Middlewares (auth, errors)
│   ├── routes/           # Definição de rotas
│   ├── types/            # TypeScript types/interfaces
│   ├── utils/            # Funções auxiliares (jwt, bcrypt)
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   └── seed.ts           # Seed do banco
├── uploads/              # Arquivos enviados
├── .env                  # Variáveis de ambiente
├── package.json
└── tsconfig.json
```

---

## 🧪 Testando a API

### Com cURL

```bash
# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"colaborador@teamhub.com","password":"123456"}'

# Buscar posts (autenticado)
curl -X GET http://localhost:3333/api/posts \
  -H "Authorization: Bearer {seu-token}"
```

### Com Insomnia/Postman

Importe a coleção de endpoints disponível em `docs/api-collection.json`

---

## 🚀 Deploy

### Build para Produção

```bash
npm run build
npm start
```

### Variáveis de Ambiente de Produção

```env
NODE_ENV=production
DATABASE_URL=sua-url-production
JWT_SECRET=chave-muito-segura
CORS_ORIGIN=https://seu-dominio.com
```

---

## 🐳 Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3333
CMD ["npm", "start"]
```

---

## 📝 Credenciais Seed

Após executar `npm run prisma:seed`:

- **Colaborador:** colaborador@teamhub.com | 123456
- **RH:** rh@teamhub.com | 123456
- **Gestor:** gestor@teamhub.com | 123456

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para TeamHub**
