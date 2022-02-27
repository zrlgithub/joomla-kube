FROM node:16.12.0

WORKDIR /home/student/chat
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]