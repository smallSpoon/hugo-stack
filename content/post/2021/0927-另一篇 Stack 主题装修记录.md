---
title: Hugo |另一篇Stack主题装修记录
date: 2021-09-27T22:55:08+08:00
lastmod: 2021-09-28T23:55:08+08:00
description: 非魔法界人士与样板间搏斗全纪实，闻者也，落泪，见者也，伤心
toc: true
tags:
  - Hugo
categories:
  - 麻瓜快速念咒互助小组
image: 
math: 
license: 
hidden: false
slug: a08f1963
---

之前那篇太长了，转移阵地到这篇来

​	

## Google Search Console

参考了[为 Hugo 配置 Google Analytics](https://immwind.com/google-analytics-for-hugo/)这篇文章来配置[Google Search Console](https://search.google.com/search-console)，但前前后后试了好几遍都不能通过DNS验证，最后只能选择通过网址前缀来进行添加，用HTML 标记验证。

遇到了站点地图无法读取的情况，参考[Search Console帮助](https://support.google.com/webmasters/thread/101172591/%E6%98%BE%E7%A4%BA%E6%97%A0%E6%B3%95%E8%AF%BB%E5%8F%96%E6%AD%A4%E7%AB%99%E7%82%B9%E5%9C%B0%E5%9B%BE?hl=zh-Hans)，显示站长工具有一定延迟，过几天再看看。

另外，写在这儿好了，在装Google Analytics时出了点问题，无论如何无法屏蔽本地的计数——后来发现是因为Stack模板中预先写了一条

``` 
{{- template "_internal/google_analytics.html" . -}}
```

而我的文件名叫做`google_analytics_async.html`…………至于不小心删了`{{- partial "head/custom.html" . -}}`导致惊慌失措地找了半个点为什么字体失效这件事咱们当它没发生过，好吗？

​	

### DNS通过验证

过了一天Google还是没有读出来我的TXT记录，我觉得这不对劲，开始研究。

首先读了排解 [TXT 記錄問題](https://support.google.com/a/answer/2716888#zippy=%2C%E4%BD%BF%E7%94%A8%E5%85%8D%E8%B2%BB%E7%B6%B2%E8%B7%AF%E6%9C%8D%E5%8B%99%E6%9F%A5%E8%A9%A2-txt-%E8%A8%98%E9%8C%84%2C%E8%AE%8A%E6%9B%B4-hostname-%E6%AC%84%E4%BD%8D%E4%B8%AD%E7%9A%84%E9%A0%85%E7%9B%AE)，文章中提到DNS变更最多可能需要72小时才能生效，这明显和我的情况不符——最早的TXT记录已经加了最少半个月，无论如何也应该生效了。

文章中同时提到，可以利用[DNS查询工具](https://toolbox.googleapps.com/apps/dig/)来查询网址的DNS生效情况，输入后发现并没有显示TXT记录，验证了TXT记录确实没有生效——复查了添加是否出错等一系列错误可能之后，我觉得问题应该不在于填写TXT值的姿势有问题——更可能是某些魔法事故，于是搜索了“TXT值验证失败”，并在[域名授权验证配置推送失败](https://help.aliyun.com/knowledge_detail/48058.html)里找到了这么一句话：

> **说明**：如果您的域名解析中存在CNAME记录，请暂时去掉该CNAME记录，否则将无法通过域名授权验证。在数字证书签发后，您可删除添加的TXT记录，并重新添加CNAME记录。如果CNAME记录无法删除，请通过文件验证方式完成域名授权验证。

把CNAME改成A记录之后十分钟左右，Google Search Console迅速地通过了我的DNS验证申请。

……谢谢你，阿里云

​	



### 站点地图

验证完网域后一般就是提交Sitemap，Hugo有自带的站点地图生成，一般不需要操什么心……才怪。

Google不知道为什么一直显示Sitemap无法获取，研究了一会，首先考虑的可能是Hugo是否生成了错误的Sitemap，于是找了[站点地图检测工具](https://www.websiteplanet.com/zh-hans/webtools/sitemap-validator/?page=https://mantyke.icu/sitemap.xml)，错误为：

```
Sitemap url not defined in robots.txt
Sitemap not return correct Content-type header
```

​	……但是这什么也不能说明，跑去对比其他能被Google检索出来的站点的xml地址，发现有一部分xml也提示有这个错误，说明关键性不在这儿。

于是再考虑是否是Hugo生成的Sitemap本身有问题，先查了Hugo的[Sitemap文档](https://www.gohugo.org/doc/templates/sitemap/)，大概读了一下模板，然后找到别人修改的[Hugo 自定义 Sitemap（站点地图）模板](https://wan.lu/2020/hugo-custom-sitemap-template.html)，干脆更新了一下sitemap模板，放在`layout`目录下，部署后发现新的xml文件已经如文章所言发生变化，再添加到Google上一看——不还是无法获取嘛！！！

这事儿我研究好长时间没个结果，逐句对比了模板和生成的xml文件，确实发现有点不一样，比如我在本地以`hugo`命令生成的xml和Vercel生成的xml在lastmod时区上有明显不同这种细节——后来差点放弃了，直到我看到Bing站长工具里我提交上去的站点地图，状态显示为**成功**。

……至少说明我弄出来的东西是没有问题的，剩下的只好尽人事听天命。

​	

又及：我研究了之前的Hexo Blog，这个Blog什么也没做，但在我不知道的时候顺利被Google、Bing及百度等各个引擎收录了，而且有些页面排位还挺靠前。研究发现大部分Hexo Sitemap教程都提到需要安装专门的插件（我没装，但说不定集成了），同时也没有在文件夹里发现`Sitemap.xml`文件。这至少说明了被搜索引擎收录，主动上传Sitemap不是一个必要条件——摸了摸了！

​	

## 自动更新文章最后修改时间

想要这个功能主要是因为主题里有在篇末显示最后更新时间的功能，所以我开始捣鼓了（你

研究了在Front Matter里加lastmod参数的种种可能，最后举手投降，参考了[自动添加博客页面更新日期](https://blog.yfei.page/cn/2021/03/lastmod-hugo/)，在`config.yaml`里写

```
frontmatter:
  lastmod: [":fileModTime", "lastmod"]
```

如果加上`":git"`，就可以读取git推送的时间，但是推上去好像时区不太对，目前还没有解决这个问题，估计是在配置文件里修改`dataformat`参数。  
最终解决办法参考[这篇文章](https://mantyke.icu/2021/a08f1963/)

​	

## 修改网页背景颜色

位置在`assets\scss\variables.scss`

```
--body-background: #f6f6f6;
```

原色值是`#f5f5fa`，我觉得稍微有一点太亮了，改成了一直在用的`#F6F6F6`，，备用色值还有`#ECEFF4`和`#f2f2f7`，前者比较偏蓝色，后者是Eureka主题的背景色。

10.1更新：试验了`#84a6cb0f`和`#6994c20f`后选了`#6994c20f`，是比`#ECEFF4`更浅并偏灰的蓝色，总之我是在向海洋动物馆方向越走越远了。

​	

## 进一步修改代码块

### 增加限高和滚动

```
overflow-x: auto; 
max-height: 230px;
```

在代码过长的时候限制代码块高度，决定溢出内容如何处理的参数是[overflow-x](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow-x)，另外一个则决定代码块高度。位置在`layout/artcle.scss`的`pre`标签下。

​	

### 代码块添加边框

**目的：** 通过设置边框描边和调整行距参数，使代码块首屏保持美观，不裁剪底部文字。

**思路：** 给代码块添加一层边框，使代码在边框内滚动，实现上下边距效果，并设置上下边距与行高等高，代码块限高为行高的倍数。（但滚动时还是没有办法以行高为单位滚动，这个没办法了……）

```
border:23px  solid #272822; //边框宽度为23px，颜色为#272822
padding: 0px 30px 0px 30px;; //左右内边距为30px
max-height: 230px; //限制代码块高度为230px
line-height: 23px; //行高为23px
```

​	

## 增加引用短代码

参考[自定义 Hugo Shortcodes 简码](https://guanqr.com/tech/website/hugo-shortcodes-customization/)添加了自己的引用短代码，效果如下：

```
{< quote >}
三月，因久旱不雨，苏轼赴郿，祈雨于太白山之上清宫。数日后，虽有微雨，父老以为不足，于是，再陪宋太守亲往祭祷，回程路上，便见道中有云气自山中来，如群马奔突而至车座左右，苏轼一时好奇心起，开笼收云归家，作《攓云篇》。

”
{< /quote >}
// 由于代码块内也会被判断成html，实际使用时需要各加一个花括号
```

{{< quote >}}
三月，因久旱不雨，苏轼赴郿，祈雨于太白山之上清宫。数日后，虽有微雨，父老以为不足，于是，再陪宋太守亲往祭祷，回程路上，便见道中有云气自山中来，如群马奔突而至车座左右，苏轼一时好奇心起，开笼收云归家，作《攓云篇》。
{{< /quote >}}

稍微改了下CSS的部分，调整了样式细节，增加了一个响应式布局，但本身Stack模板的响应式比较复杂，就只做了最基础的部分，满足我自己设备的美观需求。

```
<!-- 短代码部分 -->
<!-- 文件位置：~/layouts/shortcodes/quote.html -->

<blockquote class="quote{{ range .Params }} {{ . }}{{ end }}">
    {{- $content := .Inner | markdownify -}}
    {{- if not (strings.HasPrefix $content "<p>") }}
        {{ printf `<p>%s</p>` $content | safeHTML }}
    {{- else }}
        {{- $content }}
    {{- end -}}
</blockquote> 
```

```
// 引用块CSS
// 文件位置：~/assets/scss/custom/_custom.scss

blockquote.quote {
    position: relative;
    margin: 1.5em -10em 0 -10 ;
    padding-left: 18%;
    padding-right: 15%;
    border: none;
    background-color: transparent;;
    &::before {
        position: absolute;
        left: 7%;
        content: '“';
        color: var(--color-contrast-low);
        font-size: 3em;
        font-weight: bold;
        line-height: 1;
    }
    &.poetry {
        display: table;
        padding: 0;
        &::before {
            left: -1em;
        }
        p:last-child {
            margin: 0;
        }
    }
    &.en {
        p {
            line-height: 1.618;
            text-align: left;
            hyphens: auto;
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
        }
    }
}
@media (max-width:650px) {
    blockquote.quote {
        &::before {
            position: absolute;
            left: 3.5%;          
        }
    }
}

@media (max-width:500px) {
    blockquote.quote {
        &::before {
            position: absolute;
            left: 3.5%; 
            top: 0.1%         
        }
    }
}


```

​	

## 修改友链样式

参考[添加友情链接 shortcodes](https://bore.vip/archives/hugo-theme-stack/#%E6%B7%BB%E5%8A%A0%E5%8F%8B%E6%83%85%E9%93%BE%E6%8E%A5-shortcodes)，在源代码仓库里找了半天又评论问了问博主，然后才发现原来文章里有写明过程ORZ，把修改方式抄录如下：

新建`layouts\page\links.html`

```
<footer class="article-footer">
    {{ partial "article/components/tags" . }}

    {{ if and (.Site.Params.article.license.enabled) (not (eq .Params.license false)) }}
    <section class="article-copyright">
        {{ partial "helper/icon" "copyright" }}
        <span>{{ default .Site.Params.article.license.default .Params.license | markdownify }}</span>
    </section>
    {{ end }}

	{{ if and (.Site.Params.article.edit.enabled) (not (eq .Params.edit false)) }}
    <section class="article-edit">
        {{ partial "helper/icon" "external-link" }}
        <span><a href="https://github.com/iwyang/iwyang.github.io/edit/develop/content/{{ replace .File.Path "\\" "/" }}" target="_blank">在 GitHub 上编辑此页</a></span>
    </section>
    {{ end }}

    {{- if ne .Lastmod .Date -}}
    <section class="article-time">
        {{ partial "helper/icon" "clock" }}
        <span class="article-time--modified">
            {{ T "article.lastUpdatedOn" }} {{ .Lastmod.Format ( or .Site.Params.dateFormat.lastUpdated "Jan 02, 2006 15:04 MST" ) }}
        </span>
    </section>
    {{- end -}}
</footer>
```

新建`layouts\shortcodes\link.html`

```
{{$URL := .Get 0}}
{{ with .Site.GetPage $URL }}
<div class="post-preview">
  <div class="post-preview--meta" style="width:100%;">
    <div class="post-preview--middle">
      <h4 class="post-preview--title">
        <a target="_blank" href="{{ .Permalink }}">{{ .Title }}</a>
      </h4>
      <time class="post-preview--date">{{ .Date.Format ( default "2006-01-02") }}</time>
      {{ if .Params.tags }}
      <small>{{ range .Params.tags }}#{{ . }}&nbsp;{{ end }}</small>
      {{ end }}
      <section style="max-height:105px;overflow:hidden;" class="post-preview--excerpt">
        {{ .Summary | plainify}}
      </section>
    </div>
  </div>
</div>
{{ end }}
```

友链头像放在`\assets\link-img\`，友链数据放在`\data\links.json`

```
[
    {
        "title": "",
        "website": "",
        "image": "",
     "description": ""
    },
	{
        "title": "",
        "website": "",
        "image": "",
     "description": ""
    }
]
```

​		

## 侧栏加入RSS

其实Hugo会自动生成Rss订阅地址`index.xml`，直接在地址栏输入即可，用Rss阅读器试了一下也可以自动发现订阅源，所以不加也不会影响什么。但习惯的力量是巨大的……

第一反应新建一个page，`slug: "index.xml"`，`hugo sever`一下发现哇哦真简单非常完美就这么结束了——才怪！自动部署会出问题，部署后在Bulid步骤报错，具体为

```
Error building site: failed to render pages: open /home/runner/work/hugo-stack/hugo-stack/site/public/index.xml: is a directory
```

解决方法是在config.yaml里来加，写成：

```
- identifier: rss
	name: Rss
    url: /index.xml
    weight: -10
    pre: RSS
    params:
       ### For demonstration purpose, the home link will be open in a new tab
       newTab: true
```

​	

## 关于代码块……

实测在代码块上加入代码类型是可以被识别并着色的，例如：

```yaml
markup:
    tableOfContents:
        endLevel: 4
        ordered: true
        startLevel: 2
    highlight: 
        guessSyntax: true *读别人写的文章句是控制自动识别代码类型的，但实际加上后只是多了一个复制按钮，很神秘
```

​	另外只能复制行号的问题解决了，同时加上行号显示就只能复制行号，去掉行号显示就可以复制代码块的内容，也很神秘……

​	

