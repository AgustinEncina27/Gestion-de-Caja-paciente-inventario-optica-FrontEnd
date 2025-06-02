# Etapa de producción
FROM nginx:alpine

# Copia el frontend ya construido
COPY ./dist/optica-app /usr/share/nginx/html

# Exponer el puerto estándar 80 (HTTP)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
