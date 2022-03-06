---
title: "Mastodon | 微博转发到Mastodon bot"
date: 2022-03-06T16:44:57+08:00
lastmod: 2022-03-06T16:44:57+08:00
description: 如此这般，这般如此。
tags:
  - Mastodon
categories:
  - 甘普基本变形定律
image: 
slug: Weibo2toot

---
上周就在此方的教学下搞定了，但学会之后发现原来想搬运的微博账号杂乱信息太多，实际效果很差，后来问奈瑟丽有没有什么想在Mastodon上看的微博账号，她说想看每日人物，就重新动手做一下，这篇文章是记录整个搭建流程的笔记。

请注意：搬运微博属于无授权转载，请不要搬运私人微博账号，在对应Mastodon账号上显著标明`镜像`，勾选`这是一个机器人帐户`，并在简介中说明账号性质与账号来源。

<br>

## 在VPS上安装Python

本来是想按此方的推荐装一个Anaconda，后来发现Anaconda有1000多个库……我就转头装了Miniconda。

```
 mkdir miniconda //创建miniconda文件夹
 cd miniconda //进入miniconda文件夹
```

```
wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh //下载版本最新版本
sh Miniconda3-latest-Linux-x86_64.sh //用bash安装
```

之后按`Enter`继续安装，Miniconda会显示很长一段使用许可说明，按`Enter`不断翻页

```
Do you accept the license terms? [yes|no] //输入Yes同意使用许可
```

```
Miniconda3 will now be installed into this location:
/root/miniconda3

  - Press ENTER to confirm the location
  - Press CTRL-C to abort the installation
  - Or specify a different location below

[/root/miniconda3] >>> 
```

这里我直接安装在了本地（即`/root/miniconda3`），也可以输入其他安装路径

```
Preparing transaction: done
Executing transaction: done
installation finished.
Do you wish the installer to initialize Miniconda3
by running conda init? [yes|no]
```

选择是否运行conda init来初始化，我选了yes，返回`Thank you for installing Miniconda3!`，安装完毕。把终端关掉，试一下是不是安装成功了：

```
conda --version
conda 4.11.0
```

这里有个小问题是安装Miniconda之后，root账号前会出现`（bash）`字样，根据[这篇文章](https://www.cnblogs.com/devilmaycry812839668/p/10349602.html)，输入`conda deactivate`命令可以取消掉。

<br>

## 安装Bot

这里用的是小森林站长写的将微博搬运到长毛象的[脚本](https://github.com/mashirozx/weibo2toot)，下载仓库，并按照说明执行这几个命令，如果提示没有`pip3`就[下载一个](https://www.runoob.com/w3cnote/python-pip-install-usage.html)：

```
git clone https://github.com/mashirozx/weibo2toot.git
cd weibo2toot
conda create -n mastbot python=3.8 //创建一个叫mastbot的版本为3.8的python虚拟环境
conda activate mastbot //激活mastbot环境，root账号前会出现（mastbot）
pip3 install -r requirements.txt //安装 requirement.txt 所包含的依赖
cp conf.sample.ini conf.ini //复制一份配置文件并修改名称
nano conf.ini //编辑配置文件
```

[虚拟环境](https://docs.python.org/zh-cn/3/library/venv.html)有点儿类似docker，可以方便地在不同虚拟环境里用不同的Python版本，不同虚拟环境之间彼此相对独立，但是独立程度没有docker那么高。

<br>

## 准备配置内容

首先需要一个用来转发微博内容的Mastodon账号，注册后，在管理面板找到开发-创建新应用，创建一个新的应用，并给予读/写权限，最后复制`你的访问令牌`，备用

然后找到想要镜像的微博账号，复制它的User_id，方法可以参考：[如何获取user_id](https://github.com/dataabc/weibo-crawler#%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96user_id)。

<br>

## 填写配置文件

之后来填写配置文件：

```
[PROXY]
ProxyOn = false
HttpProxy = http://127.0.0.1:7890
HttpsProxy = https://127.0.0.1:7890

[MASTODON]
BaseUrl = 填写Mastodon账号所在的实例
# register your application here: https://hello.2heng.xin/settings/applications
AccessToken = 复制Mastodon账号的访问令牌
# 'direct' - post will be visible only to mentioned users 
# 'private' - post will be visible only to followers 
# 'unlisted' - post will be public but not appear on the public timeline 
# 'public' - post will be public
TootVisibility = 填写嘟文的公开范围
IncludeVideo = false //是否转发视频
SourcePrefix = :icon_weibo:
ExternalLinkPrefix = :sys_link:
VideoSourcePrefix = :sys_video:

[WEIBO]
WeiboRss = https://rsshub.app/weibo/user/微博的User_id
```

特别说明一下`WeiboRss`这个部分，这里实际上是在使用RssHub提供的[微博Rss路由](https://docs.rsshub.app/social-media.html#wei-bo)，因此推荐自己搭建RssHub而不是直接使用配置文件中给出的官方路由，同时也可以使用RssHub提供的参数来进一步优化Rss输出内容和排版。

运行`python3 run.py`来启动Bot，Bot会自动开始抓取微博的过往帖子并发出。

<br>

## 创建定时程序

创建一个定时程序让Bot每隔20分钟跑一次：

```
crontab -e
*/20 *    * * *   root    cd miniconda/weibo2toot && python3 run.py
```

<br>
