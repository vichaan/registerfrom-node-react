FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3001
CMD [ "node", "server.js" ]