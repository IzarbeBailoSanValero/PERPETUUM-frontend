#hago multistage para no tener que compilar antes cada vez que cambio codigo
FROM node:18-alpine AS compilador
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:stable-alpine AS servidor
COPY --from=compilador /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]