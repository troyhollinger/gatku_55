# CREATE DOCKER CONTAINERS

## Create network if not exists
```
$ docker network create --driver=bridge \
    --ip-range 172.18.0.0/16 \
    --subnet 172.18.0.0/16 dev-net
```

## MySQL First Run

### Create database volume
```
$ docker volume create develop-mysql-5.7.25
```

### Database first run to set up

```
$ docker run --env MYSQL_ROOT_HOST=% \
--env MYSQL_DATABASE=forge \
--env MYSQL_USER=developer \
--env MYSQL_PASSWORD=developer \
--env MYSQL_ROOT_PASSWORD=developer \
--mount type=volume,source=develop-mysql-5.7.25,target=/var/lib/mysql \
--name develop-mysql \
-d mysql:5.7.25
```

### Daily Use Run
```
$ docker  run --rm  --tty --interactive \
--name mysql-5.7.25 \
--mount type=volume,source=develop-mysql-5.7.25,target=/var/lib/mysql \
--net dev-net \
--ip 172.18.0.20 \
mysql:5.7.25
``` 

### Import data to MySQL
- After run Daily Use Run please upload data to database if necessary:
```
$ mysql -hmysql-5.7.25 -udeveloper -pdeveloper --ssl-mode=DISABLED forge < {path and file name} 
```

## GATKU docker container

### Build Image - check proper instruction in sub-folder

### Daily Use Run
```
$ docker  run --rm  --tty --interactive \
--name gatku \
--volume ~/code/gatku/gatku_55:/gatku \
--net dev-net \
--ip 172.18.0.10 \
marcincyniu/ubuntu_18.04:20190725
``` 

### Docker Compose Start
- go to directory, in this project case: ~/code/gatku/gatku55/docker and run command:
```
$ docker-compose up
```


Run Gulp to compile front end code:
===================================

$ cd ./gatku_55/public

# to watch:

$ ./node_modules/.bin/gulp watch

# to build all:

$ ./node_modules/.bin/gulp all
