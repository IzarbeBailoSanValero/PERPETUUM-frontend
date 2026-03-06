#hago multistage para no tener que compilar antes cada vez que cambio codigo
FROM node:20-alpine AS compilador
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:stable-alpine AS servidor
COPY --from=compilador /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]