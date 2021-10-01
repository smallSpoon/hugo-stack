---
title: Hugo | 评论区换为Waline
date: 2021-10-01T16:02:14+08:00
lastmod: 2021-10-01T16:02:14+08:00
description: 折腾之心不死，总之试试我能不能自己把样式改了
toc: true
tags:
  - Hugo
categories:
  - 麻瓜快速念咒互助小组
image: 
math: 
license: 
hidden: false
draft: false
slug: 0747636e
---



## 引入Waline

Stack主题事先就支持Waline，搭建很简单，参考[Waline文档](https://waline.js.org/guide/get-started.html#leancloud-%E8%AE%BE%E7%BD%AE-%E6%95%B0%E6%8D%AE%E5%BA%93)，在[LeanCloud国际版](https://console.leancloud.app/apps)中新建一个应用，再在[Vercel](https://vercel.com/)上进行搭建，值得注意的只有看到Warning不要惊慌和它真的搭建起来很慢这两点。

之后再在`config.yaml`上参照[前端配置](https://waline.js.org/reference/client.html#el)，写入`serverURL`，把`avatar`改成随机小怪兽`'monsterid'`就OK了。

匿名情况下，昵称只支持三个及以上中文字符，[Waline评论之修改记录](https://laomai.org/modification-record-of-waline-comments.html)里提到了如何修改，但太折腾了，用现成的似乎也不好更新，算了……

## 配置Waline



