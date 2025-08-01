# Etapa 1: Imagem base oficial do Node.js (leve e estável)
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar dependências primeiro para otimizar cache
COPY package.json yarn.lock ./

# Instalar TODAS as dependências (inclusive dev) para evitar erro de módulos ausentes
RUN yarn install --production=false --frozen-lockfile

# Copiar o restante do código da aplicação
COPY . .

# Definir variáveis de ambiente padrão
ENV PORT=8001
ENV NODE_ENV=production

# Expor a porta usada pela aplicação
EXPOSE 8001

# Comando para iniciar a aplicação
CMD ["node", "index.js"]