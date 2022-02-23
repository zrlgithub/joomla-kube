FROM node:16.11.1

WORKDIR /home/student/chat
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]