---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
description: 简明麻瓜快速念咒Hugo搭建笔记
tags:
  - Hugo
categories:
  - 甘普基本变形定律
image: 
draft: true
slug: {{ substr (md5 (printf "%s%s" .Date (replace .TranslationBaseName "-" " " | title))) 4 8 }}

---
