#!/bin/sh
# Pega o PORT injetado pelo Railway (fallback 8080)
PORTA="${PORT:-8080}"
echo "Iniciando nginx na porta $PORTA"

# Substitui a string literal '$PORT' no config
sed -i "s/\$PORT/$PORTA/g" /etc/nginx/conf.d/teamhub.conf

# Confirma o resultado (aparece nos logs do Railway)
grep "listen" /etc/nginx/conf.d/teamhub.conf

nginx -g "daemon off;"