---
title: "Mastodon | 大扫除，移除本地缓存的其它实例媒体附件"
date: 2022-01-05T19:14:32+08:00
lastmod: 2022-01-05T19:14:32+08:00
description: 换了最新免责说明，大扫除令人心情愉快
tags:
  - Mastodon
categories:
  - 甘普基本变形定律
image: 
slug: mastodon-Media-file-cleanup
---

{{< quote >}}

{{< emoji name="artist"  ext="png" width="35" >}} 本文作者没有任何代码基础，所有说明性文字主要靠连蒙带猜兼灵光一现，参考时请务必注意，欢迎提出意见和给出建议~

{{< /quote >}}

西风推荐了Servercat app来查看服务器状态，我深夜下载，快乐打开，然后：![](https://res.cloudinary.com/mantyke/image/upload/v1641382508/20220105%E9%95%BF%E6%AF%9B%E8%B1%A1%E5%AA%92%E4%BD%93%E6%B8%85%E7%90%86/save-1_vk7kif.jpg)

看我这个200G的超大硬盘……等等，我这个200G的硬盘怎么就只剩下57G了？？？

我的服务器上一共只跑了三样东西：Mastodon，Miniflux，Wordpress，犯罪嫌疑人非常容易确认，只会是Mastodon的媒体文件，话又说回来，我之前做长毛象数据备份的时候忘记写笔记了，我设定定时清理外站媒体文件了吗？

……写笔记真的是一件很重要的事情。

<br>

## 缩了，但没完全缩

废话不表，来讲结果，首先根据[Mastodon文档](https://docs.joinmastodon.org/zh-cn/admin/tootctl/)我们可以发现，Masodon给出了媒体相关命令`tootctl media usage`，可以计算被Mastodon消耗的硬盘空间，但，`tootctl`命令是不能直接运行的，如果使用源代码建站，需要在命令中指定环境，如`RAILS_ENV=production bin/tootctl help`，而如果用docker建站，则需要在命令前指定运行的容器名称。每次都输入这么一长串命令实在非常麻烦，于是根据[Mastodon | 采用docker建站后的使用与维护](https://blog.tantalum.life/posts/how-to-run-your-mastodon-by-docker/)，我们写入一个脚本文件，这样就可以对命令进行简化，将`docker-compose run --rm web bin/tootctl help`简化为`tootctl help`

```
cd /opt/mastodon   #跳转至目标文件夹
nano tootctl.sh   #将以下内容写入/opt/mastodon中并命名为tootctl.sh
```

```
#!/bin/bash
lpwd=$PWD
mypath=`dirname $0`
cd $mypath
if [ $# -ge 1 ]
then
	case $1 in 
		"restart")
			docker-compose restart
		;;
		"reload")
			docker-compose down && docker-compose up -d
		;;
		"stop")
			docker-compose down
		;;
		"start")
			docker-compose up -d
		;;
		"psql")
			docker-compose exec db $*
		;;
		*)
			docker-compose run --rm web bin/tootctl $*
		;;
	esac
else
	echo "please use tootctl help for help"
fi
cd $lpwd
```

保存后，执行：

```
chmod +x /opt/mastodon/tootctl.sh
echo "alias tootctl='/opt/mastodon/tootctl.sh' " >> ~/.bashrc 
source ~/.bashrc
```

以上内容照抄Roelxy的笔记，但在实际输入命令后，我获得了这样一个结果：

```
root@vmi729048:/opt/mastodon# tootctl help
ERROR: No such service: web
```

阅读[Docker命令教程](https://www.runoob.com/docker/docker-run-command.html)，一个完整的在Docker内运行tootctl的命令为`docker-compose run --rm web bin/tootctl help`，其中，`docker-compose run`，意味着在创建一个新的容器并运行一个命令，加上`--rm`参数，意味着容器退出时自动清理容器内部的文件数据，根据文档，Mastodon的命令行界面是一个位于Mastodon根目录内`bin`目录中的名为`tootctl`的可执行文件，因此，完整的命令，意味着用docker-compose创建一个名为web的容器，并运行bin目录中的tootctl文件，在容器退出时清理干净内部数据。

而刚刚的报错为：`ERROR: No such service: web`

运行`docker ps`来列出容器，很容易就能发现一个叫做**mastodon_mastodon-web_1**的容器，于是试着修改命令为`docker-compose run --rm mastodon-web bin/tootctl help`

```
root:/opt/mastodon# docker-compose run --rm mastodon-web bin/tootctl help
Creating mastodon_mastodon-web_run ... done
/opt/ruby/lib/ruby/2.7.0/net/protocol.rb:66: warning: already initialized constant Net::ProtocRetryError
/opt/mastodon/vendor/bundle/ruby/2.7.0/gems/net-protocol-0.1.0/lib/net/protocol.rb:66: warning: previous definition of ProtocRetryError was here
/opt/ruby/lib/ruby/2.7.0/net/protocol.rb:206: warning: already initialized constant Net::BufferedIO::BUFSIZE
/opt/mastodon/vendor/bundle/ruby/2.7.0/gems/net-protocol-0.1.0/lib/net/protocol.rb:206: warning: previous definition of BUFSIZE was here
/opt/ruby/lib/ruby/2.7.0/net/protocol.rb:503: warning: already initialized constant Net::NetPrivate::Socket
/opt/mastodon/vendor/bundle/ruby/2.7.0/gems/net-protocol-0.1.0/lib/net/protocol.rb:503: warning: previous definition of Socket was here
Commands:
  tootctl accounts SUBCOMMAND ...ARGS             # Manage accounts
  tootctl cache SUBCOMMAND ...ARGS                # Manage cache
  tootctl domains SUBCOMMAND ...ARGS              # Manage account domains
  tootctl email_domain_blocks SUBCOMMAND ...ARGS  # Manage e-mail domain blocks
  tootctl emoji SUBCOMMAND ...ARGS                # Manage custom emoji
  tootctl feeds SUBCOMMAND ...ARGS                # Manage feeds
  tootctl help [COMMAND]                          # Describe available commands or one specific command
  tootctl ip_blocks SUBCOMMAND ...ARGS            # Manage IP blocks
  tootctl maintenance SUBCOMMAND ...ARGS          # Various maintenance utilities
  tootctl media SUBCOMMAND ...ARGS                # Manage media files
  tootctl preview_cards SUBCOMMAND ...ARGS        # Manage preview cards
  tootctl search SUBCOMMAND ...ARGS               # Manage the search engine
  tootctl self-destruct                           # Erase the server from the federation
  tootctl settings SUBCOMMAND ...ARGS             # Manage dynamic settings
  tootctl statuses SUBCOMMAND ...ARGS             # Manage statuses
  tootctl upgrade SUBCOMMAND ...ARGS              # Various version upgrade utilities
  tootctl version                                 # Show version
```

好耶！确实如此！

查看脚本，与之有关的，是`docker-compose run --rm web bin/tootctl $*`，将`web`修改为`mastodon-web`，缩写命令就能成功运行了。

以及Roelxy说上面这一长串警告是docker容器的问题，好像修复不了，不用管它。

<br>

## 抄了，但没完全抄

查了和Roelxy的聊天记录试图解开我的定时清理媒体文件之谜，发现根据聊天记录，我确实设定了定时任务……于是清理站点文件前，先研究明白定时任务到底有没有跑通：

根据[Mastodon | 采用docker建站后的使用与维护](https://blog.tantalum.life/posts/how-to-run-your-mastodon-by-docker/)中定期清理外站媒体文件一节，让服务器定时删除，需要先设定一个定时任务：

```
crontab -e   #编辑定时任务
```

选择1后，再将以下内容填入文件并保存：

```
0 3 * * * /opt/mastodon/tootctl.sh media remove --days=14 #清理缓存 14 天以上的外站媒体文件
0 3 * * * /opt/mastodon/tootctl.sh media remove-orphans #清理“无主”媒体文件
0 3 * * * /opt/mastodon/tootctl.sh statuses remove --days=90 #清理同本站任何用户产生关联的 90 天以上的 toot
```

……定时了，但没完全定时，确实设定了定时任务，但因为之前偷懒没有创建tootctl.sh脚本，当然也没修改脚本里的容器名称，这个定时任务根本就跑不起来嘛！

<br>

## 大扫除，好耶！

问题解决，开始大扫除：

```
tootctl media usage #计算被Mastodon消耗的硬盘空间。
Attachments:  92.7 GB (18.9 MB local)
Custom emoji: 209 MB (1.1 MB local)Preview cards: 999 MB
Avatars:      1.44 GB (88.4 KB local)
Headers:      3.39 GB (0 Bytes local)
Backups:      0 Bytes
Imports:      0 Bytes
settings:     0 Bytes
```

```
tootctl media remove #移除本地缓存的其它实例媒体附件。
Progress: |====================================================================|
Removed 115981 media attachments (approx. 73.6 GB)
```

```
tootctl media remove-orphans #扫描出不属于任何媒体附件的文件并移除他们，此操作需要遍历每个文件，因此速度很慢
这个遍历完了什么也没有返回，大概是还没有这样的文件吧。
```

![](https://res.cloudinary.com/mantyke/image/upload/v1641385462/20220105%E9%95%BF%E6%AF%9B%E8%B1%A1%E5%AA%92%E4%BD%93%E6%B8%85%E7%90%86/save-2_b0qntn.jpg)

好耶！！大扫除真的很快乐！！

<br>
