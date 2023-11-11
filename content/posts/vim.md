---
title: "Vim"
description: 
date: 2023-11-10T12:43:42+08:00
image: 
math: 
license: 
hidden: false
comments: true
draft: false
categories:
    - 杂七杂八
---

尝试学习一下vim

## vim模式切换

### normal转insert
i 光标前插入
I行首插入
o进入下一行输入
O上一行插入
a光标之后输入
A行末尾插入

### insert 转normal
esc/jj 变回普通模式

### normal转visual
v变成可视模式（无法编辑）
### visual转nomal
esc或者v变回普通模式

### 普通模式转命令模式
：转成命令模式

### 命令模式转普通模式
esc



## 光标移动
### 普通模式下光标移动
![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.361dhwguy24g.webp)

![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.6l1znm0xt3i8.webp)
![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.4z95f8a62f7k.webp)

![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.8z6bkk52b08.webp)


## 动作 motion
![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.3l3imza42lts.webp)
## 操作符
![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.4zwaffdpozk0.webp)

删除全部 die
复制全部 yie
u 撤销

## 大小写
![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.6dgggu7lgdxc.webp)


## 常用
gd 查看函数定义
^O返回
g数字 切换标签/ctrl+数字
command+0 到文件夹 o打开 回车修改名字

## easymotion
空格空格s + 要查询的字幕
空格空格+e
空格空格+w

## vim surround
![image](https://cdn.statically.io/gh/Anonymity-0/Picgo@note_picture/img/image.2d1gjkuofvls.webp)


## 光标转移到终端
leader + t

## 切换tab
gt或gT