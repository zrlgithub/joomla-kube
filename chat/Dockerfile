FROM node:16.14.0

WORKDIR /home/student/chat
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]