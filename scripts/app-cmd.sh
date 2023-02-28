#!/bin/sh

# required for react app router
sed -i "s/location \/ {/location \/ {\n\ttry_files \$uri \$uri\/ \/index.html;/g" /etc/nginx/conf.d/default.conf
# Setup nginx port to 8080 - default cloud run
sed -i "s/80/${PORT}/g" /etc/nginx/conf.d/default.conf

env | grep REACT > .env
./env-config-maker.sh /usr/share/nginx/html/env-config.js
nginx -g 'daemon off;'