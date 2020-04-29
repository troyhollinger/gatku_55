## Dockerfile - ubuntu
FROM ubuntu:18.04

# Install additional applications
RUN apt update 
RUN	apt install -y nginx mysql-client \
    php7.2-fpm php7.2-mysql php7.2-curl \
    php7.2-dom php7.2-gd php7.2-xdebug \
    php7.2-mbstring php7.2-json


# Make necessary folders
RUN mkdir -p /var/log/php-fpm/7.2 /run/php

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
