---
title: "NS 3初上手"
description: 
date: 2023-12-18T15:38:41+08:00
image: 
math: 
license: 
hidden: false
comments: true
draft: false
categories:
    - 仿真
tags:
    - 学习笔记
---


## 介绍
ns3是用来进行网络仿真的一个平台

## 学习资源
略

## 安装


### 源码安装
详情可参考[ns-3 Installation Guide — Installation guide](https://www.nsnam.org/docs/release/3.40/installation/html/index.html)

1. 下载源码
	[Releases | ns-3](https://www.nsnam.org/releases/
	进入网站选择版本下载
2. 编译源码
	解压进入文件夹	
	`cd /Users/x x x/Downloads/ns-allinone-3.40`
	编译文件
	`./build.py --enable-examples --enable-tests`
	注：记得提前安装好cmake
	`brew install cmake`


安装完成以后`cd ns-3.40`可以通过ls查看文件内容

在ns-3.36版本之后，ns-3的构建系统从waf更改为CMake，并引入了一个名为ns3的Python脚本来替代waf
### 运行第一个模拟仿真脚本
通过 `./ns3 run hello-simulator` 运行



### 测试的安装
```shell
agq@AGdeMacBook-Air ns-3.40 % ./test.py
```
