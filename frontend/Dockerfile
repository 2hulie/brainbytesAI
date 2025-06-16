FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN chmod +x node_modules/.bin/next
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
ENV NEXT_PUBLIC_API_URL=http://backend:3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
