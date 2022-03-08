---
title: "搭完了就想跑 | Calibre-Web搭建记录"
date: 2022-02-12T20:48:09+08:00
description: 一份冷酷无情的踩坑笔记
tags:
  - 
categories:
  - 甘普基本变形定律
image: 
slug: calibre-web
---

学到的新命令：

```
docker image prune --force --all或者docker image prune -f -a: 删除所有不使用的镜像
docker container prune -f: 删除所有停止的容器
```

<br>

## 安装过程 

使用LinuxServer.io团队提供的[镜像](https://hub.docker.com/r/linuxserver/calibre-web)

```
mkdir calibre-web #创建calibre-web文件夹
cd calibre-web #进入calibre-web文件夹
```

```
nano docker-compose.yml #编辑配置文件，并写入以下内容
```

```
---
version: "2.1"
services:
  calibre-web:
    image: lscr.io/linuxserver/calibre-web #使用LinuxServer.io团队提供的镜像
    container_name: calibre-web #容器名字为calibre-web
    environment:
      - PUID=1000 #用户的 UID
      - PGID=1000 #用户的 GID
      - TZ=Asia/Shanghai #修改时区为东八区
      - DOCKER_MODS=linuxserver/calibre-web:calibre #optional
      - OAUTHLIB_RELAX_TOKEN_SCOPE=1 #optional
    volumes:
      - ~/calibre-web/data:/config
      - ~/calibre-web/library:/books
      
    ports:
      - 8083:8083 #端口
    restart: unless-stopped
```

```
docker-compose up -d #容器上线，开始加载镜像
```

输入`IP:8083`即可访问并进行初始配置，默认用户账号为 `admin `，密码为 `admin123`

<br>

## 报错及处理

### 初始化配置Database报错

设置Database为/books时报错

```
mkdir library #创建library文件夹
cd library #进入library文件夹
mkdir books #创建books文件夹
cd books #进入books文件夹
#下载一份空白的metadata文件，也可以用Calibre自己创建一份出来
wget "https://cloud.volkantasci.com/index.php/s/YaKZdrneBwz3dME/download/metadata.zip" 
mv metadata.zip database.zip
unzip database.zip
```

这里踩到的坑是没正确理解docker挂载的文件夹地址，需要在配置文件里把volume改成正确的

<br>

### 上传书籍报错数据库错误

```
数据库错误：(sqlite3.OperationalError) attempt to write a readonly database [SQL: INSERT INTO authors (name, sort, link) VALUES (?, ?, ?)] [parameters: ('SoBooKs.cc 戴建业', '戴建业, SoBooKs.cc', '')] (Background on this error at: https://sqlalche.me/e/14/e3q8)。
```

解决方案：

```
chmod -R 777 library #赋权给library文件夹，777是读/写/执行，-R是指当前目录下所有文件都给予777权限
```

<br>

### 上传书籍报错413

```
nano /etc/nginx/nginx.conf
client_max_body_size 5M; #修改这一项到你觉得合适的大小
```

另一个我也跑通了的办法，直接用docker装，用的是technosoft2000/calibre-web镜像（已经停止维护）

```
docker create --name=calibre-web --restart=always -v /usr/local/calibre-web/books:/books -v /usr/local/calibre-web/app:/calibre-web/app -v /usr/local/calibre-web/kindlegen:/calibre-web/kindlegen -v /usr/local/calibre-web/config:/calibre-web/config -e USE_CONFIG_DIR=true -e SET_CONTAINER_TIMEZONE=true -e CONTAINER_TIMEZONE=Asia/Shanghai -e PGID=0 -e PUID=0 -p 8083:8083 technosoft2000/calibre-web
```

<br>

## 配置反代

```
nano /etc/nginx/conf.d/calibre-web.conf
```

```
server {
    listen 80;
    server_name ;

    location / {
        proxy_pass http://127.0.0.1:8083;    
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

<br>

## 随便絮叨一下

搭完了就发现根本不喜欢！为什么阅读器不可以配置版式字体和底色啊！！

<br>
