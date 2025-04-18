FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install express --save 

COPY . .

EXPOSE 6969

CMD ["node", "Server.js"]
