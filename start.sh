#!/bin/sh
set -e

echo "Render PORT=${PORT}"

envsubst '${PORT}' \
    < /etc/nginx/templates/default.conf.template \
    > /etc/nginx/conf.d/default.conf

echo "Generated Nginx configuration:"
cat /etc/nginx/conf.d/default.conf

exec supervisord -c /etc/supervisord.conf