# 🐙 Guia Completo - Salvar Projeto no GitHub

## 📋 Passo a Passo Completo

### Opção 1: Usando GitHub CLI (Recomendado)

#### 1. Instalar GitHub CLI

**macOS:**
```bash
brew install gh
```

**Linux:**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

**Windows:**
```bash
winget install --id GitHub.cli
```

#### 2. Autenticar no GitHub

```bash
gh auth login
```

Siga as instruções:
- Escolha: **GitHub.com**
- Protocolo: **HTTPS**
- Autenticação: **Login via navegador**

#### 3. Inicializar Git e Criar Repositório

```bash
# Navegar para a pasta do projeto
cd /workspaces/default/code

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit: TeamHub - Plataforma de Gestão de Pessoas

- Frontend React + TypeScript + Tailwind CSS
- Backend Node.js + Express + Prisma
- Módulos: Admissão Digital, Onboarding, Comunicação
- Chat em tempo real com Socket.io
- Autenticação JWT
- PostgreSQL database"

# Criar repositório no GitHub e fazer push
gh repo create teamhub --public --source=. --remote=origin --push
```

Pronto! ✅ Seu repositório foi criado e todo o código foi enviado.

---

### Opção 2: Usando Git + GitHub Manual

#### 1. Inicializar Git Localmente

```bash
# Navegar para a pasta do projeto
cd /workspaces/default/code

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Verificar arquivos adicionados
git status

# Fazer primeiro commit
git commit -m "Initial commit: TeamHub completo"
```

#### 2. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: **teamhub**
3. Descrição: **Plataforma Integrada de Gestão de Pessoas**
4. Visibilidade: **Public** ou **Private**
5. **NÃO** marque "Initialize with README"
6. Clique em **Create repository**

#### 3. Conectar Repositório Local ao GitHub

Copie os comandos que aparecem na tela do GitHub, algo como:

```bash
# Adicionar remote
git remote add origin https://github.com/SEU-USUARIO/teamhub.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

---

## 🔐 Configurar Autenticação

### Opção A: Personal Access Token (Recomendado)

1. Acesse: https://github.com/settings/tokens
2. Clique em **Generate new token (classic)**
3. Marque os escopos:
   - ✅ `repo` (acesso total a repositórios)
   - ✅ `workflow` (se usar GitHub Actions)
4. Clique em **Generate token**
5. **COPIE O TOKEN** (só aparece uma vez!)

Ao fazer push, use:
- **Username:** seu-usuario-github
- **Password:** cole-o-token-aqui

### Opção B: SSH Key

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu-email@example.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub:
# https://github.com/settings/ssh/new
```

Mudar remote para SSH:
```bash
git remote set-url origin git@github.com:SEU-USUARIO/teamhub.git
```

---

## 📝 Comandos Git Úteis

### Verificar Status

```bash
# Ver arquivos modificados
git status

# Ver diferenças
git diff

# Ver histórico de commits
git log --oneline
```

### Adicionar Mudanças

```bash
# Adicionar arquivo específico
git add arquivo.ts

# Adicionar todos os arquivos
git add .

# Adicionar por padrão
git add src/**/*.ts
```

### Fazer Commit

```bash
# Commit simples
git commit -m "Descrição da mudança"

# Commit detalhado
git commit -m "Título do commit" -m "Descrição detalhada aqui"

# Adicionar e commitar junto
git commit -am "Atualizar README"
```

### Enviar para GitHub

```bash
# Push normal
git push

# Push primeira vez (criar branch)
git push -u origin main

# Push forçado (cuidado!)
git push --force
```

### Branches

```bash
# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Listar branches
git branch

# Mudar de branch
git checkout main

# Merge de branch
git merge feature/nova-funcionalidade

# Deletar branch
git branch -d feature/nova-funcionalidade
```

---

## 🚀 Estrutura de Commits Recomendada

### Formato de Commit

```
tipo(escopo): descrição curta

Descrição detalhada opcional do que foi feito.

- Item 1
- Item 2
```

### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não altera código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de build/configuração

### Exemplos

```bash
git commit -m "feat(auth): adicionar login com JWT"

git commit -m "fix(chat): corrigir envio de mensagens em tempo real"

git commit -m "docs: atualizar README com instruções de instalação"

git commit -m "refactor(api): reorganizar estrutura de controllers"
```

---

## 📦 Arquivo .gitignore Já Criado

O arquivo `.gitignore` já está configurado para ignorar:

- ✅ `node_modules/`
- ✅ `.env` (senhas e segredos)
- ✅ `dist/` e `build/`
- ✅ Arquivos de log
- ✅ Uploads de usuários
- ✅ Arquivos do sistema (.DS_Store, Thumbs.db)
- ✅ Configurações de IDE

---

## 🔄 Atualizações Futuras

### Adicionar Novas Mudanças

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar arquivos
git add .

# 3. Fazer commit
git commit -m "feat: adicionar nova funcionalidade X"

# 4. Enviar para GitHub
git push
```

### Trabalhar em Nova Feature

```bash
# 1. Criar branch
git checkout -b feature/minha-feature

# 2. Fazer mudanças e commits
git add .
git commit -m "feat: implementar X"

# 3. Push da branch
git push -u origin feature/minha-feature

# 4. Criar Pull Request no GitHub
# Vá em: https://github.com/SEU-USUARIO/teamhub/pulls
```

---

## 🌐 Colaboração

### Clone por Outro Dev

```bash
# Clonar repositório
git clone https://github.com/SEU-USUARIO/teamhub.git
cd teamhub

# Instalar dependências frontend
pnpm install

# Instalar dependências backend
cd backend
npm install

# Configurar .env
cp .env.example .env
# Editar .env com suas configurações

# Executar migrations
npx prisma migrate dev

# Seed
npm run prisma:seed
```

### Pull Requests

1. Fork o repositório
2. Clone seu fork
3. Crie uma branch
4. Faça mudanças
5. Push para seu fork
6. Abra Pull Request

---

## 📊 GitHub Features para Usar

### 1. GitHub Actions (CI/CD)

Criar `.github/workflows/main.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

### 2. Issues

Para bugs e features:
https://github.com/SEU-USUARIO/teamhub/issues/new

### 3. Projects

Kanban board:
https://github.com/SEU-USUARIO/teamhub/projects

### 4. Wiki

Documentação adicional:
https://github.com/SEU-USUARIO/teamhub/wiki

---

## ✅ Checklist Final

Antes de fazer push, verifique:

- [ ] `.gitignore` configurado
- [ ] `.env` **NÃO** está sendo commitado
- [ ] `node_modules/` **NÃO** está sendo commitado
- [ ] README.md está atualizado
- [ ] Código compila sem erros
- [ ] Commits têm mensagens descritivas
- [ ] Não há senhas ou tokens no código
- [ ] LICENSE adicionado (se público)

---

## 🆘 Problemas Comuns

### "Permission denied (publickey)"

**Solução:** Configure SSH key ou use HTTPS com token

### "Remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/teamhub.git
```

### ".env foi commitado por engano"

```bash
# Remover do Git mas manter arquivo local
git rm --cached .env

# Adicionar ao .gitignore
echo ".env" >> .gitignore

# Commit
git commit -m "fix: remover .env do controle de versão"
```

### "Commits muito grandes"

```bash
# Ver tamanho dos arquivos
git ls-files | xargs du -h | sort -rh | head -20

# Remover arquivos grandes
git rm --cached arquivo-grande.zip
```

---

## 🎯 Resultado Final

Após seguir este guia, você terá:

✅ Repositório no GitHub
✅ Todo o código versionado
✅ Histórico de commits
✅ Pronto para colaboração
✅ Backup seguro na nuvem
✅ Possibilidade de deploy automático

URL do seu repositório:
**https://github.com/SEU-USUARIO/teamhub**

---

**Pronto! Projeto salvo no GitHub com sucesso!** 🎉
