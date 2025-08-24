---
title: JVM
slug: jvm-dpaf2
url: /post/jvm-dpaf2.html
date: '2025-08-23 15:48:46+08:00'
lastmod: '2025-08-24 13:40:04+08:00'
toc: true
isCJKLanguage: true
---





‍

jvm的结果

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/image-20250823154907-vsulqp9.png)

‍

‍

‍

### 堆

新创建的实例、对象、数组、以及字符串所在的常量池都在堆内存中

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/image-20250823155041-cq9x2ft.png)

堆也是进行垃圾收集最重要的内存区域

‍

‍

### 元空间，方法区

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/image-20250823155254-ujrv4vv.png)

## jvm的结构

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YTBjMDU3ZGRkMWFmNmJlMjAxYTg1YTQ4YWVkMWM1MGRfSEpYS0JCbDJVMWZHbm1sSnVpVVBmRFNta3owOTFOWHVfVG9rZW46WDdWaWJVOXBXb2FpUDl4cDFLZGNJWGlOblRnXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

### 程序计数器

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YzE5NzM5NWIwNWY4OWVkZWQ2ZjQxMDc0ZmY4ZWE0ZjJfODVTUUhOZDlTNzFOb3ZiQUEyNHpUY3lUenBudFZ2bWNfVG9rZW46RnZhV2J5bVIwb09VdHF4UzdwcGNFc01abnloXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

当前线程所执行的字节码的行号指示器，**记录下一条即将要执行的字节码指令的地址。** 当执行引擎正在执行 bipush 10 时，程序计数器会自动保存下一条字节码指令 istore\_1的**地址**。 因为真正的字节码指令存在元空间，通过这个地址就可以找到对应的字节码指令。

### 虚拟机栈

虚拟机栈时描述java方法的内存模型，线程中正在执行的方法会对应一个栈帧，所有的字节码指令只会对当前栈帧进行操作，如果这个方法内部调用了多个其他方法，就会出现多个其他栈帧。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ODA2NmVkYmFhNWY4MzY5NjhmNWE0ZTVlZWI4ZDUzMTlfVGpUVDFMWEVKUHpmd21Cd3VFRkFKOWlwNWpkTjgxZjJfVG9rZW46UG03RWJVTzdab0VNM0p4dnlvWGNQZ1FPbnlKXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

栈帧包含局部变量表、操作数栈、动态链接、方法出口和异常表。

