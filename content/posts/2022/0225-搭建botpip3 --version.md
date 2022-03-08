---
title: "Tools | 最近的赛博舒适区搭建小记"
date: 2022-02-20T18:01:47+08:00
description: 写一写最近常用的一些数字工具
tags:
  - Tools
categories:
  - 做猫贵在折腾
draft: true
slug: Cyber-Tools
---

```
 mkdir miniconda //创建miniconda文件夹
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



## 安装Bot

```
git clone https://github.com/casouri/weibo2mast.git //下载weibo2mast库
cd weibo2mast //进入weibo2mast文件夹
conda create -n mastbot python=3.8 //创建一个叫mastbot的版本为3.8的python虚拟环境
conda activate mastbot //激活mastbot环境，root账号前会出现（mastbot）
```

地方

```
{
    "user_list": [
        {
            "id": 1740250437,
            "comment": "中图网官方微博"
        },
        {
            "id": 1587362207,
            "comment": "上海译文"
        },
        {
            "id": 1345667185,
            "comment": "广西师大出版社"
        },
        {
            "id": 1647172887,
            "comment": "译林出版社"
        },
        {
            "id": 2518820285,
            "comment": "广西师大出版社新民说"
        },
        {
            "id": 7356938118,
            "comment": "上海译文出版社旗舰店"
        }
    ],
    "mastodon_instance_url": "https://toot.mantyke.icu",
    "toot_len_limit": 3000,
    "max_attachment_count": 9,
    "include_repost": true,
    "include_post_url": true,
    "external_media": false,
    "standalone_repost": true
}
```

```

[
    {
        "id": 1740250437,
        "comment": "中图网官方微博",
        "token": "IBIQj4aFtzhMlmLIZnEhH3rCUquBo5BAa5OgaeuQgmI"
    },
    {
        "id": 1587362207,
        "comment": "上海译文",
        "token": "IBIQj4aFtzhMlmLIZnEhH3rCUquBo5BAa5OgaeuQgmI"
    },
    {
        "id": 1345667185,
        "comment": "广西师大出版社",
        "token": "IBIQj4aFtzhMlmLIZnEhH3rCUquBo5BAa5OgaeuQgmI"
    },
    {
        "id": 1647172887,
        "comment": "译林出版社",
        "token": "IBIQj4aFtzhMlmLIZnEhH3rCUquBo5BAa5OgaeuQgmI"
    },
    {
        "id": 2518820285,
        "comment": "广西师大出版社新民说",
        "token": "IBIQj4aFtzhMlmLIZnEhH3rCUquBo5BAa5OgaeuQgmI"
    },
    {
        "id": 7356938118,
        "comment": "上海译文出版社旗舰店",
        "token": "IBIQj4aFtzhMlmLIZnEhH3rCUquBo5BAa5OgaeuQgmI"
    }
]
```

```
{
  "user_list": [
    {
      "id": 6048193311,
      "comment": "知任"
    },
    {
      "id": 6578279612,
      "comment": "任地域"
    }
  ],
  "include_repost": true,
  "standalone_repost": true,
  "include_post_url": false,
  "mastodon_instance_url": "https://mastodon.social",
  "toot_len_limit": 500,
  "max_attachment_count": 4,
  "delete_after_days": 3
}
```

```
ps -ef | grep python
查看python进程
```

```
find / -name 'weibo2mast' -type d
```

错误解决：

运行：

报错：

```
python xpost.py
Traceback (most recent call last):
  File "/root/miniconda/weibo2mast/xpost.py", line 15, in <module>
    from mastodon import Mastodon, MastodonError, MastodonAPIError, MastodonNotFoundError
ModuleNotFoundError: No module named 'mastodon'
```

解决：

```
pip3 install Mastodon.py
```

```
Traceback (most recent call last):
  File "/root/miniconda/weibo2mast/xpost.py", line 18, in <module>
    import weibo
  File "/root/miniconda/weibo2mast/weibo.py", line 21, in <module>
    from lxml import etree
ModuleNotFoundError: No module named 'lxml'
```

```
pip install lxml
```

报错：
```
Traceback (most recent call last):
  File "/root/miniconda/weibo2mast/xpost.py", line 520, in <module>
    records = cross_post(post, mast_dict, config, db)
  File "/root/miniconda/weibo2mast/xpost.py", line 143, in cross_post
    upload_media(url_list[:max_attatchment])
  File "/root/miniconda/weibo2mast/xpost.py", line 96, in upload_media
    if len(url_list) > max_attatchment:
NameError: name 'max_attatchment' is not defined
```

报错
```
Traceback (most recent call last):  File "xpost.py", line 520, in <module>    records = cross_post(post, mast_dict, config, db)  File "xpost.py", line 127, in cross_post    external_media = get_user_option(user_id, 'external_media', config)  File "xpost.py", line 270, in get_user_option    return config[option]KeyError: 'external_media'
```
此方教了两种解决办法：
1. 在`xpost.py`文件中注释`external_media = get_user_option(user_id, 'external_media', config)`
2. 在`config.json`中添加`"external_media": false`
最后用了第二种，运行时会从config中读取到external_media为false，从而顺利运行。

```
[PROXY]

ProxyOn = false

HttpProxy = http://127.0.0.1:7890

HttpsProxy = https://127.0.0.1:7890

[MASTODON]

BaseUrl = https://toot.mantyke.icu/

# register your application here: https://hello.2heng.xin/settings/applications

AccessToken = IBIQj4aFtzhMlmLIZnEhH3rCUquBo5BAa5OgaeuQgmI

# 'direct' - post will be visible only to mentioned users

# 'private' - post will be visible only to followers

# 'unlisted' - post will be public but not appear on the public timeline

# 'public' - post will be public

TootVisibility = public

IncludeVideo = false

SourcePrefix = :icon_weibo:

ExternalLinkPrefix = :sys_link:

VideoSourcePrefix = :sys_video:

[WEIBO]

WeiboRss = https://rsshub.mantyke.icu/weibo/user/1647172887
WeiboRss = https://rsshub.mantyke.icu/weibo/user/7356938118
```