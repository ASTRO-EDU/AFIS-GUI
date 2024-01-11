ARG USER_ID=1000

FROM php:8.2-apache

RUN docker-php-ext-install pdo_mysql && ln -s /tmp/ /var/www/html/tmp && apt-get update && apt-get install -y vim

ARG USER_ID
RUN usermod -u ${USER_ID} www-data