- **局部变量表**存储的是方法参数的值和方法内局部变量的值。方法中的这些值，只会在执行的时候才会加载到局部变量表中，需要注意的是基本数据类型的值会被加载到局部变量表中，而字符串和引用类型的值则是将**地址**加载到局部变量表中，通过地址就能找到值。变量名仅作为一种符号存在源代码中，程序运行的时候变量名会被完全消除。所以我们在字节码指令中也就看不到变量名的存在。
- **操作数栈**在方法执行过程中，根据字节码指令往操作数栈中写入数据或提取数据，即操作数栈的入栈和出栈。  
  ​![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MTYzYTU1NmRiNjA3NmZhMTBhYmJkYWE0YTU0ODQwOWFfYWcwNVBxenBKalNTc0piclN0ZmV2ZmFPanF6VUdXcVBfVG9rZW46UWd2S2JDYXFjbzg1NzJ4bkxteGNuR1VHbmJkXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

  - 可以把操作数栈理解为一个草稿纸，程序执行时会把这个值写到操作数栈，在里面进行计算，再把值提取出来放回局部变量表。
- 动态链接保存了一个“符号引用"的编号到运行时常量池“直接引用”即全限定名的内存地址的映射关系。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTU0OTU1MTM3NWYxNTJmMzI5OTAzMDJmZmFhMThmM2ZfMHNPZUhONUZhZHlXcUZGcDhHWkNlQWtjblV2RGZlMHhfVG9rZW46WjZIRWJXbmdxbzVvdjZ4SzJScmNDbUlwbmhjXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YWVkZDcwY2I1NTM1ZjAzYmZlZWJlYzVkMDE2NjBjMzlfdm5mY1VSalJ6MHY3RExnYU1XTEtVNEs0NHpmalR4MzVfVG9rZW46RHdYS2JpdndIb2FGVW54R201SmN6YXJzblZoXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

当执行method02中的method01，就会执行字节码指令的第四行，因为动态链接保存了符号引用和直接引用的内存地址的映射关系，通过符号引用#9这个编号，可以找到method01这个方法，然后运行method01的代码。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OTM5ZDY4MjgyYWNjMzIyOGZlNGMzYmI2OWJhN2U1ZWFfemY2VmdsM1AzemZ4TUJmZjRYVzRZUHJkQ2NRYm5qelJfVG9rZW46UURYdWJWeTlmb3pkNU14ZmFkVmNBS3lKbnhjXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZWE2NDE4Njk5NmM3ODAxZTUzN2YxMjQzNWNjNzNkODJfY1NWN2pLRXdBekV1OWtFcHYwd1RXMkJWV3ZkRDZxb2JfVG9rZW46Q1JIUmJaOTVxbzRkdFV4TXBjb2NGNklRbm9mXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=Zjg0ZTJjZDYzODM5NDg5ZmJiYzdiMDljYmNkY2IwZTVfMmxKOGxJRE5DVGQ0VDgydHVtWktiQ3hKRmdTRDdVNU9fVG9rZW46UEhNZ2JGZjhWb2FSd1N4RnF0amNBQlR2blpmXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

- 方法出口，存放调用该方法的指令的下一条指令的地址，method02调用method01，method01执行到最后一行returnk，还要回到method02执行最后两行字节码指令。那执行引擎是怎么知道的呢，就是通过方法出口。当执行第四行调用method01方法的指令的时候，就会保存下一条指令 istore\_2。这样method01执行完之后就会自动执行 istore\_2。将method01返回的结果保存到局部变量表中2的位置。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ODc4N2JiOTYzMmFhYWIzYzg5MmQ2NTNhMzEzNTJmMDlfVnhMN1pJSkhuRUtJVEV3S09CT1owUmY3V0N0RXBJNURfVG9rZW46UHROdWJMekx2b3Bja1p4b25WZGNkcjlYbmNjXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

- 异常表：存放代码异常的处理信息，有起始指令地址、结束指令地址、跳转指令地址

### 本地方法栈

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NDdjOTFjNmE4Y2FhOGM4MDYwMDE2Y2FkNWY4NWRhMDhfVklHOUdNOTdrWE52VU9oWmI1T2IyVjBhdXJCZG9obGlfVG9rZW46UG1GamJIbENYb0UzcmZ4RXRMdmNQUnJ1blViXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

本地方法栈是JVM执行native本地方法的内存区域

### 堆

新创建的实例、对象、数组、以及字符串所在的常量池都在堆内存中

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NTE1MzM4OGU5MGUyZTI2NmVmN2JiNWU3NTMxNWExZTdfWG1lZkxiZ3ZHOVkxOXVwYnh3U2FvMGhid2ZWaWQyaGVfVG9rZW46WWtCUGI4NWEyb3paZDB4TGwxRmN3S0dNbkRoXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

堆也是进行垃圾收集最重要的内存区域

### 元空间/方法区

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjM1MmU2MzdmOTU4YzM5ZGM4ZTlhYzQyYjhiNzEzYjZfcHhFTUQ0YVpQSWh5NzE1QmhiOGJSdjBkRDJzZnlZWHJfVG9rZW46UEt1a2JLUW1yb2QzQmd4OE5OMmNCWE1xbmVkXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=Y2JmNjE4YjRhYmRhMTU0ZDUyMDE4MDVmZWVhOGU0YjRfWk1wZmRCZXFqRWF0dUJmd1o1dVN3TFpDN1RhMDZlREFfVG9rZW46TlRGUGJNZWhjbzhmMmR4ZGZBRmNkUTlPbmM5XzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTE2ZWMwNzlmOTZmNzMwZDE3NDIwNzAwN2Y2ZWUyNGRfb3VQTUc1VThEaWxRUDZmZFhGaE9iOUdKNkhIRHJDZXlfVG9rZW46Q3F5NWJjYWhlbzh5M2d4b21oemNYRU40bnpkXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjMwMjc4YmY3ZmU3NGEzMDkzODQxODYwMjZiZWIzYWRfV25EOXpMMUNnUVB5ZTRiSmdpcFQ3VEdBOFBJRWtDNkRfVG9rZW46TUxVWGJOZFBLb3c4MU14MTNOMmN0clNybkpoXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

**类信息**就是java文件编译后加载到jvm中的class文件，包括类的方法**属性、注解、修饰符**，以及一行行代码对应

的**字节码指令**。

**运行时常量池**：存储**类的全限定名**和**方法的全限定名**。

**静态变量**：被static修饰的变量

编译器编译后的代码：如jdk或者cglib自动生成的动态代理类

元空间其实并不在JVM中（jdk8之后都放在本地内存上）

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YzA2YzM5MTRlYTNkNDc5Y2UyNmVmMjQ4Zjg2OTViN2FfdUxFNHNIYVVPT2xOSEtpeXBnVkRha3NrMVZPWU54d0JfVG9rZW46Rmo3V2JLTjU0b3djS3N4ZU55U2NDeU54blhiXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

## 双亲委派模型

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YzYzZDFlNWEzNTNkM2Q1NDM1ZGM0Mzg0ZDI5MWU0NDhfcU8zYmZiUXlPeVMzcEpmdUR2R21DeFdXTDBhMlRCaVRfVG9rZW46UHRFTGJONmhYb3NreFN4dHJYaWNrSGtKblRoXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

## 类加载机制

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YTdjNzk0OGY0ZGMzZjMwMGJkYzZiYzJhNGE2ODdlMzJfWlZHdnVqMDFrMmJVQlNNYVRGT1lxZzk5SVB0Mll0VnNfVG9rZW46UDVIaGJob1FMb2FheGx4SFhWSWNib1pzbmhXXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MzZmZGZhNWFlNzM0MDc3Mzg4NjNkNmE0MDY4ZDE4M2RfV3p2bmtOVlRYamRYSFhQdGxhelRGbGZlaVcxT0lqQzRfVG9rZW46VFUwWmJLUmZHb3lMMEZ4WWJxQmMxMWV1bjhnXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

## 垃圾回收

垃圾回收主要针对的是JVM的堆内存，它分为新生代和老年代。

在堆内存中，从垃圾回收的范围上说，一般分为两种， 针对新生代的垃圾回收叫做minorGC，也叫YoungGC或YGC，针对老年代的垃圾回收，叫做majorGC，由于一般majorGC动作发生的时候，通常会伴随着minorGC，所以majorGC也经常被叫做fullGC或FGC，也就是全局范围的GC操作。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OTViMzdmMWI1MzEwNWExZjQ3MDExMTU5OTNmZTNhY2FfOGJKMUp2YWNSSWNhQm1mUllMa2Y3ZEpmbnZPN2ZnZXNfVG9rZW46QVBrVGJSUEp2b2dGUG94ck9HQWNyT2htblNnXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

针对新生代的一般叫minorGC/YoungGC，针对老年代的majorGC，全局GC叫FullGC

### 常见搜集算法

垃圾回收当中一些常见的收集算法和回收算法：

首先需要标记出哪些对象是可以回收的，有两种算法：

#### 引用计数法

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTZhZDkwZTMwYjQzNGJjYmI5ZGQ2YTY5ZWQzNDA3YTVfSTBYckFySGRPWW52T3Q4NWUzbGpoVjZaZnpLSVhITEFfVG9rZW46SXJyaGJwRnVXbzZaQU94Ymh5YWNVMTQyblNnXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjBmZDdkY2U5ZmMyMTljMDNhMWNlZjgwNjE5ZDVmNGNfR0VKcG9mR1p3QVA5QTRTdGpjb2R6eHY1UWdkSmp4UlZfVG9rZW46SlJjNmJuUzhXb3BnNTh4SnNlMmNhT3dHblBmXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjRlYTU2YTg3YzNjNmVkZjhlYWY3NGY3NTljYzI1MjRfT1ZMYkNmMENBNThmSkxtenVROWtUMk91QXJ5TkhwMkRfVG9rZW46R1J6WGJkbVFWbzB5QWV4dkg5MGNyUFFPbmZoXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

每个对象都会有一个引用计数器，每当有一个引用指向他的时候，他的计数器就+1，当判断对象的引用计数器\>0，就说明当前对象有引用 正在被使用，当引用计数器为0时，表示对象没有任何引用指向它，即可以别回收

引用计数器有一个明显的缺点，即两个对象互相引用时，引用计数器都为1，永远也不能为0，也就永远不会被回收了。

#### 可达性分析

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OWExMTcwNjI4NThmNWVmZTNjMzE1ZDk5MTU0MzQ4MzZfQlhKZXJPMVVTRlp2UzVHekVYZkZKZUhpbUlrcUt4NGlfVG9rZW46REowSmJ4bU1lb0tNVUt4dWV5MWM1azBXblhjXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

从GC  Roots出发，看看都有哪些对象是可达的，哪些是不可达的，可达的即存在引用，不可达的即没有引用可以被回收

都有哪些可以作为根对象（GC Root）呢？

暂时无法在飞书文档外展示此内容

只要一个对象能从上面这些“根”一路找得到，它就不是垃圾，就不会被回收。

标记出垃圾就要进行回收了，下面是回收的算法：

### 垃圾回收算法

#### 标记清除法

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MGZhNTc5OGY1ZTIxZjNjOTczOTE2YTJiOWY3MjkyMDdfRmJwWmpMeEU3cFNuS1JpUDhYcENQc0RTTjh2d1dIZmJfVG9rZW46UHJESmJDZHJ3b29vQnB4bEQyZWNZWlBmbk9mXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

当垃圾回收器将内存扫码之后会标记出所有垃圾对象然后将他们回收，

缺点：会产生大量的内存碎片，使得内存的使用率越来越低（服务器维护：重启服务器）

#### 复制算法

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NzJmOGExZjc2YTU0YjQ1YWNmOTA2MzAwMTZjZmEzODNfTTMwU08xRDBKVlFVZ2ZsTlpVVTJwSmI1dDBlbmw5b1JfVG9rZW46TXJwbmJKNk5Bb3ExNDh4NFN0UmNVZXk3bjdjXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

准备两块一模一样的内存，当第一块剩余空间不足时，可以将所有需要保留的对象拷贝至另一块内存，然后将前一块内存全部清空，这样即做到了垃圾回收，又做到了碎片整理，

- 缺点：内存空间需要浪费一倍
- 新生代中的两块幸存者区，其实就是为了实现这个算法。

#### 标记整理

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ODI5ZTdjYzcxZmY0NDJlMmIzZDkyMDBiMzYyNTk3YzlfYlpYOEFVMmhPcEJxZnFTRkUxTjF1a0JyS0pLTXk1TGtfVG9rZW46Wm5Oa2J3SHJEb1Y3dlB4V1BvZ2NWRGxlbjhiXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

标记整理算法就是在清理垃圾的基础上，多了一步碎片整理的工作，显然这种垃圾回收机制不适合高频率的执行，一般当老年代的空间不足时，会触发一次FullGC，这时就会碎片整理工作

### 垃圾回收器

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MTNmM2E4M2ZmZWI3NDFlNjFiYTg2MGRiOTE2ODQ1NGRfVXFBUkNFQkJzVXpZRVRENURONGNzaGxNaTlBbFhhd3RfVG9rZW46TXJCdWIyTk9rb1lJQnh4WExzdGNiQ0IxbjJmXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

#### Serial

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjA5NzFmODUzNDdlOTU0MWM0YzNlOTQzM2EwMGFmOGJfUFd2UEZOcWpIRk5TUXBLWGZDbVVtRG44clFWYVFqVk9fVG9rZW46QkNaaWJtekFkb1l1VkN4S0l0U2NLZlJGbmFlXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

Serial他是工作在新生代的垃圾回收器，还有一个对应的SerialOld是工作在老年代的，这种垃圾回收器是单线程的，并且不支持并发，当开始垃圾回收时，所有用户线程都必须全部暂停，这个动作叫做STW，全程：Stop the World，然后垃圾回收器开始工作，标记并回收垃圾，然后STW结束，用户线程恢复。

#### ParallelScavenge

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=N2E0MTFiZTgwMjM0ZGYyOWQ2ZTE4NDFiYzdlNzc4Y2ZfOWIwVVN4TTV4T3puQW83UFBVSmJISTBneUhKMHVjbTBfVG9rZW46WDF0c2JEeWJ3b3BmUkl4NGhJWGNQTjhHbjJiXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

当开始垃圾回收时，所有用户线程必须全部暂停，依然触发了STW，但是不同的是这次垃圾回收变成了多线程，对于多CPU的服务器来说，提高了不少效率，但STW这个动作依旧不可避免，后来就有了CMS。

#### CMS

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NTcxOWZkZjk2MjkzNTU3NGMzYWQyYzA4ZDc3ODM5ZTNfZDMyd0dTOVZKOFpPOFJMY2JYRnAwNkNkbU9ISXV1MXJfVG9rZW46S1hhWWI2cmlubzRVdFh4blpSQ2NBdXB4bjNkXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

CMS 是为了减少停顿时间搞的垃圾回收器，主打“并发”，尤其是老年代回收。

它分几个阶段：

- 一开始会 STW（停一下），但只标记 GC Roots 直接连着的对象，比如静态变量、栈里的引用这些，所以停得非常短。
- 然后就进入并发阶段，用户线程继续跑，CMS 也在后台一边跑一边标记哪些对象还在用。这时候问题来了：用户线程改对象引用，可能导致该标记的没标上（漏标）。
- 所以接下来又得停一次，叫“重新标记”，把并发期间改过的对象检查一遍，修正标记，确保没有漏掉活着的对象。这次停得比第一次长点，但还是尽量短。
- 最后再并发清理垃圾，这时候用户线程还在运行，新产生的垃圾清不掉，只能留着等下次回收，这就是“浮动垃圾”。

但它有个搭档要求：必须用 ParNew 回收新生代，因为 ParNew 支持并发，能跟 CMS 配合。还有个大问题：CMS 不整理内存，时间久了会碎片化，万一要分配大对象没连续空间，就会触发“Concurrent Mode Failure”，退化成 Serial Old 单线程 Full GC，卡死一波。所以 CMS 虽然低延迟，但复杂、有风险，后来被 G1 取代了。

#### G1

G1（Garbage-First）的设计目标是：在大堆内存下，既能控制 STW 时间，又能保持不错的吞吐量。

它是怎么做到“尽量满足你设定的 STW 时间”（比如 `-XX:MaxGCPauseMillis=50`）的？

G1 把整个堆拆成很多大小相等的小区域（Region），默认最多 2048 个。年轻代（Eden、Survivor）和老年代不再是固定连续的，而是由一组 Region 动态组成。哪个 Region 当前用来放年轻代对象，它就是年轻代；回收后可以变成老年代用的 Region。

这样带来的好处是：

- 不用每次都扫描整个堆，只挑一部分 **Region 回收**。
- 回收前，G1 会评估每个 Region 的“**价值”** ：谁垃圾最多、回收收益最大。
- 然后根据你设的 STW 时间目标（比如 50ms），决定这次回收多少个 Region，优先收“最划算”的。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OTkwMDY2MjhlZGMxYThiMDE2NTU3MWJjZjQ4OTBjOTJfSDQzbUlrTnVQeUplUVVyRmVoQm5pcndKRHZFNjZiR1pfVG9rZW46QnlndmJDZ1NKbzNsMm54NWlTV2M2N0NybklmXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NTQ1Y2U1M2YxNWZlMWViMjVjOTVhYjVhY2FiMTU5MjlfNW5kV3ZYQXZVOXN1TzI0UEh2UXRaOFdCZnlPQ3p3Wm9fVG9rZW46QlNEV2JHYTAwb3FkOFd4d00xQWNLd3pCblRlXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

1. G1 在回收时用的是复制算法：把活对象复制到新的 Region，旧 Region 直接清空。相当于一边回收一边整理内存，**不会产生碎片**。

**大对象特殊处理**（Humongous Region）：超大对象（比如大数组）直接放进专门的 Humongous Region。避免了在普通 Region 中横跨多个区域，也避免了频繁移动大对象。这类对象属于**老年代**，但管理更高效。

但有个代价：可能收不干净

如果你设的时间太短（比如 10ms），G1 只能收一小部分区域，很多垃圾没清掉。很快内存又紧张，GC 就频繁触发。

→ 频繁 STW，用户线程老被打断，吞吐量就下降了。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZWY4ZmExNzk4MDA3YzNkYTMwZDZkMzk3MDVjOThlNDFfUGlUZlFXZWNaM29PdFdYQVo1bUhTS1AwM0tYbDNYT0NfVG9rZW46SzgxU2JaNmN2b3NlcTZ4TW1NTWN3clZPbnFjXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MjdlY2I4YjU4Mjg4MTA5NjBlZDk3OGI3NTAzNDZmNWNfdDFhQ3I0aWtkbU9pZlNMNTRBcmk1WG9yVkJMZGhPQXFfVG9rZW46QVpIcWJjYnZLb2pYOEx4ek53RmNxaDdJblViXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)

G1的工作流程其实跟CMS差不多，只不过，由于它不需要扫描全部内存，他的STW时间是非常短的，并且最终标记阶段，G1修正了CMS会出现错标的问题，它是通过三色标记算法进行修正的（自己了解一下这个算法吧x）

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTVmNTczM2MwMzAzNjQyZGU2MTNiMTY3Yzk4ZjhlYTFfV0cwdjVWVVFOQmxtUm5QeGsxMkFLREwxdUM5MlRaUXZfVG9rZW46Q3RZSGJBb1M0b0xrRWh4UWh0cWN4WDRSbnZkXzE3NTYwMTQwMzM6MTc1NjAxNzYzM19WNA)
