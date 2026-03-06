# Build stage
FROM node:20-alpine AS build
WORKDIR /todo-list
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 

# Production stage
FROM nginx:alpine
COPY --from=build  todo-list/dist/todo-list /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]