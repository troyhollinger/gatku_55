```
$ docker pull ubuntu:18.04
$ docker run --rm -it --name ubuntu_18.04 ubuntu:18.04
```

## Bild image
```
$ cd ~/code/gatku/gatku_55/docker/ubuntu_18.04
$ docker build --tag marcincyniu/ubuntu_18.04:20190725 .

$ docker run --rm -it --name ubuntu_18.04 marcincyniu/ubuntu_18.04:20190725

$ docker run -d --name ubuntu_18.04 marcincyniu/ubuntu_18.04:20190725
```

## push docker image
```
$ docker login
$ docker push marcincyniu/ubuntu_18.04:20190725
```