FROM node:latest

MAINTAINER BootShop


WORKDIR /var/www
COPY . /var/www

RUN touch /var/www/helper/config.js
RUN npm install

ENTRYPOINT ["npm", "start"]
