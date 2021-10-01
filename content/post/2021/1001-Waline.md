---
title: Hugo | 评论区换为Waline
date: 2021-10-01T16:02:14+08:00
lastmod: 2021-10-01T16:02:14+08:00
description: 当你想要浪费时间的时候你应该干什么
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

匿名情况下，昵称只支持三个及以上中文字符，[Waline评论之修改记录](https://laomai.org/modification-record-of-waline-comments.html)里提到了如何修改，但太折腾了，用现成的似乎也不好更新，算了算了。

另外评论提醒也创建失败，研究未果，下回（下回）有精神的时候我会来搞定它的。现在就暂时用用[后台](https://blog-waline-7he2bz0o3-mantyke.vercel.app/ui/login)，总之能用就行。

​	

### 修改Waline样式

Waline支持[自定义样式](https://waline.js.org/guide/client/style.html#%E6%8F%90%E4%BE%9B%E7%9A%84%E5%8F%98%E9%87%8F)和[无样式版本](https://waline.js.org/guide/client/import.html#%E9%80%9A%E8%BF%87-cdn)，研究了一会没什么头绪，先放在这里。

思路上，我是更倾向于使评论和输入框拆分为两张卡片，其他倒不需要怎么修改。

​	



