---
title: Synchronized到底锁住了什么
slug: what-exactly-does-synchronized-lock-zn0ybn
url: /post/what-exactly-does-synchronized-lock-zn0ybn.html
date: '2025-10-09 21:07:53+08:00'
lastmod: '2025-11-27 15:34:17+08:00'
tags:
  - juc
categories:
  - Java八股文
keywords: juc
toc: true
isCJKLanguage: true
---





## 前言：一条“强制”规范背后的深意

在 Java 高并发编程领域，线程安全是无法回避的核心命题。翻开《阿里巴巴 Java 开发手册》，在并发处理章节中有一条引人注目的**强制性规范**：

>  **【强制】高并发时，同步调用应该去考量锁的性能损耗。能用无锁数据结构，就不要用锁；能锁区块，就不要锁整个方法体；能用对象锁，就不要用类锁。**
>
> **说明：**  尽可能使加锁的代码块工作量尽可能的小，避免在锁代码块中调用 RPC 方法。

这条规范不仅仅是冷冰冰的教条，它是对 Java 内置锁 `synchronized` 原理的深刻总结。为什么不能锁整个方法？为什么对象锁优于类锁？RPC 调用为何是锁中大忌？

今天，我们就从这条规范出发，由浅入深，从**使用层面**到**字节码层面**，再到**JVM内核层面**，彻底拆解 `synchronized` 的工作机制。

---

## 第一层：表象 —— Synchronized 到底锁住了什么？

为了搞清楚锁的归属，我们通过一个 `Phone` 类进行四组对照实验。

```java
import java.util.concurrent.TimeUnit;

class Phone {
    // 1. 普通同步方法
    public synchronized void sendEmail() {
        try { TimeUnit.SECONDS.sleep(3); } catch (InterruptedException e) { e.printStackTrace(); }
        System.out.println(Thread.currentThread().getName() + "\t -----> sendEmail()");
    }

    // 2. 普通同步方法
    public synchronized void sendSMS() {
        System.out.println(Thread.currentThread().getName() + "\t -----> sendSMS()");
    }

    // 3. 静态同步方法
    public static synchronized void hello() {
        try { TimeUnit.SECONDS.sleep(3); } catch (InterruptedException e) { e.printStackTrace(); }
        System.out.println(Thread.currentThread().getName() + "\t -----> hello()");
    }

    // 4. 普通无锁方法
    public void openWeChat() {
        System.out.println(Thread.currentThread().getName() + "\t -----> openWeChat()");
    }
}
```

### 实验结论总结

经过多线程调用测试（具体代码省略，直接看结论），我们可以得出 `synchronized` 的三条核心铁律：

|锁类型|关键字位置|锁的对象 (Monitor 归属)|竞争规则|
| :-------| :--------------| :------------------------| :-----------------------------------------------------|
|**对象锁**|普通实例方法|**当前实例对象 (**​**​`this`​**​ **)**|同一个实例的多个同步方法互斥；不同实例之间互不干扰。|
|**类锁**|静态方法 (`static`)|**当前类的 Class 对象**|该类的所有实例共享这一把全局锁，竞争最激烈。|
|**代码块锁**|​`synchronized(obj)`|**括号内指定的对象**|开发者手动指定，粒度最细，也是阿规最推荐的方式。|

**注意：**  普通方法（无 `synchronized`）不受任何锁影响，线程可随时访问。

---

## 第二层：肌理 —— 字节码层面的实现

​`synchronized`​ 只是源码层面的关键字，JVM 到底怎么识别它？我们需要使用 `javap -c` 反编译字节码来看看真相。

### 1. 同步代码块：显式的指令

```java
Object object = new Object();
public void m1() {
    synchronized (object) {
        System.out.println("hello block");
    }
}
```

**字节码片段：**

```shell
 6: monitorenter      // 1. 抢锁
 7: ... (业务逻辑)
15: aload_1
16: monitorexit       // 2. 正常退出释放锁
17: goto 25
20: astore_2
21: aload_1
22: monitorexit       // 3. 异常退出释放锁（兜底）
23: aload_2
24: athrow
```

**核心发现：**

- ​**​`monitorenter`​**：尝试获取对象的监视器（Monitor）。
- ​**​`monitorexit`​**：释放监视器。
- **双重释放机制**：你会发现通常有**两个** `monitorexit`。第一个用于代码正常执行结束；第二个位于异常处理表中，确保即使代码块抛出异常，锁也能被释放，防止死锁。

> **冷知识**：如果编译器能确定代码块必定抛出异常（例如直接 `throw exception`​），它会优化掉正常路径的 `monitorexit`​，此时字节码中可能只有一个 `monitorexit`。

### 2. 同步方法：隐式的标志

```java
public synchronized void m2() { ... }
```

**字节码片段：**

```shell
public synchronized void m2();
  flags: ACC_PUBLIC, ACC_SYNCHRONIZED
  Code: ...
```

