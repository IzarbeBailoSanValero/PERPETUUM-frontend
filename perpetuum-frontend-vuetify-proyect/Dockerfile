#uso multistage poruqe así si cambio el codigo no tengo que volver a compilarlo manualmente si cambio cosas
# compilación node
FROM node:18-alpine AS compilador
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# servidor nginex
FROM nginx:stable-alpine AS servidor
COPY --from=compilador /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]