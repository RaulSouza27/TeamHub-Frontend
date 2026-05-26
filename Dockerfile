# ─────────────────────────────────────────────
#  Stage 1 – Build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências primeiro (cache layer)
COPY package*.json ./
RUN npm ci

# Copia o restante e faz o build
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
#  Stage 2 – Serve com Nginx
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa config customizada
COPY nginx.conf /etc/nginx/conf.d/teamhub.conf

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 2630

CMD ["nginx", "-g", "daemon off;"]
