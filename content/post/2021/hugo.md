---
title: Hugo | 另一个（些）静态博客后端编辑发布方案
date: 2021-10-12T09:44:00+08:00
tags:
- Hugo
categories:
- 麻瓜快速念咒课堂笔记
description: 好像没解决又好像解决了，小惠金区常有这样的事情
slug: D946B9
draft: true

---
## 大家好我又来了

……其实Blog没人看，所以没有什么大家，但这么说比较好开头一点。

昨天说到了新的折腾项目，今天我还在琢磨这个事，问题主要在于，虽然[静态博客编辑器](https://jingtaiboke.com/)可以用，但它并不是一个开源项目，无法自己进行部署，加上请求了Github仓库的读取和修改权限，我总琢磨是不是可以找个安全性更高一点的用一用，就算没有，有得挑也好嘛！

而且理论上来说，Github API提供了写入和修改的权限，Github APP可以控制具体允许读取的仓库，找一个能支持以上功能的编辑器就万事大吉……理论上来说。

<br>

## 方案一：Headless CMS

[什么是无头 CMS？](https://www.sitecore.com/zh-cn/knowledge-center/digital-marketing-resources/what-is-a-headless-cms)，我自己理解的话，CMS是内容管理系统（好熟悉的造词，上个月我是不是学过差不多的，比如Git是版本管理系统？），可以用来建站，而Headless CMS将本来捆绑在一起的前后端分离开，于是我们可以单独使用它提供的后端来联结已经写好的前端程序。

……说起来怪复杂的，其实用起来就是一个不需要自购服务器也可以用的后端，里面的一些可以读取仓库并将其中的内容可视化为面板管理界面，于是写作和修改草稿都可以在线上进行，发布后文件被写入到Github仓库中，之后的编译和发布就交给[CI/CD](https://www.redhat.com/zh/topics/devops/what-is-ci-cd)。

<br>

### Forestry.io

