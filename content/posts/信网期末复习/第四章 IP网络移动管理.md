---
title: "信息网络协议基础第四章复习"
description: 
date: 2024-01-02T13:27:05+08:00
image: 
math: 
license: 
hidden: false
comments: true
draft: false
categories:
    - 信息网络协议基础
tags:
    - 学习笔记
---


## 移动切换
- 两种切换情况
	- 切换涉及的AP在同一个网络中-链路层切换
		- 链路层切换不改变IP地址，执行链路层操作
		- <font color="#ff0000">不改变五元组，对应用会话无影响</font>
	- 切换涉及的AP在不同的网络中-网络层切换
		- 不同网络不同AP之间的切换首先执行链路层切换，再执行网络层切换，进行网络相关参数配置
		- <font color="#ff0000">移动节点IP地址发生变化</font>
		- 如何消除切换对应用会话的影响？
			- 应用层解决方案：需要应用支持，本质上是重新建立IP会话
			- 网络层解决方案：需要增强网络协议，对应用透明
- 应用会话大多通过五元组来标识
	- <源/目的IP地址、协议、源/目的端口号>
	- 不同的五元组对应着不同的应用会话

## 移动IPv6
– 基本原理、如何对上层应用屏蔽移动性？
### 基本关键词
- 家乡地址(HoA)：移动节点的标识，手动配置或者由家乡网络分配，通常不变
- 转交地址(CoA)：移动节点位置的标识，由移动到的外地网络分配，随位置变化
- HoA与CoA的对应关系称为绑定(Binding)<HoA, CoA>
- 家乡代理(Home Agent)：保存移动节点的家乡地址和转交地址之间的映射关系(绑定)
IP分组先发送到家乡代理，由家乡代理发送给移动节点！

### 过程
- 移动检测
	- 移动节点检测到自己移动到了外地网络
	- 路由器公告
- 转交地址配置
- <家乡地址、转交地址>的绑定注册
	- 到家乡代理
	- 到通信对端
- 家乡代理拦截到移动节点地址的分组

### 对IP以上层屏蔽移动性
- 双向隧道模式
	- 移动节点和通信对端的通信始终使用家乡地址进行通信
	- 移动节点的移动由家乡代理跟踪，对于通信对端来说是透明的
	- 所有的通信都必须通过家乡代理转发
- 路由优化模式
	通信对端知道移动节点当前的转交地址。

## PMIPv6

### 引入原因•
为什么引入代理移动IPv6？
- 更加易于部署
- 更加易于管理
- 更好的性能
 ### 原理
 - 网络端控制的移动管理
	 - 在网络中引入一个功能实体代理移动节点执行与家乡代理之间的信令
- 本地移动管理
	- 在本地管理域中引入一个类似家乡代理的功能实体，负责管理域内的移动管理操作
