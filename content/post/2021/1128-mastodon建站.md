---
title: "Mastodon | 小球飞象建站笔记"
date: 2021-11-28T13:36:00+08:00
lastmod: 2021-11-28T13:36:00+08:00
description: 人生四大名言警句：喜欢就买、不行就分、多喝热水、重启试试
tags:
  - Mastodon
categories:
  - 甘普基本变形定律
image: 
slug: Mastodon-bulid
---

{{< quote >}}

{{< emoji name="artist"  ext="png" width="35" >}} 本文作者没有任何代码基础，所有说明性文字主要靠连蒙带猜兼灵光一现，参考时请务必注意，欢迎提出意见和给出建议~

{{< /quote >}}

踩在2021年的尾巴上也当了站长，在魔改前总之先记一下建站过程。

<br>

## 参考教程和鸣谢

小球飞象的搭建总体以[Docker快速部署Mastodon](https://lala.im/7634.html)教程为基础，参考[pullopen](https://pullopen.github.io/%E5%9F%BA%E7%A1%80%E6%90%AD%E5%BB%BA/2020/10/19/Mastodon-on-Docker.html)的部分配置，象友[Roelxy](https://blog.tantalum.life/about/)和[纯之](https://moe.tips/)手把手教学，前后大约花费16小时，重装VPS 3次。

两位象友都是搭博客过程中认识的，都给予了非常重要的帮助，非常感谢！

<br>

## 搭建过程

### 购买VPS

之前看建站教程，大部分推荐Vultr，但被象友告知，Vultr的5刀套餐不怎么好用，只有1G的内存和25G的SSD，内存太小需要开虚拟内存，硬盘太小也很容易装满，再升级就是每月10刀，又有点贵。不如换Contabo的7刀套餐，8G内存、200G SSD和1个快照，建完站还能搭点别的服务。

于是等到黑五，购买前先把价格修改成欧元，黑五期间免设置费，一次购买12个月免1个月，同时美国机房免附加费用。最后买了4.99欧/月的套餐，机房选了西雅图，后面的全部默认，用Visa付款，最终费用为54.88欧/年，大概是400人民币？

Contabo人工审核比较严格，一旦审核不通过则需要真实身份信息，所以要以真实IP购买，同时填写身份地址信息时不要太扯（。

我自己的审核非常快，付款后不到10分钟就发来了VPS信息邮件，这封邮件里有Contabo账号和VPS IP、密码等信息，收到后最好保存起来。

<br>

### Termius

Termius是个终端，可以远程连接服务器，多平台通用，挺好看。

下载后先换个快捷键，Termius默认复制粘贴快捷键是`Ctrl`+`Shift`+`C`/`Ctrl`+`Shift`+`V`，为了方便起见改成熟悉的`Ctrl`+`C`和`Ctrl`+`V`。然后点New host，在adress部分输入Cantabo提供的IP address，双击新增的host，输入账号密码。

注：西风提醒我说终端不用`Ctrl`+`C`作复制的快捷键，是因为在终端中，`Ctrl`+`C`的作用是“中断当前进程”，后面也用到了它中断当前进程的功能，我临时把快捷键改了回来。

<br>

### 开始搭建

从买VPS到搭站成功一共16小时，不清楚是不是Pullopen站的教程过期，总之二八法则诚不欺我，差不多13小时都在踩坑，很多坑最后我也没弄明白怎么回事，非常稀里糊涂，能跑起来真是谢天谢地谢Roelxy耳提面命一步一步教命令和确认结果，谢纯之教会我遇事不决重装VPS，谢我自己周天早上一拍脑门换参考教程。

这里只记一下大概的步骤流程，本来打算把所有命令的反馈和检查也记一下的，但我不小心把终端整个儿关了查不到历史记录，非常遗憾。

域名我之前就有，更换名称服务器为Cloudfare的名称服务器，在Cloudfare激活站点，之后新添子域名，A记录指向VPS IP，将代理状态改为仅限DNS。

邮件用了Zoho的邮箱服务，但没有配置好，暂时先搁置了。

---



首先在Contabo控制面板重装VPS（之前没搞定，有残留且删不掉的数据库，干脆重装），重装时系统换成Debian10（之前用Ubuntu20.04也总报错，不确定是不是Ubuntu的问题，但据纯之说他用Debian10没问题，玄学一下）

之后按[Docker快速部署Mastodon](https://lala.im/7634.html)的教程来，补充了一些操作时看的内容，仅供参考：

安装需要用到的软件包：[Curl 的用法指南](https://www.ruanyifeng.com/blog/2019/09/curl-reference.html)

```
apt -y update
apt -y install curl git nginx python-certbot-nginx
```

安装Docker：[Systemd 入门教程：命令篇](https://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)

```
curl -sSL https://get.docker.com/ | sh
systemctl enable --now nginx docker
```

安装Docker-compose：[Linux chmod命令](https://www.runoob.com/linux/linux-comm-chmod.html)

```
curl -L https://github.com/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

之后检查一下是不是装好了：

```
docker -v //检查Docker版本
Docker version 20.10.11, build dea9396 //返回内容
docker-compose --version //检查Docker-compose
docker-compose version 1.27.4, build 40524192 //返回内容
```

按Lalaim的教程，长毛象配置文件夹（也就是yml所在的文件夹）是`/opt/mastodon`，所以之后拉取文件在opt目录下进行，拉取后定位到`/opt/mastodon`再操作其他的。

```
cd /opt
git clone https://github.com/tootsuite/mastodon.git
cd mastodon/
```

复制配置文件，再重命名原来自带的配置文件：[Linux cp 命令](https://www.runoob.com/linux/linux-comm-cp.html)、[Linux mv 命令](https://www.runoob.com/linux/linux-comm-mv.html)

```
cp .env.production.sample .env.production
mv docker-compose.yml docker-compose.yml.bak
```

编辑`docker-compose.yml`

```
nano docker-compose.yml
```

之后开始修改配置，这里要参考[Pullopen的教程](https://pullopen.github.io/%E5%9F%BA%E7%A1%80%E6%90%AD%E5%BB%BA/2020/10/19/Mastodon-on-Docker.html)，把数据库版本之类的改一改：

```
version: '3.5'

services:
  mastodon-db:
    image: postgres:9.6-alpine //这里把9.6换成12.5
    shm_size: 256mb
    environment:
      POSTGRES_DB: mastodon //注意名称为mastodon
      POSTGRES_USER: 设置为你想要的数据库用户名
      POSTGRES_PASSWORD: password //数据库密码
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped

  mastodon-redis:
    image: redis:6.0-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
    volumes:
      - ./redis:/data
    restart: unless-stopped

  mastodon-web:
    image: tootsuite/mastodon //改为image: tootsuite/mastodon:latest
    env_file: .env.production
    command: bash -c "rm -f /mastodon/tmp/pids/server.pid; bundle exec rails s -p 3000"
    depends_on:
      - mastodon-db
      - mastodon-redis
    healthcheck:
      test: ["CMD-SHELL", "wget -q --spider --proxy=off localhost:3000/health || exit 1"]
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - ./public/system:/mastodon/public/system
    restart: unless-stopped

  mastodon-streaming:
    image: tootsuite/mastodon //改为image: tootsuite/mastodon:latest
    env_file: .env.production
    command: node ./streaming
    depends_on:
      - mastodon-db
      - mastodon-redis
    healthcheck:
      test: ["CMD-SHELL", "wget -q --spider --proxy=off localhost:4000/api/v1/streaming/health || exit 1"]
    ports:
      - "127.0.0.1:4000:4000"
    restart: unless-stopped

  mastodon-sidekiq:
    image: tootsuite/mastodon //改为image: tootsuite/mastodon:latest
    env_file: .env.production
    command: bundle exec sidekiq
    depends_on:
      - mastodon-db
      - mastodon-redis
    volumes:
      - ./public/system:/mastodon/public/system
    restart: unless-stopped
```

然后开始配置Mastodon，运行：

```
docker-compose run --rm mastodon-web bundle exec rake mastodon:setup
```

出现Domain name时，依次输入以下配置

```
Domain name: # Mastodon域名
Do you want to enable single user mode? # Yes //这里也可以用no，单人模式下不开放注册页面，访问域名会直接跳转到你的Mastodon主页
Are you using Docker to run Mastodon? # Yes
PostgreSQL host: # mastodon-db //注意名称
PostgreSQL port: # 5432 //默认端口，直接回车就行
Name of PostgreSQL database: # mastodon //注意名称
Name of PostgreSQL user: 刚刚填的数据库用户名
Password of PostgreSQL user: # 刚刚写的数据库密码，填写时不显示填写内容，盲敲后回车就行，出错/成功时都有很明显的提示
Redis host: # mastodon-redis //注意名称
Redis port: # 6379 //默认端口，直接回车
Redis password: # 留空，直接回车
Do you want to store uploaded files on the cloud? # No //这里是问文件要不要上云，Contabo有200G SSD，我就不上了
Do you want to send e-mails from localhost? # Yes //是不是从主机发邮件，这里我也没配置明白，考虑到短期不打算开放注册，就先不用邮件服务了
Send a test e-mail with this configuration right now? # No //问是不是要发测试邮件，No掉它
Save configuration? Yes //是否保存
```

Yes后会立刻返回一大段内容，格式和上面这段代码块差不多，立刻保存下来，之后要用。

看到这段提示后退出来，教程说`Ctrl`+`C`退出，但之前我把`Ctrl`+`C`改成了复制键，这里改回来也很简单，Termius有不同的快捷键文件，暂时改回原来的文件就好。

```
Prepare the database now? (Y/n)
```

之后清空默认配置，并编辑配置文件，把刚刚保存的配置内容复制进去：[如何使用echo指令向文件写入内容](https://blog.csdn.net/xukai871105/article/details/35834703)

```
echo > .env.production
nano .env.production
```

再重新运行一次配置向导，确保配置和上面保持一致

```
docker-compose run --rm mastodon-web bundle exec rake mastodon:setup
```

```
Prepare the database now? (Y/n) # Yes
Compile the assets now? (Y/n) # Yes
Do you want to create an admin user straight away? Yes //创建管理员账号，这一步会为你创建一个Mastodon账号
Username:Mastodon账号名
E-mail: 填个常用邮箱吧
You can login with the password:这部分是Mastodon密码，记得保存
You can change your password once you login.
```

开启容器内服务，把public的目录所有者改为容器内的

```
docker-compose up -d
chown -R 991:991 public
```

复制nginx的站点配置文件并编辑

```
cp /opt/mastodon/dist/nginx.conf /etc/nginx/conf.d/mastodon.conf
nano /etc/nginx/conf.d/mastodon.conf
```

改动配置文件内容如下：

```
……

server {
    if ($host = toot.mantyke.icu) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


  listen 80;
  listen [::]:80;
  server_name Mastodon域名; 
  root /opt/mastodon/public; //改为public目录的绝对路径
  location /.well-known/acme-challenge/ { allow all; }
  location / { return 301 https://$host$request_uri; }


}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name Mastodon域名;
  
  ……

  root /opt/mastodon/public; //改为public目录的绝对路径
  
  ……
```

最后签发SSL证书，有一些需要选择的部分看情况选就行了

```
certbot --nginx
```

稍等一会儿，刷新Mastodon域名，就看到站点上线了，Hello World！

<br>

### 遇到的坑

这里大概写一下遇到的坑……遇到挺多坑的，大部分也没搞清楚，总之于遇事不决上VPS控制面板重装机器，人是光脚不愁嘛。

一开始走到最后一步发现域名只能显示Nginx页面，可能是数据库出错。想把数据库删掉，但用了各种方法都还残留了一部分。只能重装机子后再搞，但证书又装不上，装上了又有个什么服务在不断重启启动失败，伴随着全过程的zoho邮箱配置失败，总之焦头烂额。

常用重启功能：

```
docker-compose down
docker-compose up -d
```

猜测Zoho配置失败是因为SMTP server用了欧洲版的地址（smtp.zoho.eu），改成国际版（smtp.zoho.com）可能就可以了，暂时不考虑开放注册，因此再说再说。

通过[管理命令行](https://docs.joinmastodon.org/zh-cn/admin/tootctl/)也可以增加账号，不打算增加太多用户的话，好像也没必要一定配置邮件功能。

<br>

## 后续魔改

参考教程：[Mastodon | 采用docker建站后的使用与维护](https://blog.tantalum.life/posts/how-to-run-your-mastodon-by-docker/#%E5%9F%BA%E7%A1%80%E8%BF%90%E7%BB%B4)，提到了后续升级的办法、使用alias脚本缩写tootctl命令、部署媒体文件外部存储服务和定期清理外站媒体文件。

[Pullopen的搭建教程](https://pullopen.github.io/%E5%9F%BA%E7%A1%80%E6%90%AD%E5%BB%BA/2020/10/19/Mastodon-on-Docker.html)还提到了开启全文搜索、修改配置文件、使用管理命令行、备份数据库的方法

[利用Docker进行魔改](https://pullopen.github.io/%E8%BF%9B%E9%98%B6%E9%AD%94%E6%94%B9/2020/11/01/Mastodon-on-Docker-2.html)，[进阶魔改](https://pullopen.github.io/%E8%BF%9B%E9%98%B6%E9%AD%94%E6%94%B9/2020/11/14/mastodon-modify.html)：修改字数上限、媒体上限、投票上限、添加自定义主题、界面用语、非登陆用户有限显示，附阻止本站嘟文流入某站点方法。

[站点CSS修改](https://pullopen.github.io/%E7%AB%99%E7%82%B9%E7%BB%B4%E6%8A%A4/2020/11/26/mastodon-manage.html)：长图补丁、高级Web铺满页面、Tag高亮显示、放大Emoji、加上猫耳头像、自定义站点表情。

[修改站点图标](https://github.com/mastodon/mastodon/issues/7396)，但这个好像是根据托管服务进行的，暂时先放在这里。

进度：在Contabo建立了无魔改的镜像，预计下周开始对站点进行修改。

<br>

## 一点感想

这一段写来写去都觉得怪矫情的，既不像我的画风，也实在写不下去，干脆都删了。其实就是挺感慨，想起我的第一个Mastodon账号建立于2017年，那时候Pwaoo.net实例在微博上被热转，我向来是好奇心重，就去注册了一个——注册完后迅速抛开，毕竟当时谁能从微博搬家呢？我需要微博的这个，也需要微博的那个，热闹、新鲜、讨论和观点。

2018年去了草莓县，草莓县关闭后又搬到新草莓县，几次搬家潮后中文Mastodon忽然兴盛起来，我逛来荡去，在各个实例切了分身，视心情做过主站，认识又告别了许多人，一转眼已经是2021年，Mastodon已经成了我的碎碎念重地，也围绕它建立了新的网络社交关系。世事有趣，2017年时不能想象几年后天地逼仄至此，当然也无从想象彼时一点蓬勃好奇，到如今竟然应在这里。

又觉得真是有意思，我恨极了审查，但如果外部互联网没有糟烂至此，我当然也不会于此时此地此刻来写建站日志，这几年内外交煎，安全感全丧，反而迫得我从搭积木开始为自己建筑小天地，最终竟然有所收获。搭站过程中看Roelxy的Blog，看到她写“三个月从:wq到虚拟机再到购买主机开始建站，从谷歌如何用vm打开一个新的虚拟机到能用命令行基础运维一个网站，我也没想到有些事情我就是能”看得发愣，哎，我也想不到我竟然能。

<br>

