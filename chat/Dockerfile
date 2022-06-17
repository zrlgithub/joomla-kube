FROM node:16.15.1

WORKDIR /home/student/chat
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]