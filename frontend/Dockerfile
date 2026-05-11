# Estágio 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm install

# Copiar o resto do código e gerar o build de produção
COPY . .
RUN npm run build -- --configuration=production

# Estágio 2: Serve (Produção com Nginx)
FROM nginx:stable-alpine
# Copia o build do estágio anterior para a pasta do Nginx
# Nota: Verifique se o caminho 'dist/frontend/browser' está correto após o primeiro build
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiar configuração customizada do Nginx (opcional, mas recomendado)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]