**核心发现：**   
同步方法没有 `monitorenter`​ 指令。JVM 调用方法时，会检查方法常量池中的 **​`ACC_SYNCHRONIZED`​** 访问标志。

- 如果设置了该标志，执行线程会自动先获取 Monitor，再执行方法，最后释放 Monitor。

---

## 第三层：内核 —— 为什么任何对象都能做锁？

为什么 `new Object()`​、`"Hello"`​ 甚至 `new Integer(1)` 都能当锁？这得益于 Java 对象在内存中的布局。

在 HotSpot 虚拟机中，对象在内存中包含三个部分：

1. **对象头 (Header)**
2. 实例数据 (Instance Data)
3. 对齐填充 (Padding)

### 秘密在于“对象头”

对象头中包含一个名为 **Mark Word** 的结构，它是实现锁的关键。Mark Word 是一个非固定的数据结构，根据对象状态的不同（无锁、偏向锁、轻量级锁、重量级锁），它存储的信息也不同。

当锁升级为**重量级锁**时，Mark Word 中会存储一个指向 **Monitor（监视器）**  的指针。

### Monitor (管程) 的真面目

Monitor 在 JVM 底层（C++）由 `ObjectMonitor` 实现。它才是真正的“锁管理器”。其核心属性如下：

- ​ **​`_owner`​**：指向当前持有锁的线程。
- ​ **​`_EntryList`​**​： **（等待室）**  所有正在竞争锁、处于阻塞状态的线程都在这里排队。
- ​ **​`_WaitSet`​**​： **（休息室）**  调用了 `wait()`​ 方法的线程在这里等待被 `notify`。
- ​ **​`_count`​**：记录锁的重入次数。

**工作流程简述：**   
当多个线程同时访问一段同步代码时：

1. 首先进入 `_EntryList` 集合。
2. 当线程获取到对象的 Monitor 后，将 `_owner`​ 设置为当前线程，同时 `_count` + 1。
3. 若线程调用 `wait()`​，则释放 Monitor，`_owner`​ 设为 NULL，进入 `_WaitSet` 集合。
4. 若线程执行完毕，释放 Monitor，`_owner` 设为 NULL，其他线程继续争抢。

---

## 第四层：总结与面试高频 Q&A

回到开篇的阿里规范，现在我们不仅知其然，更知其所以然。

- **不要锁整个方法** $\rightarrow$ 减小 `monitorenter`​ 和 `exit`​ 之间的指令数量，缩短持有 `_owner` 的时间。
- **不要在锁中 RPC** $\rightarrow$ 防止网络延迟导致 `_owner`​ 长期不释放，导致 `_EntryList` 爆满，拖垮系统。

最后，我们将本文的核心知识点总结为几道高频面试题：

### Q1: 为什么 Java 中任何对象都可以作为锁？

**A:**  因为 Java 对象在堆内存中都有一个**对象头（Object Header）** 。对象头中的 **Mark Word** 区域被设计用来存储锁的状态信息（如偏向锁 ID、轻量级锁记录指针）。当升级为重量级锁时，Mark Word 会指向一个操作系统级别的 **Monitor（监视器）**  对象，从而实现线程同步。

### Q2: synchronized 修饰方法和修饰代码块，在字节码层面上有什么区别？

**A:**

- **修饰代码块**：通过 **​`monitorenter`​**​ 和 **​`monitorexit`​**​ 指令显式实现。通常为了保证异常时也能释放锁，编译器会生成两个 `monitorexit` 指令（一个正常退出，一个异常退出）。
- **修饰方法**：是隐式的。字节码中没有特定指令，而是通过方法常量池中的 **​`ACC_SYNCHRONIZED`​** 访问标志。JVM 在执行该方法前会自动检查该标志并尝试加锁。

### Q3: 为什么阿里规范建议“能锁区块，就不要锁整个方法”？

**A:**  这涉及锁的**粒度**问题。  
底层 `ObjectMonitor`​ 的争抢是互斥的。锁的范围越大，代码执行时间越长，当前线程持有 `_owner`​ 的时间就越久。这会导致其他线程在 `_EntryList` 中阻塞等待的时间变长，系统并发吞吐量大幅下降。锁区块可以精确控制临界区，让锁的持有时间最短化。

### Q4: 谈谈 synchronized 的底层重量级锁模型（Monitor）是如何工作的？

**A:**  底层依赖于 C++ 实现的 `ObjectMonitor` 对象。它主要包含三个关键区域：

1. ​ **​`_owner`​**：记录当前持有锁的线程。
2. ​ **​`_EntryList`​**：由于锁被占用，导致无法获取锁的线程会被封装成 ObjectWaiter 对象挂入此队列（阻塞状态）。
3. ​ **​`_WaitSet`​**​：获取锁后调用了 `wait()`​ 方法的线程会进入此队列，释放锁并等待唤醒。  
    线程争抢锁本质上就是竞争修改 `_owner` 指向自己的过程。
