#!/bin/sh
sed -i "s/\$PORT/${PORT:-80}/g" /etc/nginx/conf.d/teamhub.conf
nginx -g "daemon off;"