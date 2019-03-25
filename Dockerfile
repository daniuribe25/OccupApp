FROM node:11

RUN mkdir -p /usr/src/app
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD [ "npm", "start" ]