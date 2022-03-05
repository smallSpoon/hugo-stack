---
title: "Mastodon | 建站后的运维、魔改、和其他也许需要的"
date: 2022-02-27T00:09:44+08:00
description: 汇总了一份站长们也许需要的建站后装修手册。
tags:
  - Mastodon
categories:
  - 甘普基本变形定律
image: 
slug: mastodon_mammota
---
{{< quote >}}

{{< emoji name="artist" ext="png" width="35" >}} 本文作者没有任何代码基础，所有说明性文字主要靠连蒙带猜兼灵光一现，参考时请务必注意，欢迎提出意见和给出建议~

{{< /quote >}}

2021年11月28日我搭建了自己的Mastodon个人站点，这篇文章汇总了站点相关的运维/魔改操作，并计划进行不断更新，希望能给后来者站长们提供一些便利。

一些基础说明：

1. 我的Mastodon站点以Docker搭建，运行在搭载Debian 10系统的VPS上，VPS购买于[Contabo](https://contabo.com/en/)，选择5欧元的基础套餐，搭建过程见[建站笔记](https://mantyke.icu/2021/mastodon-bulid/)。
2. 本文涉及的绝大部分内容均来源于Fedi内的朋友们手把手教学，本文仅作记录/汇总/补充，万分感谢！
3. 本文内容基于以Docker搭建的Mastodon站点写作。

<br>

## 使用tootctl命令

在根据教程进行改动（照抄）之前，首先学会使用`tootctl`命令。具体流程可参考：[使用alias脚本缩写tootctl命令](https://blog.tantalum.life/posts/how-to-run-your-mastodon-by-docker/#%E4%BD%BF%E7%94%A8alias%E8%84%9A%E6%9C%AC%E7%BC%A9%E5%86%99tootctl%E5%91%BD%E4%BB%A4)

教程写的已经很清楚明白，补充一点我操作过程中遇到的问题：

>1. 脚本中的`docker-compose run --rm web bin/tootctl`一行，需要根据自己的实际web容器名称来修改，运行`docker ps`查看正在运行的容器，寻找看起来最靠谱的一项替换即可。比如我的web容器名称为`mastodon_mastodon-web_1`，这一行我写作`docker-compose run --rm mastodon-web bin/tootctl`
>2. 运行`tootctl`后，可能会出现很长一段`warning`警告信息，其中包括类似`ruby`一类的关键词，不要惊慌，无视即可，这是Mastodon镜像自己的问题：使用了ruby2.7版本，升级为3.0版本之后就不会有这些报错了。一些站长的魔改镜像中进行了ruby的升级，不升级也可以。
>3. 可以尝试使用`tootctl help`命令来验证是否已经设置成功。

通过`tootctl`命令，我们可以在命令行上进行实例设置以及管理操作，Mastodon的命令行文档为[使用管理命令行](https://docs.joinmastodon.org/zh-cn/admin/tootctl/)

<br>

## 必修：备份、清理、升级

### 站点数据库/媒体文件备份

搭建站点后，做好数据库备份工作非常重要，防止因为误操作丢失站点数据。备份分为数据库备份/站点媒体备份两种，备份途径可以选择本地备份/云端备份。如何选择备份策略？在这里，我给出一点不成熟的参考：

**关于数据库大小**：我的站点日常活跃5人左右，截至文章发布时间，共运行3个月，全站嘟文约4K，每天备份一次数据库，保留七天以内的备份，目前总存储量1.31G，每天的存储大小约为190M，每天增长约3M。

**关于媒体文件大小**：在打开三个中继的前提下，我曾经约一个半月没有清理过站点媒体存储，当时的硬盘占用可以参考如下数据：

```
tootctl media usage #一个命令，用于计算被Mastodon消耗的硬盘空间。
Attachments:  92.7 GB (18.9 MB local) 
Custom emoji: 209 MB (1.1 MB local)
Preview cards: 999 MB
Avatars:      1.44 GB (88.4 KB local)
Headers:      3.39 GB (0 Bytes local)
Backups:      0 Bytes
Imports:      0 Bytes
settings:     0 Bytes
```

站点运行三个月并执行完相关清理命令后，我的站点硬盘占用为：
```
Attachments:    4.17 GB (116 MB local)
Custom emoji:   153 MB (4.58 MB local)
Preview cards:  938 MB
Avatars:        2.04 GB (980 KB local)
Headers:        4.73 GB (2.46 MB local)
Backups:        63.8 MB
Imports:        0 Bytes
Settings:       1.15 MB
```


云端备份选择很多，较为流行的选择是Scaleway，提供75G的免费储存空间，每月75G流量，超出部分按0.01刀/G/月计算。具体步骤可参考：

[如何将Mastodon媒体上传至Scaleway云储存](https://pullopen.github.io/%E7%AB%99%E7%82%B9%E7%BB%B4%E6%8A%A4/2020/07/22/Move-mastodon-media-to-Scaleway.html)     
[Mastodon 媒体存储和数据库备份](https://tech.konata.co/2022-02-20-mastodon-backup/)

顺便提一个卡了我一会的东西：教程中的`Create an OS Bucket`实际上就是点击`creat`后点击`Object Storage Bucket`，当时没反应过来……  
数据是留存在本地还是上云建议尽快决定，如果本地存储达到一定量，上云时迁移过程会很长，如果上云，由于Scaleway按照流量计费，记得定期上去看一眼，并做好相关的网络防护措施（一般来说，把Cloudfare的小橙云打开就可以起到一定的防护作用，其他的防护手段就需要自行学习了）

<br>

### 站点媒体清理
Mastodon的跨站轴机制决定了会有很多来自其他站的远程媒体文件，如果不执行清理，它们有可能会塞爆你的存储导致媒体功能受到影响，因此经常清理/设置一个定时清理也很重要。

一些经常会用到的清理相关`tootctl`命令，介绍来自官方：

>`tootctl media usage` ：计算被Mastodon消耗的硬盘空间。  
>`tootctl cache clear` ：清除缓存存储。  
>`tootctl media remove` ：移除本地缓存的其它实例媒体附件。  
>`tootctl media remove-orphans` ：扫描出不属于任何媒体附件的文件并移除他们。请注意，某些存储提供商会对列出对象所必需的API收取费用。另外，此操作需要遍历每个文件，因此速度很慢。  
>`tootctl statuses remove` ：从数据库中删除未被引用的嘟文，例如来自中继的或来自本地用户不再关注的用户的嘟文，同时没有被回复的或以其他方式与之互动的。这是一个计算量很大的操作，其会开始之前创建额外的数据库索引，并在结束后删除它们。默认清除90天之前的嘟文，也可以通过--days来进行指定，例如tootctl statuses remove --days30

也可以设置一个定时清理文件从而解放双手，此处可以参考[定期清理外站媒体文件](https://blog.tantalum.life/posts/how-to-run-your-mastodon-by-docker/#%E5%AE%9A%E6%9C%9F%E6%B8%85%E7%90%86%E5%A4%96%E7%AB%99%E5%AA%92%E4%BD%93%E6%96%87%E4%BB%B6)

<br>

### 站点版本和升级
Mastodon版本仍在不断更新中，可以通过他们的[Gtihub仓库](https://github.com/mastodon/mastodon)来查看版本更新说明。

如果你的站点完全使用[官方镜像](https://hub.docker.com/r/tootsuite/mastodon)，那么升级非常简单，只需要执行以下几个命令：

```
docker pull tootsuite/mastodon:latest #下载最新镜像
docker-compose down #下线镜像
docker-compose up -d #重新启动镜像
```

如果使用了其他站长修改的镜像，确认站长更新过镜像之后，修改上面步骤中的`tootsuite/mastodon:latest`为你使用的镜像，其他步骤一致
如果自己魔改了站点，合并过Github仓库后，将`tootsuite/mastodon:latest`修改为魔改后的自己的镜像，其他步骤一致。

<br>

## 选修：添加站点功能
注意：以下功能均非必须，可以根据自己喜好来挑选使用。

### 开启全文搜索
步骤可以根据蓝盒子站长的文章进行操作：[开启全文搜索](https://pullopen.github.io/%E5%9F%BA%E7%A1%80%E6%90%AD%E5%BB%BA/2020/10/19/Mastodon-on-Docker.html)

注意：Mastodon中的全文搜索的概念与新浪微博等平台的搜索功能不同，以下是文档描述：  
> Mastodon的全文搜索允许登录用户从他们自己的嘟文、他们喜欢的嘟文、他们的书签和他们被提及的嘟文中查找相应结果。Mastodon有意禁用了在全数据库搜索任意关键词的功能。

原因可以参考bgme站长的《谈谈长毛象那些奇怪的设计——写给长毛象新用户》：  
> “这样的设计同样也是为了**防止欺凌与骚扰**。 不知你是否在使用新浪微博的过程中经历过这样的事情，在自己没几个人关注的帐号里自言自语评论了一下某明星或大 V，然后莫名其妙的就有一些人跑到你的自言自语下面评论甚至辱骂。这些人怎么过来的呢？其中一个重要的途径就是搜索。搜索一些关键词，然后顺着搜索结果挨个评论轰炸。 长毛象将搜索功能限制为只能在自己发出的嘟文以及自己互动过的嘟文中进行搜索，彻底杜绝了通过搜索某些关键词，不请自来的对用户进行骚扰或欺凌的可能。”

<br>

### 加入站点中继

根据Mastodon的跨站机制，跨站公共时间轴上的信息并非所有联邦宇宙中的公共信息，而是显示所在的服务器所知道的所有公共嘟文，这些信息一般来自于所在服务器上用户的关注的人。  
也就是说，如果站点为个人使用/用户不多，跨站轴上的内容就会相应变少，为此，可以使用Mastodon中继服务来扩充跨站轴上的信息，更好地与联邦宇宙互通。

官方说明如下：
> **中继服务器**是一个信息统合服务器，各服务器可以通过订阅中继服务器和向中继服务器推送信息来交换大量公开嘟文。**它可以帮助中小型服务器发现联邦宇宙中的其他服务器的内容**，而无需本站用户手动关注其他远程服务器上的用户。

出于安全考虑，这里不公开中继地址，如有需要，可以自行摸索。

**注意**：开启中继后，小实例可能会出现跨站消息堵塞（中继中有大站点，信息流太频繁，堵塞了小实例的sidekiq），跨站时间轴混乱（来自更远时间前的内容插入了当前跨站时间轴）等情况，请确认能够接受（基本无伤大雅）。同时，添加的中继多，会导致服务器的PostgreSQL数据库体积增加。

可以通过以下路径查看数据库空间：管理-PgHero-space，可以查看到目前未使用的索引/档案大小和七天增长。

#### 增加sidekiq线程数

sidekiq是后台任务处理系统，这里引用bgme站长的[文章](https://blog.bgme.me/posts/the-experience-of-mastodons-follows-and-followers-managing-function/)，解释一下跨实例接收嘟文的机制（原文写的是跨实例关注，实际差不多）

> 比方说，位于BGME实例的账号A关注了位于CMX实例的账号B。 关注之后，账号A可以接收到账号B的动态（新嘟文、点赞 转发等）。
>
> 其背后的机制则是这样的：账号B有新动态，CMX实例服务器根据关注列表（订阅列表）生成推送任务，`mastodon-sidekiq` 执行推送任务。 BGME实例接收到动态推送，将新动态存入实例数据库，同时根椐本实例关注账号B的用户列表，生成相应账号的时间线与通知。

所以，如果由于大实例嘟文数量过多，造成了小实例的嘟文堵塞，可以通过增加sidekiq线程数来提高处理能力，如何判断合适的线程数可以参考bgme的[嘟文](https://bgme.me/@bgme/104811829396720912)

具体操作方法，参考南狐的[mastodon 增加 sidekiq 线程](https://note.southfox.me/#/page/mastodon%20%E5%A2%9E%E5%8A%A0%20sidekiq%20%E7%BA%BF%E7%A8%8B)

 <br>

### 开启安全模式
相关操作步骤及介绍见[中文长毛象实例开启 secure mode 的必要性](https://blog.bgme.me/posts/the-necessity-of-chinese-instance-to-enable-secure-mode/)，简单一句话就是可以阻止站点嘟文流入你不想它流入的站点。

**注意**：安全模式开启后，站点将无法使用中继服务，对于需要中继服务来扩充跨站轴的个人站/小站点来说不够友好，另外，由于兼容性问题，将无法接收到站点版本在v3.0.0以下的站点的消息。最后，有站长提到过，它也会造成额外的服务器计算压力。

### 进阶站点安全措施
#### 屏蔽特定浏览器/设备/服务访问
参考草莓酱的屏蔽规则[嘟嘟](https://m.cmx.im/@strawberry/107752003412174851)

#### 使用nginx隐藏特定用户主页/嘟文
参考faketaoist的nginx规则[嘟嘟](https://mstd.dansmonorage.blue/@faketaoist/107764913542021116)

<br>

## 选修：站点魔改
站点魔改有两种：使用其他站长提供的现成镜像/自己Fork官方仓库，修改代码。

### 使用现成镜像
参考：[Mastodon | 记录大型魔改过程](https://blog.tantalum.life/posts/notes-on-modifying-mastodon-in-docker/#%E5%8A%A0%E5%85%A5%E9%AD%94%E6%94%B9%E9%85%8D%E7%BD%AE)的步骤进行。

**注意**：如果使用小森林站长的魔改镜像， 需要注意下这个镜像的编辑嘟文功能，目前编辑后的嘟文只能在实装这个功能的站点之内互通，也就是说，如果对方站点没有更新编辑嘟文功能，就只能看到编辑前的内容，看不到编辑后的嘟文内容。

另外特别提醒：迁移镜像很有可能会碰到`500报错`，即无法发送嘟文，左下角弹出500提示，此时需要根据[后续工作](https://blog.tantalum.life/posts/notes-on-modifying-mastodon-in-docker/#%E5%90%8E%E7%BB%AD%E5%B7%A5%E4%BD%9C)的代码进行数据库迁移（web同样需要改为自己的web容器名称）：

```
docker-compose run --rm web rails db:migrate
```

之后如果还是有问题，尝试多次`docker-compose down` &`docker-compose up -d`，在实操中，我遇见过重启镜像2-3次后恢复正常的情况，原因不明。

### 自己魔改镜像
参考：[如何利用Docker搭建Mastodon实例（二）：进阶魔改篇](https://pullopen.github.io/%E8%BF%9B%E9%98%B6%E9%AD%94%E6%94%B9/2020/11/01/Mastodon-on-Docker-2.html)

如果你想在其他站长镜像上进行进一步修改，只需要把“Fork官方代码仓库”这一步修改为“Fork 你使用的镜像代码仓库”即可。

另外，此方介绍了一种可以在容器内修改代码并实时生效的方式，可以让调试变得更轻松，参考：[Docker 部署的 mastodon 在容器内 debug](https://tech.konata.co/2022-02-23-mastodon-debug-in-container/)

<br>

### 一些常用的修改
修改字数上限、媒体上限、投票上限、添加自定义主题、界面用语等修改，参考蓝盒子站长的[轻量魔改方法](https://pullopen.github.io/%E8%BF%9B%E9%98%B6%E9%AD%94%E6%94%B9/2020/11/14/mastodon-modify.html)  
常用自定义CSS同样参考蓝盒子站长的[如何装饰你的站点](https://pullopen.github.io/%E7%AB%99%E7%82%B9%E7%BB%B4%E6%8A%A4/2020/11/26/mastodon-manage.html)

#### 修改昵称字数上限

参考鳗鱼的这份[commit](https://github.com/rararwg/mastodon/commit/f12b89fb3d3694223f5e55ae8907636c190b8de4)进行修改


#### 修改站点 Favicon
（待补）

#### 修改注册提示语
如果你开启了“注册时需要批准”功能，想在“你为什么想要加入？”下加入一段注册提示语：
路径：`mastodon/config/locales/simple_form.zh-CN.yml`，找到`invite_request`项，修改`text`的内容。
![修改注册提示语](https://res.cloudinary.com/mantyke/image/upload/v1645953330/%E4%BD%A0%E4%B8%BA%E4%BB%80%E4%B9%88%E6%83%B3%E8%A6%81%E5%8A%A0%E5%85%A5_pd6mp7.png)

#### 调整吉祥物位置

吉祥物就是发嘟页面最下方（手机可以看到/浏览器页面调窄也可以看到）的图片，站长可以自主上传，同时也会出现在“关于本站”“站点公告”中

吉祥物默认居左，如果想让它居右

```
/*站点吉祥物*/
.drawer__inner__mastodon>img {
    object-position: right bottom;
    margin-left: auto;
}
```

如果想让它居中：

```
/*站点吉祥物*/
.drawer__inner__mastodon>img {
	object-position: bottom;
    margin: auto;
}
```

另外，也可以调节大小：

```
/*站点吉祥物*/
.drawer__inner__mastodon>img {
	width: 65%;
    height: 100%;
}
```

<br>

## 手册：使用站点后台管理
站长可以使用站点后台管理界面来对站点进行修改，包括本站名称/本站简介等等，这里简单写一点可以参考的部分。

### 网站设置
#### 区分三种站点介绍
服务器一句话介绍：出现在站点首页右下方、嘟文页面的右侧

本站简介：不出现在网页中，而是由API读取，如果使用APP搜索实例，就会读到这里设置的内容

本站详细介绍：出现在“关于本站”中，可以用html标题进行分栏

#### 推荐勾选的设置
推荐勾选“默认不让用户被搜索引擎索引”，可以避免用户内容被搜索引擎爬取，对隐私更友好。

#### 自定义使用条款
和“实例规则”的区别是：填写实例规则后，会在“关于本站”页面最上方增加一个二级标题：服务器规则，并以引用形式加入实例规则内容。而使用条款则只会出现在“使用条款”页面中。   

<br>

### 自定义表情
#### 拉取别站表情
可以通过这项设置远程拉取别站的表情到自己的服务器，操作步骤如下：
1. 前提：确保站点拉取到了你想要的表情，新站点与外界联通有限的情况下，可以考虑开几天中继，让服务器接收足够的外站表情。
2. 搜索表情短代码，例如常用的blob{{< emoji name="ablobattention" ext="gif" width="40" >}}
3. 全选，之后点击复制，表情就会被复制到本站。
4. 位置选择为本站，搜索刚刚复制来的表情，全选，新建一个分类名称，然后选择保存更改。    

注：部分表情包可能为他站自用，或者有授权问题，copy前最好先和出处站点**确认**一下，并给出credit。

**可以找到出处的方法有**：

1. 在界面，表情的最右方，会显示一个站点名称，“可能”是表情包的来源站点（不能完全肯定是，有一些表情包会显示多个来源站点，可能是和服务器拉取有关系）
2. 可以根据右方的站点地址找到拥有这个表情的站点，查看他们的“关于本站”界面，大部分站长会把自定义表情包来源写在这里，或者也可以询问该站表情包出处。
3. 如果你拥有来源站点的账号，也可以看他们的表情包分类，分类中也可能写有出处。

如果对方同意你使用这些表情，**复制表情后可以做的事情是**：

1. 在站点表情分类中写出表情包来源。
2. 在“网站设置-本站详细介绍”中写明表情包来源。

#### 不解析特定表情
如果有表情引起你的不适，可以设置不显示这个表情，步骤如下：
1. 复制这个表情到输入框，获取表情短代码。
2. 在自定义表情中搜索这个短代码，勾选，点击停用。
3. 之后别人再发送这个表情，表情就不会被解析为图片，而是显示为表情短代码。

#### 批量上传自定义表情
如果想上传新的表情，可以使用兔子老师的偷表情神器，步骤参见：[自定义表情](https://pullopen.github.io/%E7%AB%99%E7%82%B9%E7%BB%B4%E6%8A%A4/2020/11/26/mastodon-manage.html)

<br>

## 附加题：Mastodon bot

请注意：请合理使用bot功能，包括但不限于：不要未授权转载私人账号内容，不使用bot功能对其他用户进行监听、骚扰。

### 微博转发到Mastodon

可以使用小森林站长写的python脚本：[weibo2toot](https://github.com/mashirozx/weibo2toot)

使用教程待补

### 其他bot功能

可以参考的内容：[mastodon.py](https://mastodonpy.readthedocs.io/en/stable/)，一个python的mastodon api包。

另外，也可以使用[Cheap Bots](https://cheapbotstootsweet.com/)来简单实现推送/应答的功能。

<br>

## 参考资料：

Mastodon搭建指南：[链接](https://pullopen.github.io/catalog/)

Mastodon | 采用docker建站后的使用与维护：[链接](https://blog.tantalum.life/posts/how-to-run-your-mastodon-by-docker/#%E4%BD%BF%E7%94%A8alias%E8%84%9A%E6%9C%AC%E7%BC%A9%E5%86%99tootctl%E5%91%BD%E4%BB%A4)

Mastodon | 记录大型魔改过程：[链接](https://blog.tantalum.life/posts/notes-on-modifying-mastodon-in-docker/)

使用 Mastodon 搭建个人信息平台：前篇：[链接](https://soulteary.com/2022/01/24/building-a-personal-information-platform-with-mastodon-part-1.html)

使用 Mastodon 搭建个人信息平台：调优篇：[链接](https://soulteary.com/2022/01/25/building-a-personal-information-platform-with-mastodon-part-2.html)

Mastodon 的基本维护：[链接](https://tand.me/36117)

<br>
