FROM node:18.16.1 AS development

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json /app

RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:1.19.0

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=development /app/dist ./
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
