# Stage 1:
FROM node:22-alpine AS builder

WORKDIR /app

COPY . .

RUN rm -rf node_modules/
RUN npm install
RUN npm install -g prisma

RUN prisma generate

EXPOSE 8082

# ENV DATABASE_URL=mysql://root:root@db:3306/bongo
# ENV JWT_SECRET=ouiouilesecret

CMD ["npm", "run", "start"]
