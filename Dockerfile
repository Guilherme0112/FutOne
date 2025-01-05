# Use uma imagem base para Node.js
FROM node:18

# Crie um diretório para a aplicação
WORKDIR /app

# Copie os arquivos do package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta que o app irá usar (exemplo: 3000)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
