FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN chmod +x node_modules/.bin/next
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
