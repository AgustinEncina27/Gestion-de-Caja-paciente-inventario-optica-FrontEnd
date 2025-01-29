# Etapa de construcción
FROM node:16-alpine AS build
WORKDIR /app

# Copiar el código fuente y las dependencias
COPY . .
RUN npm install
RUN npm run build

# Etapa de producción
FROM nginx:alpine
COPY --from=build /app/dist/optica-app /usr/share/nginx/html

# Exponer el puerto estándar 80 (HTTP)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
