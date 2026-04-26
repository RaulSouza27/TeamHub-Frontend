# 🚀 Guia Completo de Instalação - TeamHub Backend

## 📋 Pré-requisitos

- **Node.js 18+** ou superior
- **PostgreSQL 12+** ou superior
- **npm** ou **yarn** ou **pnpm**

---

## 🛠️ Passo a Passo

### 1. Instalar PostgreSQL

#### macOS (Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
Baixe e instale: https://www.postgresql.org/download/windows/

#### Docker (Recomendado para Desenvolvimento)
```bash
docker run --name teamhub-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=teamhub \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Clonar/Criar Estrutura do Projeto

```bash
mkdir teamhub-backend
cd teamhub-backend
```

### 3. Copiar Arquivos do Backend

Copie todos os arquivos fornecidos mantendo a estrutura:

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── admissionController.ts
│   │   ├── onboardingController.ts
│   │   └── communicationController.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── bcrypt.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

### 4. Instalar Dependências

```bash
npm install
```

Ou com yarn:
```bash
yarn install
```

Ou com pnpm:
```bash
pnpm install
```

### 5. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
NODE_ENV=development
PORT=3333
HOST=localhost

# Altere conforme sua configuração do PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/teamhub?schema=public"

# IMPORTANTE: Mude isso em produção!
JWT_SECRET=sua-chave-secreta-super-segura-aqui-mude-isso
JWT_EXPIRES_IN=7d

# URL do frontend
CORS_ORIGIN=http://localhost:5173

# Upload de arquivos
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# WebSocket
SOCKET_PORT=3334
```

### 6. Criar Banco de Dados

Se não estiver usando Docker:

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE teamhub;

# Sair
\q
```

### 7. Executar Migrations do Prisma

```bash
npx prisma migrate dev
```

Esse comando irá:
- Criar as tabelas no banco de dados
- Gerar o Prisma Client
- Aplicar todas as migrations

### 8. Popular Banco de Dados (Seed)

```bash
npm run prisma:seed
```

Isso criará:
- 3 usuários de teste (Colaborador, RH, Gestor)
- Dados de exemplo para admissão
- Documentos de exemplo
- Processos de onboarding
- Posts no feed

### 9. Criar Pasta de Uploads

```bash
mkdir -p uploads
```

### 10. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Você deverá ver:

```
🚀 Server running on http://localhost:3333
📡 Socket.io running on http://localhost:3333
🌍 Environment: development
```

### 11. Testar a API

```bash
# Health check
curl http://localhost:3333/health

# Login de teste
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"colaborador@teamhub.com","password":"123456"}'
```

---

## ✅ Verificação Rápida

### Testar Banco de Dados

```bash
npx prisma studio
```

Isso abrirá uma interface visual em **http://localhost:5555** para visualizar os dados.

### Testar Endpoints

**1. Login:**
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rh@teamhub.com",
    "password": "123456"
  }'
```

**2. Buscar usuário atual (copie o token do login):**
```bash
curl http://localhost:3333/api/auth/me \
  -H "Authorization: Bearer SEU-TOKEN-AQUI"
```

**3. Listar posts:**
```bash
curl http://localhost:3333/api/posts \
  -H "Authorization: Bearer SEU-TOKEN-AQUI"
```

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                  # Iniciar com hot-reload

# Build
npm run build               # Compilar TypeScript
npm start                   # Executar versão compilada

# Prisma
npm run prisma:generate     # Gerar Prisma Client
npm run prisma:migrate      # Executar migrations
npm run prisma:studio       # Interface visual do banco
npm run prisma:seed         # Popular banco de dados

# Database
npx prisma migrate reset    # Resetar banco completamente
npx prisma db push          # Sincronizar schema sem migration
```

---

## 🐛 Solução de Problemas

### Erro: "connect ECONNREFUSED 127.0.0.1:5432"

**Problema:** PostgreSQL não está rodando

**Solução:**
```bash
# Linux/macOS
sudo systemctl start postgresql

# macOS (Homebrew)
brew services start postgresql@15

# Docker
docker start teamhub-postgres
```

### Erro: "database teamhub does not exist"

**Problema:** Banco não foi criado

**Solução:**
```bash
psql -U postgres -c "CREATE DATABASE teamhub;"
```

### Erro: "role postgres does not exist"

**Problema:** Usuário postgres não existe

**Solução:**
```bash
# Criar usuário
createuser -U postgres -s postgres
```

### Erro: Prisma Client não encontrado

**Problema:** Prisma Client não foi gerado

**Solução:**
```bash
npx prisma generate
```

### Erro: Porta 3333 já em uso

**Solução:** Altere a porta no `.env`:
```env
PORT=3334
```

### Migrations não funcionam

**Solução:** Reset completo:
```bash
npx prisma migrate reset
npx prisma migrate dev
npm run prisma:seed
```

---

## 📊 Credenciais de Teste

Após executar o seed, você terá:

| Perfil | Email | Senha |
|--------|-------|-------|
| Colaborador | colaborador@teamhub.com | 123456 |
| RH | rh@teamhub.com | 123456 |
| Gestor | gestor@teamhub.com | 123456 |

---

## 🔒 Segurança em Produção

Antes de fazer deploy:

1. **Altere o JWT_SECRET**
```env
JWT_SECRET=$(openssl rand -base64 32)
```

2. **Use HTTPS**
```env
NODE_ENV=production
```

3. **Configure CORS corretamente**
```env
CORS_ORIGIN=https://seu-dominio.com
```

4. **Use variáveis de ambiente seguras**
- Nunca commite o arquivo `.env`
- Use serviços como AWS Secrets Manager ou Vault

5. **Configure rate limiting**
- Adicione rate limit nas rotas de autenticação

---

## 🚀 Deploy

### Heroku

```bash
# Instalar Heroku CLI
heroku create teamhub-api

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variáveis
heroku config:set JWT_SECRET=sua-chave-secreta
heroku config:set CORS_ORIGIN=https://seu-frontend.com

# Deploy
git push heroku main

# Executar migrations
heroku run npx prisma migrate deploy
```

### Railway

```bash
# Conectar repositório GitHub
# Configurar variáveis de ambiente
# Deploy automático
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: teamhub
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/teamhub
      JWT_SECRET: sua-chave-secreta
      CORS_ORIGIN: http://localhost:5173
    ports:
      - "3333:3333"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

## 📝 Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL instalado e rodando
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Banco de dados criado
- [ ] Migrations executadas (`npx prisma migrate dev`)
- [ ] Seed executado (`npm run prisma:seed`)
- [ ] Pasta `uploads` criada
- [ ] Servidor rodando (`npm run dev`)
- [ ] Testes de API funcionando

---

## 🎯 Próximos Passos

1. Conectar o frontend com o backend
2. Testar todos os endpoints
3. Implementar testes automatizados
4. Configurar CI/CD
5. Fazer deploy em produção

---

## 📚 Documentação Adicional

- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js](https://expressjs.com)
- [Socket.io](https://socket.io)
- [JWT](https://jwt.io)
- [PostgreSQL](https://www.postgresql.org/docs)

---

**Backend pronto! Agora conecte com o frontend e teste a aplicação completa.** 🚀
