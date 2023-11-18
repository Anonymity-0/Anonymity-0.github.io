---
title: "Gpt Academic本地配置"
description: 
date: 2023-11-18T17:09:33+08:00
image: 
math: 
license: 
hidden: false
comments: true
draft: false
categories:
    - 杂七杂八
---

项目地址 [GitHub - binary-husky/gpt\_academic: 为ChatGPT/GLM提供实用化交互界面，特别优化论文阅读/润色/写作体验，模块化设计，支持自定义快捷按钮&函数插件，支持Python和C++等项目剖析&自译解功能，PDF/LaTex论文翻译&总结功能，支持并行问询多种LLM模型，支持chatglm2等本地模型。兼容文心一言, moss, llama2, rwkv, claude2, 通义千问, 书生, 讯飞星火等。](https://github.com/binary-husky/gpt_academic)





## api配置

### openai-api
因为已经有了gpt账户，所以直接在[OpenAI Platform](https://platform.openai.com/api-keys)上生成一个key就可以了。注意这个key只能看一次。
![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.6mcgr8hihls0.webp)

### azure-api

#### 注册
因为注册azure本身需要信用卡，本来不想注册的，突然看到一个博客说azure学生认证之后可以不需要信用卡，试了一下果然可以。注册之后秒通过，科大邮箱还是靠谱的。
注册可以参考[学生福利白嫖之路——申请Azure学生订阅 - 知乎](https://zhuanlan.zhihu.com/p/629311513)

#### 配置

1. 在搜索栏搜索Openai，然后创建
	![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.1vnx1e5dlh6o.webp)
2. 请求访问Azure OpenAI服务
	![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.3qf86e6z2hz4.webp)
	然后填写问卷，第四个问题需要填写订阅ID，
	![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.2lttofh1xxa8.webp)
	参考：
	[获取 Azure 门户中的订阅和租户 ID - Azure portal | Microsoft Learn](https://learn.microsoft.com/zh-cn/azure/azure-portal/get-subscription-tenant-id)
	
	填完问卷之后要等一段时间的审核
	![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.2o395d14pke8.webp)



### 星火api

1. 登陆：[讯飞开放平台](https://passport.xfyun.cn/login)
2. 点击免费试用：![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.4jxumhrrbg1s.webp)
3. 实名认证获得更多token![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.3gt0zx6nhw00.webp)
4. 前往[控制台-讯飞开放平台](https://console.xfyun.cn/services/bm3)获取自己的key![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.byp4zpdhe4w.webp)
5. 输入到config.py中
	注：需在这个列表添加
	![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.27f7pzihlurk.webp)







### 智谱清言

1. 前往平台[智谱AI开放平台](https://maas.aminer.cn)登陆后前往![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.ox0uvcjqk4w.webp)
2. 点击右上角查看apikey![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.8vj61b1wpig.webp)
3. 复制key输入config.py的这个部分：![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.53marrgqzqtc.webp)


其他api不是需要自己部署就是收费，就不捣鼓了。
