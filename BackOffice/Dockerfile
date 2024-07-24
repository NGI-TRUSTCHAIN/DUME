FROM node:latest

WORKDIR /frontend

COPY ./web-development/package*.json ./

RUN npm install

COPY ./web-development .

#RUN rm ./.env.local

#COPY .next .next

EXPOSE 3000

CMD npx prisma generate && npx prisma db push && npm run dev

