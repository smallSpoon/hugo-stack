---
title: Hugo | 在Hugo-Eureka模板中加入字数统计
description:
  - 简明麻瓜快速念咒Hugo搭建笔记
toc: true
tags:
  - Hugo
categories:
  - 麻瓜快速念咒互助小组
series:
date: 2021-08-28T11:06:09+08:00
lastmod: 2021-08-28T11:06:09+08:00
slug: a1af34e4
featuredImage:
draft: false
description: 终于找到应该写在哪儿了，我简直是个嗅嗅
---

其实功能本身一点都不难实现，经过查询，发现是Hugo自带，需要引入的变量是WordCount，只要在相应配置文件中加入代码就可以了。

问题是！！这个模板！！它！！到底写在了哪儿！！啊！！

我东奔西跑，F12找变量，找可能有关系的html文件，找了个焦头烂额，对自己产生极大不自信，一度以为真的没有这个，可能它就是不支持呢？

但我又想，有这个需求的，不可能独我一家对吧？就算作者真的很不喜欢字数统计，也该有人提啊，我就又跑到主题仓库里去翻提问和讨论，最后神奇地解决了：

在Issues区翻找的时候，看到一个标题为“A search bar”的问题，最后一名回复者贴出了[他的Blog地址](https://imnerd.org/)，我好好奇地点进去一看，发现他对Eureka模板做了非常高度的自定义，很酷——往下拉了拉看他之前的文章，在一些南京游记中间发现了[Hugo 主题 Eureka 自定义](https://imnerd.org/custom-hugo-theme-eureka.html)，点开这篇文章，发现文章下添加了字数统计。

知道事儿能成就简单多了嘛！

​	


查阅了这篇博文，文章中提到：

> **2021-03-13 更新：** 更新后的 Eureka 统一使用了 `components/post-metadata.html` 显示文章的 metadata，代码和之前的 `layouts/partials/post_metadata.html` 是一致的。

因此相关样式作者是放在了`themes\eureka\layouts\partials\components`文件夹当中，名称是`post-metadata.html`。

我想把字数统计加在阅读时间之前，于是搜索`readingTime`，在相应代码前加入

```
  <div class="mr-6 my-2">
    <a href="{{ .Permalink }}">
      <i class="fas fa-pen mr-1"></i>
      <span>{{ .WordCount }} 字</span>
    </a>
  </div>
```

刷新，锵锵~



​	



顺便，用一种歪门邪道的方式改了右边的目录标题显示，它本来显示的是`On This Page`，和下面的中文很不搭调，我一直想换，但把网站语言从“en”换成“zh”后总不生效，还把字数统计改坏了（对应的参数是`config.yaml`下的`hasCJKLanguage: true`），修好后怒从心头起干脆把英文词典（能这么叫吗？）给改了，步骤如下：

1. 首先我之前已经知道这个模板写了多种语言的对应模板，正常来说，切换语言后，就会切换对应的词典。所以如果想要换成自己喜欢的显示，可以直接进行修改，问题是我不知道它在哪儿

2. 打开VS，加载Blog文件夹，搜索`On This Page`

3. 把每个搜索结果挨个看一遍，发现路径在`themes\erueka\i18n\!en.yaml`

4. 改掉对应的显示，Over。

   
   



​	







