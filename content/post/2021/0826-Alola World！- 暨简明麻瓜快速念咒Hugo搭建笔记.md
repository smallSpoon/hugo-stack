---
title: Alola World | 暨简明麻瓜快速念咒Hugo搭建笔记
description:
  - 简明麻瓜快速念咒Hugo搭建笔记
toc: true
tags:
  - Hugo
categories:
  - 甘普基本变形定律
series:
date: 2021-08-26T02:06:09+08:00
lastmod: 2021-08-26T02:06:09+08:00
featuredImage:
draft: false
slug: f185ce41
description: 一场独一无二的惊险之旅，带来心跳万分的刺激体验，我们保证，没有麻瓜因此受到伤害
---
本次小组作业使用的基本教材为：[Hugo中文文档](https://www.gohugo.org/)，教辅资料见文中涉及部分。 

​	



## 起始

2018年自己搭过Hexo blog，爱不释手，零零散散写过二十来篇文章（大部分是de很蠢的bug），后来因为倒腾插件加上各种新旧版本问题，导致每次修改和部署都要面对一串溢出屏幕的警告，速度也慢，慢慢就不爱用了。  

前段时间有了发长文章的需求，四处寻觅平台后发了notion，总觉得有几分不得劲。重新打开旧blog来看，发现里面掺了几篇月度总结，过去太久，彼时心情全数忘怀，读起来倒有几分意思。立刻想起这段时间里听说过的诸多新平台，折腾之心蹿起，从WP开始一路试到Gridea，最后定下来用Hugo重新搭一个站。

站点名字是从宝可梦图鉴里选的，小球飞鱼是亲近人类的宝可梦，人们会组成观光团，在海上观赏它们与朋友之间互相嬉戏的情景，这一幕又甜美又浪漫，我很喜欢。  

这篇文章主要是讲一下搭建过程和搭建过程里踩过的坑，JK罗琳的魔法世界中曾经描述哑炮们想要通过学习快速念咒函授教程来掌握魔法能力，如今来看，编程知识（可以这么说吗？）就像是麻瓜们的魔法，因而如此取名。  

​	



## 流程

Hugo搭站的流程在我看来是比Hexo简单很多的，分为如下几个步骤  

1. **默写甘普基本变形定律：** 申请Github账号、建立Blog仓库，下载Git，配置SHH密钥，并找到一个喜欢的Hugo主题
2. **一挥一抖，记住，一挥一抖**：下载Hugo，设置环境变量，通过命令启动Hugo搭建blog，为Blog载入主题。
3. **羽加—迪姆 勒维—奥—萨：** 部署Blog至github仓库，尝试打开。

接下来我会逐条记录我在每个过程中做了什么，这些步骤是我从各个教程当中阅读并学习的，我本人没有任何相关知识基础，仅凭着直觉进行理解和使用，因此一定会有错漏之处，如果有朋友发现了它，欢迎指出或者帮忙改正。

​	



### 默写甘普基本变形定律

搭建之前，首先需要理解：Hugo是什么？为什么需要先准备一个Github仓库？  

阅读各个教程和文档后，我尝试描述如下：  

Hugo是一个**静态网页生成器**，它可以将本地储存的内容经过一定编译后生成数个静态网页。生成之后，我们就需要将静态网站推送到某个服务器，使用服务器提供的静态托管服务来通过域名直接打开它，提供这种静态网站托管服务的，就是Github。

静态网站托管服务并不唯一，腾讯云、码云、Gitlab等托管平台都可以实现这个功能。相比较而言，我使用的程度比较轻，倾向于免费服务，Github免费，且我比较熟悉操作，因此成为了最终选择。

 		

​	





#### 申请账号，建立Github仓库

打开[Github](https://github.com/)网页，注册一个账号。如果不打算自己购买域名的话，最终Blog域名会和Github账号名保持一致，因此比较推荐注册一个新的Github账号。

注册之后，点击创建一个新的repository，这里比较需要注意两个地方

> 1.  Repository name的格式为 **“github账号名.github.io”** ，这也是之后访问Blog的链接。例如我的Github账号是“Mantyke”，我就在repository name处写下“Mantyke.github.io”，剩下的不用管，直接点Create repository。
> 2. 创建repository之后，在**Quick setup**的部分，将网址换成SSH网址（以git@github.com开头）。之后部署的时候要用到。

​	



#### 下载Git

Github注册告一段落，然后来配置Git，Git是一种分布式版本控制系统，用来对文件进行版本管理，看不懂也没关系，只需要知道之后一部分命令要通过“Git bash Here”来进行执行就行了。

如果有进一步学习的需求，我读了两个帮助比较大的指南：

[1.3 起步-Git是什么](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-Git-%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F)

[连猴子都能懂的Git指南](https://backlog.com/git-tutorial/tw/intro/intro1_1.html)

囫囵吞枣能用就行的话，在[Git官网](https://git-scm.com/)下载相应的程序，然后闭着眼一路下一步，安装完成就可以了。

​	

####  生成SSH密钥

用麻瓜理解来解释的话，SSH密钥的作用是链接本地和Git服务器，它成对生成，分别是”公钥“和”私钥“，我们将其中的”公钥“保存到Git仓库后，就可以在电脑上向这个Git仓库提交代码。正经靠谱的解释可以看这个：[SSH 秘钥Key的简介以及生成和使用](https://blog.csdn.net/hsd2012/article/details/79469747)

安装Git之后，在桌面点开Git图标，或者右键任意地方，选择“Git Bash Here”，在弹出的命令行窗口里输入

`$ ssh-keygen -t rsa -C "这里我输入的是github账号注册时使用的邮箱"`

之后系统会提示是否需要指定密钥位置、是否输入密码，这里可以按需输入，也可以直接一路回车，之前配置Hexo blog的时候我是输入了密码的，后来想想，我的电脑只有我一个人会使用，好像也没什么使用密码的必要。一路回车过后，系统会显示一系列语句，其中看到

```
Your identification has been saved in id_rsa.
Your public key has been saved in id_rsa.pub.
```

就是密钥已经生成成功了。



​	

这里我其实遇见到了两个问题，一个是我之前在这台电脑上搭过Hexo blog，曾经生成过一次密钥——但是！我设置了密码！！还忘记了！！密码是什么！！！不仅是这个，我的直觉告诉我，一个本地仓库对应两个Github的仓库，可能要出事……所以我去找了下怎么让多个SSH密钥分别链接不同的Github仓库：[多个SSH密钥并存且连接到Github](https://kangzhiheng.top/post/11-more-ssh-in-one-laptop/)

但显而易见，我研究半晌，发现自己没有这个脑子……最后只好暴力解决，一想左右Hexo那个Blog该存的修改我也存了，之后想再用也能轻松复制一个出来，我就直接把之前的密钥删了。

删除密钥的办法也很暴力，在`C:\Users\用户名\.ssh`文件夹找到之前的密钥文件，右键删除，然后再输入检查是否存在SSH密钥的命令`ls -al ~/.ssh`确认一下。

另一个问题是，生成密钥后，遇见了报错

```
The authenticity of host 'github.com (192.30.255.112)' can't be established.
```

这是因为密钥文件应当是三个，分别是公钥`id_rsa.pub`，私钥`id_rsa`，另外一个叫做`known_hosts`，可能是因为之前的解决方法比较暴力，这个文件没有被生成出来，或者连带着被我删掉了。

解决方法也很简单，报错时会一并显示`Are you sure you want to continue connecting (yes/no)?`，输入yes即可。

​	



#### 将公钥与服务器链接

首先要找到公钥，公钥的地址是`C:\Users\用户名\.ssh\id_rsa.pub`，右键用记事本打开，复制里面的全部内容。

打开Github账号，右上角头像-Settings，在左边找到`SSH and GPG keys`选项，新建一个SSH密钥，标题可以随便填，把之前复制的密钥内容粘贴进去，保存。

验证是否绑定成功可以用这个命令：`ssh -T git@github.com`

之后使用的时候，第一次可能会跳出窗口，询问Github用户名等信息，应该只会出现一次。或者直接在命令行中输入

```
git config --global user.name "账号名"
git config --global user.email "邮箱"
```

进行绑定。

​	



### 一挥一抖，记住，一挥一抖

### 下载Hugo

做了这么多，其实都是事先准备的工作，准备充分之后，进入网站搭建的过程，Hugo安装起来相当容易，点击下面的下载地址往下拖，下载自己适合的安装包，现在最新的版本是V0.87.0。

[Hugo下载地址](https://github.com/gohugoio/hugo/releases)

​	



#### 配置环境变量

下载并解压后，打开文件夹，把其中`Hugo.exe`这个文件拖到你想建立Blog文件夹的地方，推荐是单独建立一个文件夹，里面只放`Hugo.exe`这一个文件，然后开始配置环境变量。

这里为什么要配置环境变量我其实没太明白，似乎是和Hugo本身是个二进制文件有关系。但不求甚解也可以，这一步很简单，只要跟着做就好了。

> 8.30更新：我明白这里为什么要设置环境变量了，参见[搭建Hugo时需要注意的坑](https://ripple-zjw.github.io/2019/%E6%90%AD%E5%BB%BAhugo%E6%97%B6%E9%9C%80%E8%A6%81%E6%B3%A8%E6%84%8F%E7%9A%84%E5%9D%91/)，我理解这就像一个默认设置，告诉系统每次输入`hugo`指令的时候，启动的是`hugo.exe`这个程序

1. 点开`控制面板`，在控制面板中找到`系统`
2. 点击`高级系统设置`，在`高级`分页中最下面，找到`环境变量`
3. 找到`Path`变量，编辑变量，在弹出的窗口中选择新建，输入之前放置`Hugo.exe`文件的文件夹路径

最后打开Git Bash Here输入

```
hugo version
```

返回Hugo版本号信息，说明配置成功。

```
hugo v0.87.0-B0C541E4 windows/amd64 BuildDate=2021-08-03T10:57:28Z VendorInfo=gohugoio
```

​	

#### 建站！大功告成！

到了这一步，已经可以建站了！

打开之前Blog文件夹，右键打开Git Bash Here，输入

```
Hugo new sit 随便给站点文件夹起一个名字
```

返回如下代码就大功告成。

```
Congratulations! Your new Hugo site is created in 你blog的地址

Just a few more steps and you're ready to go:

1. Download a theme into the same-named folder.
Choose a theme from https://themes.gohugo.io/ or
create your own with the "hugo new theme <THEMENAME>" command.
2. Perhaps you want to add some content. You can add single files
with "hugo new <SECTIONNAME>\<FILENAME>.<FORMAT>".
3. Start the built-in live server via "hugo server".

Visit https://gohugo.io/ for quickstart guide and full documentation.
```

​	



#### 等等，真的大功告成了吗？

是不是少了点什么？少了一点，花里胡哨的东西……

Hugo建站是不自带主题的，我们得自己找一个出来。我使用的主题是[Hugo Eureka](https://www.wangchucheng.com/zh/docs/hugo-eureka/)，主题文档内说明了下载主题的方式，下载了[GO](https://golang.org/) 之后，在Blog文件夹内执行

```
git submodule add https://github.com/wangchucheng/hugo-eureka.git themes/eureka
```

程序自动就会下载主题到文件夹，之后按照文档说明，将e`xampleSite`中的`config`文件夹复制到项目根目录下，就安装好了主题。

（但其实我观察了一下，安装主题的办法五花八门，自己新建一个`themes`文件夹然后从Github上直接下载主题文件复制进去搞不好也行……）

> 2021-9-5更新：
>
> 参考《HUGO | 用Vercel完成blog自动化部署》，我更建议用直接下载项目文件然后复制到`themes`文件夹的方式来完成Blog主题安装，原因是如果使用`git submodule`，将Blog源代码上传到Github仓库的时候，Github会识别主题文件自动建立跳转到作者的主题仓库，或者识别为一个子模块（文件夹上显示一个白色箭头）。如果之后用Vercel等类似的服务来进行自动部署，会导致报错。

我比较喜欢的其他Hugo主题：

[hugo-theme-nuo](https://github.com/laozhu/hugo-nuo)

[hugo-theme-hyde](https://github.com/spf13/hyde)

[hugo-theme-yinyang](https://github.com/joway/hugo-theme-yinyang)

[hugo-theme-zozo](https://github.com/varkai/hugo-theme-zozo)

[hugo-theme-pure](https://github.com/xiaoheiAh/hugo-theme-pure)

​	



来看看我们的主题是否安装成功了吧！打开Git，输入：

```
hugo server
```

顺利的话，会返回：

```
Start building sites …
hugo v0.87.0-B0C541E4 windows/amd64 BuildDate=2021-08-03T10:57:28Z VendorInfo=gohugoio

                   | EN
-------------------+-----
  Pages            | 32
  Paginator pages  |  0
  Non-page files   |  0
  Static files     |  0
  Processed images | 14
  Aliases          |  6
  Sitemaps         |  1
  Cleaned          |  0

Built in 137 ms
Watching for changes in 你的blog文件夹{archetypes,content,data,layouts,static,themes}
Watching for config changes in 你的blog文件夹\config.toml, E:\Hugo\Mantyke\config\_default
Environment: "development"
Serving pages from memory
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at //localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

在浏览器中键入`localhost:1313`，可以打开预览界面，看到Blog的雏形。预览页面会实时反映对Blog的修改，如果要停止预览，按下`Ctrl+C`

​	



### 羽加—迪姆 勒维—奥—萨

> 千万别忘了巴鲁费奥巫师，他把‘f’说成了‘s’，结果发现自己躺在地板上，胸口上站着一头野牛。

强烈建议安装主题成功后复制一份Blog文件夹作为备份，接下来要进行的是Blog的部署，也就是将本地文件推送到Github服务器，是我踩坑最多的地方。在实际操作中，前面的一整套流程我只花了大约一小时梳理和实践，部署花费的时间则是前期工作的三倍以上。其中大部分的时间都消耗在寻找问题所在和寻求补救办法，最终炸站重来上。及时备份可以省去大量不必要的精力花费。

**强调！！** 这一部分我还有非常大的疑惑和不确定（前面也有，但这一部分尤其不确定），因此以下内容都是我自己的理解笔记，它并不很靠得住，请以这样的认知继续阅读。

​	



#### 大致流程

部署之前来说一下我理解的大致流程：

Hugo生成网页的流程是：输入`Hugo`指令，Hugo开始生成静态页面，静态页面被生成在`public`文件夹中。

部署时，我们首先使用`git add`指令，设定服务器节点，加入索引，接着使用`git commit -m`指令提交更新，最后通过`git push -u origin master`指令将更新推送到指定服务器的指定分支。在推送过程中尤其需要注意的是，与Hexo不同，Hugo 不应当推送整个Blog文件夹的文件，**只需要推送Public文件夹中被生成出来的部分。**

接下来一步一步操作：

​	



#### 切换到Public

```
cd public
```

将目录切换到Public这个文件夹中，非常重要，我以Hexo的做法，习惯性以为推送到Github的是整个Blog文件夹，忽略了这一步，浪费了两三个小时。

 		

​	





#### 初始化Git仓库

```
git init  //只输入这一行
Reinitialized existing Git repository in blog文件夹地址 //返回的结果
```

git init是一个初始化Git仓库命令，之后如果搞砸了不妨先初始化看看，有很大概率可以直接重来。

然后可以回到Github仓库看一眼，这里涉及到一个分支问题，进入Github中之前建立的Blog仓库，点击Setting，选择左边的Branches，看右边的Default branch是否为“Master”，这里的意思是，之后推送的内容，会默认推送到“Master”这个预设分支当中，需要和之后的推送命令对应。（有一部分教程为了之后做自动化方便，会设置这里推送到main或其他分支，我没看懂自动化怎么做，暂时先按下不谈，就用默认的分支）

 	

​	



#### 添加远端服务器

```
git remote add blog 你github仓库的地址
```

这一步的作用应该是（我不太确定）将Github仓库作为远端服务器进行添加。有一部分教程中写这一句是

```
git remote add origin https://github.com/<使用者名稱>/<使用者名稱>.github.io.git
```

我疑惑了很久，其实两者在这里并没有区别，git remove add的意思是是添加远端服务器，origin这个位置是指代远端服务器的名称，origin是Git默认的名字。

另一个需要特别注意的点是，在origin后应当跟Github仓库的链接，这里理论上无论使用Https链接还是使用SSH链接都可以，但实际操作中，（由于我还不清楚的原因），Https链接无法使用，我在这里只能使用SSH链接（就是建好仓库后在Quick setup部分显示的链接），以git@github.com开头

 	

​	





#### 建立索引

```
git add .
```

一定记住后面那个点，后面有个点（瘫倒）

也有人写`git add -A`，加上-A就是指一次性加入所有变更，我研究了下，和`git add .`应该没什么区别



​	

#### 提交更新

```
git commit -m "first commit"
```

这部分的"first commit"写什么都可以，只是一个自定义信息，说明这次提交了什么。git commit -m是指”提交信息“，这里一定要加上-m，否则会启动一个提交修改信息的编辑器。

> 當完成了這個動作後，對 Git 來說就是「把暫存區的東西存放到儲存庫（Repository）裡」，翻譯成白話文就是「我完成一個存檔（或備份）的動作了」

 

​	

#### 推送到Github

```
git push -u origin master
```

这个指令是告诉Git，把之前存储的内容推送到远端服务器，origin是Git默认远端服务器的名字，master是默认的分支名字。

到了这一步，顺利的话，它会顿一下然后告诉你推送成功，刷新Github仓库会看到之前在Public文件夹的文件已经被推送到Github仓库，过一会在浏览器中输入Blog链接，就可以顺利看到Blog的内容。这回是真的大功告成了。

​	





#### 参考链接

这里大概罗列一下我查过的一些页面，以供日后学习

[手把手教學: 將Hugo部落格佈署到Github上](https://yurepo.tw/2021/03/%E5%A6%82%E4%BD%95%E5%B0%87hugo%E9%83%A8%E8%90%BD%E6%A0%BC%E9%83%A8%E7%BD%B2%E5%88%B0github%E4%B8%8A/)

[部署Hugo個人網頁至GitHub](https://ianjustin39.github.io/ianlife/build-blog/deploy_hugo_on_github/)

[git add、git commit - 提交版本](https://w3c.hexschool.com/git/b9be5b1e)

[git remote add - 添加遠端數據庫](https://w3c.hexschool.com/git/fd426d5a)

[Git 版本控制系統 - 遠端數據庫託管與操作](https://awdr74100.github.io/2020-04-18-git-remote/)

[Git 版本控制筆記 - 在 Git 提交(commit)檔案](https://blog.jaycetyle.com/2018/02/git-commit/)

[再談 Git Remote](http://wen00072.github.io/blog/2016/01/24/talk-more-about-git-remote/)

[Git教學：如何 Push 上傳到 GitHub？](https://gitbook.tw/chapters/github/push-to-github.html)

[把檔案交給 Git 控管](https://gitbook.tw/chapters/using-git/add-to-git.html)

[十分钟学会git基础](https://www.jianshu.com/p/a35eb329fcfd)

[2.5 Git 基礎 - 與遠端協同工作](https://git-scm.com/book/zh-tw/v2/Git-%E5%9F%BA%E7%A4%8E-%E8%88%87%E9%81%A0%E7%AB%AF%E5%8D%94%E5%90%8C%E5%B7%A5%E4%BD%9C)

[2.5 Git 基础 - 远程仓库的使用](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E7%9A%84%E4%BD%BF%E7%94%A8)

[git - “git push”和 “git push origin master”有什么区别？](https://www.coder.work/article/190667)

​	





#### 一些小撇步

其实这段本来应该是“踩过的坑”，记录一下在部署Github的过程中遇见过的Bug，但休息了一会后回看上面的部分，发现基本都有强调，单开一段来说犯错过程显得有些多余了。

我主要遇见的问题就是错误地认为Hugo的推送和Hexo一样，都是推送整个Blog文件夹，在找问题和补救的过程中，又把根目录和Public文件夹同时链接到了远端服务器，导致推送失败。

这部分求助朋友之后，发现其实可以通过本地文件检查出来。打开根目录或者Public目录的`.git`文件夹，找到`config`文件打开，检查代码中的`remote`和`branch`部分，实在不行直接把根目录中的指向删掉也可以。

另一个解决办法是使用`git remote rm origin`来移除本地分支，但我用起来感觉比较玄学，不太好用……

所有问题的终极解决办法是使用`git init`和之前备份好的文件包，更终极的解决办法是删掉本地Blog文件夹重新建站，同时删掉Github仓库重建一个。

不得不说，这也是我喜欢这种静态网页生成器的一大原因：重启永远是解决问题的良好手段。

​	





## 最后

最后当然就是售后服务，学一下之后怎么更新blog，说起来我一直很奇怪，这部分大部分教程里都没有提到，是所有人都在用自动部署吗？

但是我实在没搞懂怎么自动部署，读了半天只大致理解了在做什么，实际操作上还是不太开窍，搞砸几次之后就手动着来了，这部分是毛象朋友Suica教我的，在建站和装修过程中得到过好多人的帮助，我真的非常幸运。

> 1. 删除public文件夹中，除了`.git`之外的所有文件（.git是一个隐藏的文件夹，没有进行相关设置的话，也可能看不到）（Suica说如果使用了自己的域名的话，也可能有`_config.yml`、`CNAME`、`README.md`这些文件，如果有的话，也不要删掉。）
>
> 2.  hugo server`确认本地效果，之后`Ctrl+C`退出。依次输入以下代码，引号内内容可以随便改。
>
> ```
> hugo 
> cd public
> git add -A
> git commit -m "new blog added" 
> git push -u origin master
> ```
>
> 4. 没问题的话，过一会儿刷新，就可以看到内容被更新到了网页上。
>



​	



好了就写到这里，呱唧呱唧！



​	

