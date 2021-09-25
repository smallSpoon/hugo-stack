---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description:
  - 简明麻瓜快速念咒Hugo搭建笔记
toc: true
tags:
  - Hugo
categories:
  - 麻瓜快速念咒互助小组
image: 
math: 
license: 
hidden: false
comments: true
draft: true
slug: {{ substr (md5 (printf "%s%s" .Date (replace .TranslationBaseName "-" " " | title))) 4 8 }}
---