---
title: jvm
slug: jvm-zvywvp
url: /post/jvm-zvywvp.html
date: '2025-08-23 23:21:14+08:00'
lastmod: '2025-08-23 23:22:04+08:00'
categories:
  - Java八股文
toc: true
isCJKLanguage: true
---



# jvm

## jvm的结构

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=M2JmNzU3YWQzOGYwNjhjNjUyM2UzYjI2NmY4OGZiZGNfMWw1TFdTSHl4dWVTME91Y3A4YTRpOXhzeGlPZUh0VkxfVG9rZW46WDdWaWJVOXBXb2FpUDl4cDFLZGNJWGlOblRnXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

### 程序计数器

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ODRiNGE0MDgzNDU5ZGE4ZGZiYzI1M2Y3YTAzYzYyYzJfc0JQUmhHU08wdXZhTDhJRzJmM2JwVDJDUmN2dmhXTVBfVG9rZW46RnZhV2J5bVIwb09VdHF4UzdwcGNFc01abnloXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

当前线程所执行的字节码的行号指示器，**记录下一条即将要执行的字节码指令的地址。** 当执行引擎正在执行 bipush 10 时，程序计数器会自动保存下一条字节码指令 istore\_1的**地址**。 因为真正的字节码指令存在元空间，通过这个地址就可以找到对应的字节码指令。

### 虚拟机栈

虚拟机栈时描述java方法的内存模型，线程中正在执行的方法会对应一个栈帧，所有的字节码指令只会对当前栈帧进行操作，如果这个方法内部调用了多个其他方法，就会出现多个其他栈帧。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ODU2YTg3MDllZmZiYTJlZDNmNDY2ZDA2Mzk5ZWM0YmRfN1ZJN054Szd5UHphbndXZFU1TlphNmN3YUhqRkhob2RfVG9rZW46UG03RWJVTzdab0VNM0p4dnlvWGNQZ1FPbnlKXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

栈帧包含局部变量表、操作数栈、动态链接、方法出口和异常表。

