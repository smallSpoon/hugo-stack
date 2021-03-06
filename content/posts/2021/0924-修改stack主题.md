---
title: "Hugo | 看中Stack主题的归档功能，搬家并做修改"
date: 2021-09-24T14:15:04+08:00
toc: true
tags:
  - Hugo
categories:
  - 甘普基本变形定律
description: 装修是一种健身运动，一天三次、少量多餐、一二三四、再来一次
series:
draft: true
slug: f9f0ec87
featuredImage:
draft: false

---

## TO-DO 

- [x] 调整文章页面的显示样式，在右侧栏显示归档和Tags
- [x] 调整首页文章摘要字号
- [x] 调整左侧栏Home链接，使之不打开新页面
- [x] 修改文章、摘要字号
- [x] 删除vibrant.js插件
- [x] 调整相关文章数量，增加[永久链接](https://mantyke.icu/2021/2f0f8e23/#%E9%85%8D%E7%BD%AE%E6%B0%B8%E4%B9%85%E9%93%BE%E6%8E%A5)和[盘古之白](https://mantyke.icu/p/2f0f8e23/#%E5%8A%A0%E5%85%A5%E7%9B%98%E5%8F%A4%E4%B9%8B%E7%99%BD)
- [x] 使文章中能够使用html
- [x] 为分类配色
- [x] 修改超链接显示
- [x] 修改About页
- [x] 增加左侧栏友情链接
- [x] 加入每篇文章的字数统计
- [x] 修改代码框、引用等样式
- [ ] 加入代码高亮
- [x] 修改网站配色
- [x] 增加网站icon
- [x] 修改主题字体
- [x] 增加[文章评论区](https://mantyke.icu/2021/ca2e5cb6/)
- [x] 文章按年份分类
- [x] 增加[Google Analytics](https://mantyke.icu/2021/2f0f8e23/#google--analytics)
- [x] 增加[站点运行时间统计](https://mantyke.icu/2021/2f0f8e23/#%E7%AB%99%E7%82%B9%E8%BF%90%E8%A1%8C%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1)
- [x] 增加页尾站点总字数/篇目数统计
- [x] Google Search Console




​	






---

## 调整文章页面的显示样式

在主题的Issue里找到了一套[开源修改](https://github.com/ShadowySpirits/hugo-theme-stack)，大概套用了一下（应该是抄了`_default`文件夹和`layouts\partials\widget`中的`toc.html`文件，以及`assets\scss`中的`custom.scss`文件，用以控制右侧栏独立滑动。）

套用后发现右侧toc栏消失了，后来发现是没加上toc组件，调整根目录下`config.yaml`

```
    widgets:
        enabled: 
            - search
            - toc
            - archives
            - tag-cloud
```
​	

### 修改中栏阴影样式

```
.article-page {
    &.hide-sidebar-sm .left-sidebar {
        display: none;

        @include respond(md) {
            display: inherit;
        }
    }

    .main-article {
        background: var(--card-background);
        border-radius: var(--card-border-radius);
        box-shadow: var(--shadow-l2); //修改阴影样式
        overflow: hidden;
```

​		

### 调整相关文章数量

`layouts/partials/article/components/related-contents.html`

```
 {{ $related := (where (.Site.RegularPages.Related .) "Params.hidden" "!=" true) | first 3 }}  //修改数字即可
```

{{< codehtml >}} 
    <br/>
{{< /codehtml >}}



### 修改手机端目录卡片

手机端目录卡片与文章卡片有很明显的不对称，修改一下

```
.menu {
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex-grow: 1;
    font-size: 1.4rem;

    background-color: var(--card-background);
    padding: 15px ;
    box-shadow: var(--shadow-l2); //改个阴影
    display: none;
    border-radius: 10px;  //加个圆角

    margin: 0; //改为0
```

​	


## 调整字号
### 修改文章字号
修改`hugo-theme-stack/assets/scss/variables.scss`

```
:root {
    --article-font-family: var(--base-font-family);
    --article-font-size: 1.6rem;

    @include respond(md) {
        --article-font-size: 1.65rem; //字号
    }

    --article-line-height: 1.6; //行距

```
{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

### 修改摘要字号

`assets\scss\partials\article.scss`

```
.article-subtitle {
    font-weight: normal;
    color: var(--card-text-color-secondary);
    margin: 5px 0;
    line-height: 1.5;

    font-size: 1.75rem; //改为1.5rem 应该是全局
    @include respond(xl) {
        font-size: 2rem; //改为1.5rem 应该是大尺寸屏幕适应？
    }
}
```
{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

## 调整左侧栏Home链接

调整根目录下`config.yaml`

```
menu:
    main:
        - identifier: home
          name: Home
          url: /
          weight: -100
          pre: home
          params:
              ### For demonstration purpose, the home link will be open in a new tab
              newTab: true //改为false
```

{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

## 删除vibrant.js插件

vibrant.js插件是一个为分类图片加上相似色调滤镜的插件，我用不上，就删了。

步骤上完全按照[Hugo Stack主題修改記錄 (瘦身篇)](https://www.bigs3.com/article/modify-hugo-theme-stack-one/)的步骤进行

另外同样根据这篇文章修改了页面样式

{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

### 删除Categories的特色图片

`assets/scss/partials/layout/list.scss`

```
.subsection-list {
    margin-bottom: var(--section-separation);
    overflow-x: auto;

    .article-list--tile {
        display: flex;
        padding-bottom: 15px;

        article {
            width: 200px; //改爲200px
            height: 50px; //改爲50px
            margin-right: 5px; //改爲5px
            flex-shrink: 0;
            box-shadow: var(--shadow-l2); //改个卡片阴影

            .article-title {
                margin: 0;
                font-size: 1.5rem; //改爲1.5rem，調整字體尺寸
            }

            .article-details {
                padding: 20px;
                justify-content: center; //添加justify-content設定，保持字體居中
            }

        }
    }
}
```
{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

### 删除相关文章的特色图片

`assets/scss/partials/layout/article.scss`

```
.related-contents {
    overflow-x: auto;
    padding-bottom: 15px;

    & > .flex {
        float: left;
    }

    article {
        margin-right: 15px;
        flex-shrink: 0;
        overflow: hidden;
        width: 250px;
        height: 80px; //改为80
        box-shadow: var(--shadow-l2); //加个卡片阴影

        .article-title {
            font-size: 1.4rem; //改为1.4
            margin: auto;
            justify-content: center; //居中
        }
```
{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

## 为Markdown增加Html支持

解决办法来源于[Hugo博客中.md文件中嵌入的html代码无法被渲染](https://d.cosx.org/d/421422-hugomdhtml)，在`config.yaml`里加入

```
markup:
  goldmark:
    renderer:
      unsafe: true
```

但是如果这么开启Html，目录就会跟着被渲染成非常难看的无序列表。大部分情况下，Html只被我用来写空白行，因此这牺牲未免太大了一点，所以换成了用Shortcode来解决。

步骤参考[HUGO如何在Markdown上使用HTML | Yayapipi Site](https://yayapipi.com/posts/hugo%E5%A6%82%E4%BD%95%E5%9C%A8markdown%E4%B8%8A%E4%BD%BF%E7%94%A8html/)

在`layout/shortcode/`里新增`codehtml.html`，内容为

```
{{.Inner}}
```

空白行的写法是：

```
## codehtml前后包裹{{ }} 
< codehtml >
  <br/>
< /codehtml >
```

不过这样还有个问题在于，代码块里写HTML，代码不能被屏蔽……暂时找不到好的解决办法，先这样吧。

> 新的空白行写法！发现换行后Tab+Enter可以写出空白行，再见吧Html标签！

> 9.26更新：[解决了！](https://www.w3school.com.cn/cssref/pr_list-style-type.asp)在assets/scss/partials/comments/disqusjs.scss中修改
>
> ```
> #dsqjs ol,#dsqjs ul {
>     list-style: none;
>     list-style-type: decimal // 定义为数字
> }
> ```
>
> <div style="color:#F00">用红色表示欢欣鼓舞！</div>

[Hugo短代码介绍文档](https://www.andbible.com/post/hugo-content-management-shortcodes/)

[Goldmark介绍](https://www.modb.pro/db/87166)

{{< codehtml >}} 
  <br/>
{{< /codehtml >}}

## 头像与站点描述居中显示

`assets\scss\partials\sidebar.scss`

```
	.site-avatar {
        position: relative;
        margin-left:auto; //站点头像居中
		margin-right:auto; //站点头像居中
        width: var(--sidebar-avatar-size);
        height: var(--sidebar-avatar-size);

	.site-name {
        color: var(--accent-color);
        text-align:center; //站点名称居中
        font-size: 1.8rem;

        @include respond(2xl) {
            font-size: 2rem;
        }
    }

	.site-description {
        color: var(--body-text-color);
        font-weight: normal;
        text-align:center; //站点描述居中
        font-size: 1.6rem;

        @include respond(2xl) {
            font-size: 1.7rem;
        }
    }
```

{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

## 修改分类颜色

这个东西众里寻他千百度找不到，结果就在`content\categories`里，像个冷笑话。

在categories文件夹创建分类同名文件夹，创建`_index.md`文件

```
title: "做猫贵在折腾" //分类名称
description: "简介 Blablabla" //不需要可以删了
image: "ffxiv_20210830_230509_817.png" //分类题图，也可以删了
style:
    background: "#80aba9" //分类标签底色
    color: "#fff"
---
```

另外一个新发现！在`_index.md`指定`Titie`后，会一次性修改全部的分类名称，不需要再逐个修改，换分类名爱好者大喜过望！   
<br/>  

## 修改超链接显示



```
a {
    text-decoration: none;
    color: var(--accent-color);

    &:hover {
        color: var(--accent-color-darker);
    }

    &.link {  //鼠标未悬停时，超链接显示6px的高亮
        box-shadow: 0px -7px 0px rgba(var(--link-background-color), var(--link-background-opacity-hover)) inset; 
        transition: all 0.3s ease;

        &:hover { //鼠标悬停，高亮为10px
            box-shadow: 0px -11px 0px rgba(var(--link-background-color), var(--link-background-opacity-hover)) inset; 
        }
    }
}
```

{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

## 修改文章标题前提示块

……我也不知道叫它什么比较好，总之是比较喜欢它长一点，修改`assets\scss\variables.scss`

```
    --heading-border-size: 10px; 
```

​	顺便删掉引用块里左侧的一小条竖线

```
--blockquote-border-size: 0px;
```

​	



## 修改Toc样式

原来的目录行间距太宽，超出一定长度还会出现滑块，调整了一下。

```
.widget--toc {
    background-color: var(--card-background);
    border-radius: var(--card-border-radius);
    box-shadow: var(--shadow-l2); //修改阴影样式
    display: flex;
    flex-direction: column;
    color: var(--card-text-color-main);
    overflow: hidden;
    display:inline-block; //根据内容调整宽度

    #TableOfContents {
        overflow-x: auto;
        max-height: 150vh; //控制最长高度，超出则出现滑动条

        ol,
        ul {
            margin: 10; //应该是上下边距
            padding: 0;
        }

        ol {
            list-style-type: none;
            counter-reset: item;

            li:before {
                counter-increment: item;
                content: counters(item, ".") ". ";
                font-weight: bold;
                margin-right: 5px;
            }
        }

        & > ul {
            padding: 0 1em;
        }

        li {
            margin: 5px 20px; //第一个参数是行间距，第二个是卡片周边的宽度
            
            padding: 6px; //控制内边距

            & > ol,
            & > ul {
                margin-top: 10px;
                padding-left: 10px;
                margin-bottom: -5px;

                & > li:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
}
```

​	

## 加入字数统计

`layouts\partials\article\components\details.html`

```
        {{ if .Site.Params.article.readingTime }} //偷懒直接用阅读时间改的
            <div>
                {{ partial "helper/icon" "brush" }} //图标路径为assets\icons
                <time class="article-words">
                    {{ .WordCount }}字
                </time>
            </div>
```

然后在`config.yaml`中加入一行，以正确显示中文字符数量

```
hasCJKLanguage: true
```
{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

## 调整代码块样式

### 代码高亮

……这高亮怎么就是显示不出来呢

参考了[设置 Hugo 的代码高亮](https://dp2px.com/2020/05/29/hugo-highlighting/)，在config.yaml中做以下设置

```
markup:
	highlight:
		codeFences: true //代码围栏功能，一般设为true
		guessSyntax: true //猜测语法，设置为true后自动匹配可能的语法
		hl_Lines: "" //从第几行开始高亮，一般不设置
		lineNoStart: 1 //行号从编号几开始显示
		lineNos: ture //是否显示行号
		lineNumbersInTable: true //是否使用表来格式化行号和代码，一般设为true，设置true后页面的代码框就不再接连整个文章页面了，但是copy模块会只会复制行号，不知道为什么
		noClasses: true //使用class标签，设为false后代码框背景消失
		style: native //样式风格
		tabWidth: 4 //代码缩进字符数
```

设置后的一些问题非常明显，因此暂时没动，先保存在这里，看看之后能不能解决。

​		

### 代码块自动换行

`assets/scss/partials/layout/aritcle.scss`

```
    pre {
        overflow-x: auto;
        display: block;
        background-color: var(--pre-background-color);
        color: var(--pre-text-color);
        font-family: var(--code-font-family);
        line-height: 1.428571429;
        word-break: break-all;
        padding: var(--card-padding);
        white-space: pre-wrap; //长代码自动换行适应页面
        word-wrap: break-word; //允许长单词或 URL 地址换行到下一行
```

​	

### 修复代码出框

在小尺寸屏幕上，如果单行代码过长，会出框一部分并无法显示。

`assets/partials/layout/article.scss`

```
    code {
        color: var(--code-text-color);
        background-color: var(--code-background-color);
        padding: 2px 4px;
        border-radius: var(--tag-border-radius);
        font-family: var(--code-font-family);
        word-wrap: break-word; //允许长单词或 URL 地址换行到下一行
        
    }
```

<br/>



## 增加网站Icon

参考了主题的issue：[配置favicon后，只有首页显示favicon](https://github.com/CaiJimmy/hugo-theme-stack/issues/272)

将Icon命名为`favicon.png`，放在根目录的`/static/img`文件夹中，主题没有自带这个文件夹，需要新建。

然后在`config.yaml`修改`favicon`参数

```
favicon: /img/favicon.png 
```

注意路径的写法，如果写为`img/favicon.png`就会出现只有首页显示Icon的情况。 

{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

## 修改网站字体

### 修改正文字体

参考[例子：给文章加上思源宋体](https://docs.stack.jimmycai.com/zh/modify-theme/example-custom-font-family.html)

在站点根目录新建文件 `layouts/partials/head/custom.html`并放置代码，但作者给的字重非常不好，文字看起来让人很难受，把正文字重改到300会好很多，最终使用的代码是：

```
<style>
    :root {
        --article-font-family: "Noto Serif SC", var(--base-font-family);
    }
</style>

<script> //正文字重300，标题字重700
		(function () {
		    const customFont = document.createElement('link');
		    customFont.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;700&display=swap"; 
		    customFont.type = "text/css";
		    customFont.rel = "stylesheet";
		
		    document.head.appendChild(customFont);
		}());
</script>
```

{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

### 修改全站字体

根据主题文档，修改`assets\scss\variables.scss`

```
    --sys-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Droid Sans", "Helvetica Neue";
    --zh-font-family: "Noto Serif SC", "Hiragino Sans GB", "Droid Sans Fallback", "Microsoft YaHei";
    --base-font-family: "Noto Serif SC", var(--sys-font-family), var(--zh-font-family), sans-serif;
    --code-font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
```

将`--zh-font-family:`和`--base-font-family:`都换成`"Noto Serif SC"`

……觉得很有意思，这部分起先我一直不知道怎么做，非常苦恼，后来灵光突现，去翻了自己在18年在Hexo Blog里记的修改全站字体笔记，一时豁然洞开。

{{< codehtml >}} 
    <br/>
{{< /codehtml >}}

## 文章按年份分类

之前的文章都是放在Post文件夹中，文件名以年月日开头，这样文章多了就会比较乱，正好在整理Blog，顺便就改了一下。

在`config.yaml`中修改`post`参数

```
post: /:year/:slug/
```

   现在的链接格式为`mantyke.icu/2021/slug参数`


​    



## 配置站点图标

根据[主题文档-配置图标](https://docs.stack.jimmycai.com/zh/configuration/custom-menu.html)，Stack主题使用[Tabler Icons](https://tablericons.com/)图标库，并使用`pre` 字段来进行指定……一切都很好，但问题来了，Tabler Icons不提供SVG文件下载。

研究了一会，找了个[转换程序](https://www.svgviewer.dev/)来解决这个问题。

暂时先改了Friends和字数统计，剩下的看心情之后慢慢改。

{{< codehtml >}} 
    <br/>
{{< /codehtml >}}



## 站点总字数统计

放置位置在`layouts\partials\footer\footer.html`，顺便一提，站点上线时间统计也放在这里——上个月前写“在合适位置放置”，这个月找到失去神智，是我坑我自己。

最终是这么写的，参数和代码参考的是[Hugo 总文章数和总字数](https://immmmm.com/hugo-total-count/)

    <section class="copyright">
        &copy; 
        {{ if and (.Site.Params.footer.since) (ne .Site.Params.footer.since (int (now.Format "2006"))) }}
            {{ .Site.Params.footer.since }} - 
        {{ end }}
        {{ now.Format "2006" }} 小球飞鱼·<i class="fas fa-bell"></i> <a id="days">0</a>Days<br>共嘟嘟了 {{$scratch.Get "total" }}字·共 {{ len (where .Site.RegularPages "Section" "post") }}篇文章</br><span><p>
    </section>

记得要在`layouts\partials\footer\footer.html`里写上总字数参数

```
{{$scratch := newScratch}}
{{ range (where .Site.Pages "Kind" "page" )}}
    {{$scratch.Add "total" .WordCount}}
{{ end }}
```

利用`<br/>`和`<p>`来进行换行调整，另外`小球飞鱼`的地方本来是`{{ .Site.Title }}`，但是我为了美观起见把站名中间加了空格，引用过来反而不美观了，于是删掉换成直接写，我好聪明。

​	

