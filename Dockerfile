# Stage 1:
FROM node:22-alpine AS builder

WORKDIR /app


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8082

ENV DATABASE_URL=mysql://root:root@localhost:3306/bongo
ENV JWT_SECRET=ouiouilesecret

CMD ["npm", "run", "start"]
