# ─────────────────────────────────────────────
#  Stage 1 – Build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
#  Stage 2 – Serve com Nginx
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove TUDO da pasta conf.d (evita o default.conf voltar)
RUN rm -rf /etc/nginx/conf.d/*

# Copia nossa config customizada
COPY nginx.conf /etc/nginx/conf.d/teamhub.conf

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 2630
CMD ["nginx", "-g", "daemon off;"]