- **局部变量表**存储的是方法参数的值和方法内局部变量的值。方法中的这些值，只会在执行的时候才会加载到局部变量表中，需要注意的是基本数据类型的值会被加载到局部变量表中，而字符串和引用类型的值则是将**地址**加载到局部变量表中，通过地址就能找到值。变量名仅作为一种符号存在源代码中，程序运行的时候变量名会被完全消除。所以我们在字节码指令中也就看不到变量名的存在。
- **操作数栈**在方法执行过程中，根据字节码指令往操作数栈中写入数据或提取数据，即操作数栈的入栈和出栈。  
  ​![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YmY1YTlmNzhmNGZkZGMyNzQyNTM4OGYyMDBiNDNkNTFfQ05kUnpUbWRYNzdIZjQ5Qzl1WG5wd01MTXdWU1FWZlJfVG9rZW46UWd2S2JDYXFjbzg1NzJ4bkxteGNuR1VHbmJkXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

  - 可以把操作数栈理解为一个草稿纸，程序执行时会把这个值写到操作数栈，在里面进行计算，再把值提取出来放回局部变量表。
- 动态链接保存了一个“符号引用"的编号到运行时常量池“直接引用”即全限定名的内存地址的映射关系。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MWY1YjFlMzhmMGQ2NDU3NTdiZjlkYjFkYjkwNWI0YWFfenhnSjBlMndMQ3g3QlY4R2JmekVDMTBNbE1hN2ZMTnpfVG9rZW46WjZIRWJXbmdxbzVvdjZ4SzJScmNDbUlwbmhjXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjRmZGIyYTVhZmUwNTZmZThkZmYzZGRjMDcyY2VmZDRfUVFuVFpTd1JKMnpRUUV3VWVYMm9tZW5Wand2b1gzd1FfVG9rZW46RHdYS2JpdndIb2FGVW54R201SmN6YXJzblZoXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

当执行method02中的method01，就会执行字节码指令的第四行，因为动态链接保存了符号引用和直接引用的内存地址的映射关系，通过符号引用#9这个编号，可以找到method01这个方法，然后运行method01的代码。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGY2ZDNlMDJkODM2OWFkMzMwM2Q0MTM3NGY4ZWJmODNfSFg1U1JlcnFDdmdGUU5YcEZrckhmZzd0Z2lYT2hiV2tfVG9rZW46UURYdWJWeTlmb3pkNU14ZmFkVmNBS3lKbnhjXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDYyMmYyZDFlMDY5OWQ2NTQ1ZDgzZWE1MzZhOGZiODVfZXcyallhbEhpZjBrNllwR1drZDlMbjNEYzJkVURkN1VfVG9rZW46Q1JIUmJaOTVxbzRkdFV4TXBjb2NGNklRbm9mXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NGFiZTEyNmNlMTZiZjAwZmRmZDQ1NmJkZTIzMzNjZWVfZjltUlNyczByWnBEcmZNN0NTbU5UNVdDMWhReDJ1WnNfVG9rZW46UEhNZ2JGZjhWb2FSd1N4RnF0amNBQlR2blpmXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

- 方法出口，存放调用该方法的指令的下一条指令的地址，method02调用method01，method01执行到最后一行returnk，还要回到method02执行最后两行字节码指令。那执行引擎是怎么知道的呢，就是通过方法出口。当执行第四行调用method01方法的指令的时候，就会保存下一条指令 istore\_2。这样method01执行完之后就会自动执行 istore\_2。将method01返回的结果保存到局部变量表中2的位置。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NDBhOWE1ZGVlMDQ5NjRkNmI0MjYzZDRmM2ZiZjk5NTBfcGw2Z2pWMFpaWVRvTEZKMlNiVHhXTW1zUlhOTWZqQWpfVG9rZW46UHROdWJMekx2b3Bja1p4b25WZGNkcjlYbmNjXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

- 异常表：存放代码异常的处理信息，有起始指令地址、结束指令地址、跳转指令地址

### 本地方法栈

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MjkzNDAyMDEyOGE5NzA0ZTczNTQyMzU4MzUyY2E0Yjhfa28yV2JkV2ZQalJyNnhqZWJTa1M4VkdnQVF3VWdZUXpfVG9rZW46UG1GamJIbENYb0UzcmZ4RXRMdmNQUnJ1blViXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

本地方法栈是JVM执行native本地方法的内存区域

### 堆

新创建的实例、对象、数组、以及字符串所在的常量池都在堆内存中

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OGQ3ZWM5ZDFiNjM1MmQ4MjdlYTRhZmM0N2Q3YTRiNzBfOFRiVk5rZFczYkI5ZWE2a1oxMkdoTTlUVmlab3lmaDZfVG9rZW46WWtCUGI4NWEyb3paZDB4TGwxRmN3S0dNbkRoXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

堆也是进行垃圾收集最重要的内存区域

### 元空间/方法区

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjI5NTczYWMxYTA3Y2UyOThhODYxMjY0OGNhMGIxMzBfS2ltTEx5VXk4dWVlcWI5SVhQUTFmaFBZOVNKSkVtMERfVG9rZW46UEt1a2JLUW1yb2QzQmd4OE5OMmNCWE1xbmVkXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YWRmNmE5ZjMwNzIxNWFhNGQ5MWFmOGM2Yzc2MDc3NTZfY0kzcnRoUWxiblp4eE56SE44MzQwUXdNR0wzR3Q4cndfVG9rZW46TlRGUGJNZWhjbzhmMmR4ZGZBRmNkUTlPbmM5XzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NjJmY2I5YzAwOWI3YTY3ZjE2NWY2ZGIxZDI1NzEzNDhfYTZFZzZ0cGV0Y2tPakloZ0gxbUFlTGJTQ1ZWNkRlZmhfVG9rZW46Q3F5NWJjYWhlbzh5M2d4b21oemNYRU40bnpkXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjU3YjZjYTU4M2IyMzAzMmVjNTYwYTQ5OGQ0ZTA5YjBfbEJPV2lnT1lMTVF1ejV0eXZGU2U0ZU8wSXk3aUk4RklfVG9rZW46TUxVWGJOZFBLb3c4MU14MTNOMmN0clNybkpoXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

**类信息**就是java文件编译后加载到jvm中的class文件，包括类的方法**属性、注解、修饰符**，以及一行行代码对应

的**字节码指令**。

**运行时常量池**：存储**类的全限定名**和**方法的全限定名**。

**静态变量**：被static修饰的变量

编译器编译后的代码：如jdk或者cglib自动生成的动态代理类

元空间其实并不在JVM中（jdk8之后都放在本地内存上）

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NThjY2FjY2NiNjdmYzRiZTFlOTM3ZDVkNzc5YTUxMzZfb2NMVmZYSzlXTXc1Q0JSaW5sVGZ3WVIxSHlxOUJ1TFZfVG9rZW46Rmo3V2JLTjU0b3djS3N4ZU55U2NDeU54blhiXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

## 双亲委派模型

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NGZlNzdiMzBmZjQ0OTkyNzkyNmU2MjJiZWRlY2IwNTZfQ2VPY3VQT0h0ZHBZS2dwSERPU1dDNDdnVGpEYkNQdmZfVG9rZW46UHRFTGJONmhYb3NreFN4dHJYaWNrSGtKblRoXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

## 类加载机制

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OTZiMzU2MzZmOWQwY2RhYTdhNzM0Y2I3NWU5NjQ0NjJfdXBBWXhEVDBFQXJGOERhOVA2VTZOSzlObmpqdGtsUDFfVG9rZW46UDVIaGJob1FMb2FheGx4SFhWSWNib1pzbmhXXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YzZjOTVmYjFlN2NjN2Q3MGI1ZDdlOGFkOGIyMWM4ZThfNFluaWNHR0xJUVM2bXFBd2x1Z0wyZVJaamlLWUxkVnBfVG9rZW46VFUwWmJLUmZHb3lMMEZ4WWJxQmMxMWV1bjhnXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

## 垃圾回收

垃圾回收主要针对的是JVM的堆内存，它分为新生代和老年代。

在堆内存中，从垃圾回收的范围上说，一般分为两种， 针对新生代的垃圾回收叫做minorGC，也叫YoungGC或YGC，针对老年代的垃圾回收，叫做majorGC，由于一般majorGC动作发生的时候，通常会伴随着minorGC，所以majorGC也经常被叫做fullGC或FGC，也就是全局范围的GC操作。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjEwMzU5MTAzZDQ3ZTBmN2RlNzhjMjM1YzdkMjRiZTRfMEdkNnJNaUFRMXRZalB5R3JMU3RtbHJqdTJ0d0ExODBfVG9rZW46QVBrVGJSUEp2b2dGUG94ck9HQWNyT2htblNnXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

针对新生代的一般叫minorGC/YoungGC，针对老年代的majorGC，全局GC叫FullGC

### 常见搜集算法

垃圾回收当中一些常见的收集算法和回收算法：

首先需要标记出哪些对象是可以回收的，有两种算法：

#### 引用计数法

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjZlMjhkNjczMmEzNzViMzVmZWVlZjRkMjVhYWIxN2FfVWNwY0dJR2VmVGZ2QkNwRmxTTXM1dHAwQkhtUjlyREFfVG9rZW46SXJyaGJwRnVXbzZaQU94Ymh5YWNVMTQyblNnXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MTRiM2U2MzE2ZDFiZDEyNTcxOWZkNjMxMGMzNjZkYjhfZ2pxRER0eTE0elJUZDB6bVloZjNLVGlUbTd1M0FpRHdfVG9rZW46SlJjNmJuUzhXb3BnNTh4SnNlMmNhT3dHblBmXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=Y2NiMTUyMGZhNmRjNGEwYmZjY2I1YWQ0NThlMWMyOGRfN0kxVlVmaEZ4WW5nVlRUMHR2c290UEJYWEFuMUo4RHJfVG9rZW46R1J6WGJkbVFWbzB5QWV4dkg5MGNyUFFPbmZoXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

每个对象都会有一个引用计数器，每当有一个引用指向他的时候，他的计数器就+1，当判断对象的引用计数器\>0，就说明当前对象有引用 正在被使用，当引用计数器为0时，表示对象没有任何引用指向它，即可以别回收

引用计数器有一个明显的缺点，即两个对象互相引用时，引用计数器都为1，永远也不能为0，也就永远不会被回收了。

#### 可达性分析

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YzBhZmZjOGJmZDUxYzM2Yjc0YTM1ZDc3MDNmYjA5MmVfV1BXc0N1NnRyTFhvUkVucVpVR0JlYWI2YUtLZklJN29fVG9rZW46REowSmJ4bU1lb0tNVUt4dWV5MWM1azBXblhjXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

从GC  Roots出发，看看都有哪些对象是可达的，哪些是不可达的，可达的即存在引用，不可达的即没有引用可以被回收

都有哪些可以作为根对象（GC Root）呢？

只要一个对象能从上面这些“根”一路找得到，它就不是垃圾，就不会被回收。

标记出垃圾就要进行回收了，下面是回收的算法：

### 垃圾回收算法

#### 标记清除法

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjFjMDgzMGUwODExMzVhMWNjYmQ1ZjA3ZDZlMWVlOTZfSmhGZGNvSW11WEs1ZFpuZm1kMzJoZnRpZ0VDRzRpWm5fVG9rZW46UHJESmJDZHJ3b29vQnB4bEQyZWNZWlBmbk9mXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

当垃圾回收器将内存扫码之后会标记出所有垃圾对象然后将他们回收，

缺点：会产生大量的内存碎片，使得内存的使用率越来越低（服务器维护：重启服务器）

#### 复制算法

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=N2M5MDY3NjRmNTU3OTBmNzYyN2ZmYzVkYmUzNzRlNjBfOTdYR2k3cXF5TkRheW9TSDFEMTdjMmd6dUQ2a1ZKclJfVG9rZW46TXJwbmJKNk5Bb3ExNDh4NFN0UmNVZXk3bjdjXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

准备两块一模一样的内存，当第一块剩余空间不足时，可以将所有需要保留的对象拷贝至另一块内存，然后将前一块内存全部清空，这样即做到了垃圾回收，又做到了碎片整理，

- 缺点：内存空间需要浪费一倍
- 新生代中的两块幸存者区，其实就是为了实现这个算法。

#### 标记整理

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjJmZmMwZTBlZjYwYWNjNjYyOTdjNmQ0ODlmNWZiMDhfZmZDcWdocTVGMVNvTVJ5T1g4QUZnWVlwMGpLbzJUSlVfVG9rZW46Wm5Oa2J3SHJEb1Y3dlB4V1BvZ2NWRGxlbjhiXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

标记整理算法就是在清理垃圾的基础上，多了一步碎片整理的工作，显然这种垃圾回收机制不适合高频率的执行，一般当老年代的空间不足时，会触发一次FullGC，这时就会碎片整理工作

### 垃圾回收器

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OGZjZWVkNWQ3ZTM3ZTM4NDdlNzY1Zjk4NWZjNmE5OWZfSHE3U0NBSEVKNTNHWUE4MVFDdXJuekhYdDZleDV5UWpfVG9rZW46TXJCdWIyTk9rb1lJQnh4WExzdGNiQ0IxbjJmXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

#### Serial

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NGYwYjkzYTQyOGY0OTg0MjA4ZGZmYzIxNmU3YmY4YjJfRU5vazQzbnFZOGh5U3ByODNxYWR6b0haTzBkZFlGSDRfVG9rZW46QkNaaWJtekFkb1l1VkN4S0l0U2NLZlJGbmFlXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

Serial他是工作在新生代的垃圾回收器，还有一个对应的SerialOld是工作在老年代的，这种垃圾回收器是单线程的，并且不支持并发，当开始垃圾回收时，所有用户线程都必须全部暂停，这个动作叫做STW，全程：Stop the World，然后垃圾回收器开始工作，标记并回收垃圾，然后STW结束，用户线程恢复。

#### ParallelScavenge

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=M2ZjNWM5NGU2ZThhZGIzYjUzYzhiY2IyZjgyNmQzMzJfOFJVcE9mTHJtSWxCbWwwTWhHdTNpWlVlRW4wWE9VcDZfVG9rZW46WDF0c2JEeWJ3b3BmUkl4NGhJWGNQTjhHbjJiXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

当开始垃圾回收时，所有用户线程必须全部暂停，依然触发了STW，但是不同的是这次垃圾回收变成了多线程，对于多CPU的服务器来说，提高了不少效率，但STW这个动作依旧不可避免，后来就有了CMS。

#### CMS

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NDU4YTkxYzEyZjIyNThiYWY2YTZiN2YyNzUyZmMwNDdfdGk0TEJ2aXVFbDkwclRKbjhqVG43RnJsVHF4V0FhNnVfVG9rZW46S1hhWWI2cmlubzRVdFh4blpSQ2NBdXB4bjNkXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

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

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YTUyZGIyZWFjYzVjYzAyODk3MjM0OWMwOWE0MDYxYWZfS0RmYzZScktnR29QZzZpUlhNYmtDY0d0eWZIV3J6VXpfVG9rZW46QnlndmJDZ1NKbzNsMm54NWlTV2M2N0NybklmXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OTVkNmM2ODJjNzg1YmZlNDllZmVlM2UyOTIwZmIxYWVfeVJ2SUVDQVAwSjREYnFyRkZBaHplSThubmZJT2FhQzJfVG9rZW46QlNEV2JHYTAwb3FkOFd4d00xQWNLd3pCblRlXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

1. G1 在回收时用的是复制算法：把活对象复制到新的 Region，旧 Region 直接清空。相当于一边回收一边整理内存，**不会产生碎片**。

**大对象特殊处理**（Humongous Region）：超大对象（比如大数组）直接放进专门的 Humongous Region。避免了在普通 Region 中横跨多个区域，也避免了频繁移动大对象。这类对象属于**老年代**，但管理更高效。

但有个代价：可能收不干净

如果你设的时间太短（比如 10ms），G1 只能收一小部分区域，很多垃圾没清掉。很快内存又紧张，GC 就频繁触发。

→ 频繁 STW，用户线程老被打断，吞吐量就下降了。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OGZjOTljZTIzNThjOGRiYmYxOTZiMzkxZmY3NGFiYTFfakhkSTVOejQzZFBzV1BNVFZ3SEJ5OEtOYmtnMEZzalJfVG9rZW46SzgxU2JaNmN2b3NlcTZ4TW1NTWN3clZPbnFjXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjIyNmFiMTQ5MWViYWEwZTZhYWJlNmY2MGU3ZTk4NTFfZmh2Q0R2Q3ZlRG9Ya0xIdkFUQ2dBeUgyeUZyZFo1TGRfVG9rZW46QVpIcWJjYnZLb2pYOEx4ek53RmNxaDdJblViXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)

G1的工作流程其实跟CMS差不多，只不过，由于它不需要扫描全部内存，他的STW时间是非常短的，并且最终标记阶段，G1修正了CMS会出现错标的问题，它是通过三色标记算法进行修正的（自己了解一下这个算法吧x）

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NjU5NzUwZmI0YmQxOWFlODVjZDM4MmIxOGM5ZDg1NTRfM1NmRTdOazBIRE5sdkM2Rk5jVEo2R3JiUWp4aXRvdlRfVG9rZW46Q3RZSGJBb1M0b0xrRWh4UWh0cWN4WDRSbnZkXzE3NTU5NjI0NzE6MTc1NTk2NjA3MV9WNA)
