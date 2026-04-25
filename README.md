# TeamHub

Plataforma de gestão de equipes e RH, desenvolvida com **React + Vite**.

---

## 📋 Pré-requisitos

### Desenvolvimento local (sem Docker)

| Ferramenta | Versão mínima | Download |
|---|---|---|
| Node.js | 20.x | [nodejs.org](https://nodejs.org) |
| npm | 9.x (já vem com o Node) | — |

### Via Docker (produção / CI)

| Ferramenta | Versão mínima | Download |
|---|---|---|
| Docker | 24.x | [docker.com](https://www.docker.com/get-started) |
| Docker Compose | v2 (plugin) | já incluso no Docker Desktop |

---

## 🚀 Rodando localmente

### 1. Clonar o repositório

```bash
git clone https://gitlab.com/RaulSouza27/teamhub.git
cd teamhub
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**

> O servidor de desenvolvimento possui Hot Module Replacement (HMR) — as alterações no código refletem instantaneamente no browser sem precisar recarregar a página.

---

## 🐳 Rodando com Docker

### Build e subir o container

```bash
docker compose up --build -d
```

A aplicação estará disponível em **http://localhost:2630**

### Parar o container

```bash
docker compose down
```

### Ver logs do container

```bash
docker compose logs -f
```

---

## 🔧 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção na pasta `/dist` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Executa o ESLint no projeto |

---

## 🏗️ Estrutura do projeto

```
teamhub/
├── public/              # Assets estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   └── main.jsx         # Entry point
├── Dockerfile           # Imagem Docker multi-stage (Node → Nginx)
├── docker-compose.yml   # Orquestração do container
├── nginx.conf           # Configuração do Nginx (dentro do container)
├── teamhub-ci.yml       # Pipeline GitLab CI/CD
└── vite.config.js       # Configuração do Vite
```

---

## ⚙️ CI/CD

O pipeline GitLab CI (`teamhub-ci.yml`) é disparado automaticamente nos branches `master` e `develop`.

Ao fazer push, o pipeline executa:

```
git push → docker compose up --build -d → aplicação disponível na porta 2630
```

> **Requisito:** o GitLab Runner deve estar configurado no modo `shell` com acesso ao Docker daemon da máquina host.
