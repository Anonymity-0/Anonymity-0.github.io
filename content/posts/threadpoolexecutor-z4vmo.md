---
title: ThreadPoolExecutor
slug: threadpoolexecutor-z4vmo
url: /post/threadpoolexecutor-z4vmo.html
date: '2025-09-14 19:51:38+08:00'
lastmod: '2025-09-16 21:42:51+08:00'
tags:
  - juc
categories:
  - Java八股文
keywords: juc
toc: true
isCJKLanguage: true
---





## **为什么我们需要线程池？**

我们通常这样创建一个线程来执行任务：

- 继承Thread

```java
public class ThreadPoolExecutorDemo {

    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.start();

        System.out.println("主线程结束");
    }

    static class MyThread extends Thread{

        @Override
        public void run() {
            System.out.println("this is MyThread");
        }
    }
}
```

- 实现Runnable

```java
public class ThreadPoolExecutorDemo {

    public static void main(String[] args) {

        //1. 使用匿名内部类的写法
        Thread t0 = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("子线程t0");
            }
        });
        t0.start();

        //2. 使用lambda表达式的写法
        Thread t1 = new Thread(()->{
            System.out.println("这是子线程t1");
        });
        t1.start();

        System.out.println("主线程结束");
    }


}

```

- 实现Callable

```java
public class ThreadPoolExecutorDemo {

    public static void main(String[] args) {

        //把Callable对象传给FutureTask
        FutureTask<String> futureTask = new FutureTask(new Callable() {
            @Override
            public Object call() throws Exception {
                return "子线程futuretask";
            }
        });

        Thread t3 = new Thread(futureTask);
        t3.start();

        //这里是个阻塞方法，会等待子线程返回result后，主线程才会继续执行
        try {
            String result = futureTask.get();
            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("主线程结束");
    }


}

```

‍

以上我们都是在需要的时候创建一个线程，这样的话如果我们服务器请求数量增大的时候，每次需要时候开启一个线程，会有如下副作用：

1.每个线程创建和销毁是需要额外的系统资源，如果**频繁创建和销毁必然会导致消耗大量的系统资源**，很多时候，我们的线程执行所耗费的资源可能比创建与销毁这个线程还要少。

2.每个线程运行时候也是需要消耗系统资源，如果我们不**控制线程的数量**，任意创建，那么系统中可能会线程泛滥，造成CPU频繁的在多线程之间来回切换，导致系统性能下降；另外也避免线程过多，耗尽系统资源。

‍

ThreadPoolExecutor 的诞生，就是为了在多线程编程的混沌中建立秩序。它的核心使命是：**通过线程复用，实现对线程生命周期的统一管理，从而达到提升性能、控制资源、增强系统稳定性的目的。**

### 线程池的创建

线程池的创建方式包括直接使用构造方法创建和使用线程池工厂创建两种方式。

1. **构造方法创建线程池**

直接创建线程池是通过实例化ThreadPoolExecutor类来创建线程池。可以使用ThreadPoolExecutor的构造函数来指定线程池的核心线程数、最大线程数、任务队列、拒绝策略等参数，然后调用execute()方法提交任务。  

```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    corePoolSize, // 核心线程数
    maximumPoolSize, // 最大线程数
    keepAliveTime, // 线程空闲时间
    TimeUnit.MILLISECONDS, // 时间单位
    new LinkedBlockingQueue<Runnable>(), // 任务队列
    new ThreadPoolExecutor.AbortPolicy() // 拒绝策略
);
executor.execute(task); // 提交任务
executor.shutdown(); // 关闭线程池
```

2. 使用线程池工厂

线程池工厂是通过Executors类提供的静态方法来创建线程池。Executors类提供了一些常用的线程池创建方法，例如newFixedThreadPool()、newCachedThreadPool()、newSingleThreadExecutor()等。这些方法封装了线程池的创建过程，简化了线程池的配置。

```java
ExecutorService executor = Executors.newFixedThreadPool(10); // 创建固定大小的线程池
executor.execute(task); // 提交任务
executor.shutdown(); // 关闭线程池
```

使用线程池工厂创建线程池可以方便地选择合适的线程池类型，并且无需手动配置线程池的各个参数。

很多java规范不建议通过Executors这种方式创建线程池，就是因为很多参数给的都是默认值，比如核心线程数跟最大线程数一致，无界队列（最大值Integer.MAX\_VALUE）、线程最大空闲时间为0等，可能由于这些默认参数不满足业务场景导致CPU飙升内存溢出等问题，因结合评估业务场景使用合适的参数创建线程池。

## ThreadPoolExecutor类分析

‍

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/image-20250914212632-jk8q4uh.png)

- ​`Executor`: 提交任务的基础接口，只有一个`execute`方法。
- ​`ExecutorService`: 继承自Executor，它提供管理终止的方法，以及可以产生Future的方法，用于跟踪一个或多个异步任务的进度。
- ​`AbstractExecutorService`: 提供ExecutorService执行方法的默认实现。
- ​`ThreadPoolExecutor`: 线程池类本类，实现了线程池的核心逻辑。
- ​`Worker`: ThreadPoolExecutor的[内部类](https://zhida.zhihu.com/search?content_id=216228446&content_type=Article&match_order=1&q=%E5%86%85%E9%83%A8%E7%B1%BB&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NTgwMjA0NjIsInEiOiLlhoXpg6jnsbsiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMTYyMjg0NDYsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.FU_aoAFPjFNM8HiNUvSn1zFgWCb3cJgbGq6Hc1W0UGI&zhida_source=entity)，工作线程类，继承自 AQS。
- ​`*Policy`: 其他Policy结尾的都是内置的决策策略类。

‍

### Executor

Executor接口只定义了一个基础的execute方法。

```java
public interface Executor {
    /**
	 * 核心且基础的任务执行方法
	 */
    void execute(Runnable command);
}
```

### ExecutorService

ExecutorService接口定义了线程池的一些常用操作。

```java
public interface ExecutorService extends Executor {
 
    /**
	 * 终止线程池，不再接受新任务，会将阻塞队列的任务执行完成
	 */
    void shutdown();
 
    /**
     * 立即终止线程池，阻塞队列的任务不再执行，返回未执行任务集合
     */
    List<Runnable> shutdownNow();
 
    /**
     * 判断线程池状态是否停掉，只要线程池不是RUNNING状态，都返回true
     */
    boolean isShutdown();
 
    /**
     * 判断线程池是否完全终止，状态是TERMINATED
     */
    boolean isTerminated();
 
    /**
     * 阻塞等待，直到线程池是TERMINATED状态
     */
    boolean awaitTermination(long timeout, TimeUnit unit)
        throws InterruptedException;
 
    /**
     * 提交Callable任务，返回Future
     */
    <T> Future<T> submit(Callable<T> task);
 
    /**
     * 提交Runnable任务，返回Future，Future的get方法返回值就是result参数
     */
    <T> Future<T> submit(Runnable task, T result);
 
    /**
     * 提交Runnable任务，返回Future，Future的get方法返回值是null
     */
    Future<?> submit(Runnable task);
 
    /**
     * 执行所有的Callable任务集合
     */
    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks)
        throws InterruptedException;
 
    /**
     * 执行所有的Callable任务集合，等待返回带超时时间
     */
    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks,
                                  long timeout, TimeUnit unit)
        throws InterruptedException;
 
    /**
     * 执行所有的Callable任务集合，返回其中最先执行完成的一个任务结果
     */
    <T> T invokeAny(Collection<? extends Callable<T>> tasks)
        throws InterruptedException, ExecutionException;
 
    /**
     * 执行所有的Callable任务集合，返回其中最先执行完成的一个任务结果，等待返回带超时时间
     */
    <T> T invokeAny(Collection<? extends Callable<T>> tasks,
                    long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException;
}
```

### AbstractExecutorService

AbstractExecutorService是一个抽象类，实现了接口的一些方法，未实现的方法继续留给子类实现。

```java
public abstract class AbstractExecutorService implements ExecutorService {
 
    /**
     * 将Runnable封装成RunnableFuture
     */
    protected <T> RunnableFuture<T> newTaskFor(Runnable runnable, T value) {
        return new FutureTask<T>(runnable, value);
    }
 
    /**
     * 将Callable封装成RunnableFuture
     */
    protected <T> RunnableFuture<T> newTaskFor(Callable<T> callable) {
        return new FutureTask<T>(callable);
    }
 
    /**
     * 提交Runnable任务，返回Future，真正执行任务的是子类实现的execute方法
     */
    public Future<?> submit(Runnable task) {
        if (task == null) throw new NullPointerException();
        RunnableFuture<Void> ftask = newTaskFor(task, null);
        execute(ftask);
        return ftask;
    }
 
    /**
     * 提交Runnable任务，返回Future，Future的get方法返回值是result参数的值
     */
    public <T> Future<T> submit(Runnable task, T result) {
        if (task == null) throw new NullPointerException();
        RunnableFuture<T> ftask = newTaskFor(task, result);
        execute(ftask);
        return ftask;
    }
 
    /**
     * 提交Callable任务，返回Future
     */
    public <T> Future<T> submit(Callable<T> task) {
        if (task == null) throw new NullPointerException();
        RunnableFuture<T> ftask = newTaskFor(task);
        execute(ftask);
        return ftask;
    }
	// 其他invoke相关方法默认实现使用场景较少，这里不再列出具体方法逻辑了，可自行阅读源码
    ...
 
}
```

‍

### ThreadPoolExecutor

ThreadPoolExecutor类是线程池核心类，也是本文重点分析的源码类，该类具体实现了创建线程池、提交任务、添加工作线程、终止线程池等操作。

### ScheduledThreadPoolExecutor

ScheduledThreadPoolExecutor是可任务调度的线程池通过扩展ThreadPoolExecutor实现的，比如典型的延迟执行等功能。

‍

‍

接下来会通过各个环节分析ThreadPoolExecutor源码及流程

### 成员变量

ThreadPoolExecutor 内部还有一些至关重要的成员变量

```java
public class ThreadPoolExecutor extends AbstractExecutorService {

    // --- 1. 核心状态控制器 ---
    private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
    // ... ctl 相关的常量和方法 ...

    // --- 2. 核心组件 ---
    /**
     * 用于存放待执行任务的阻塞队列。
     * 它的选择（有界/无界）是线程池策略的核心。
     */
    private final BlockingQueue<Runnable> workQueue;

    /**
     * 全局可重入锁，用于保护需要线程安全访问的成员，主要是 `workers` 集合。
     * 它还用于确保 shutdown/shutdownNow 操作的原子性。
     */
    private final ReentrantLock mainLock = new ReentrantLock();

    /**
     * 包含池中所有 Worker 线程的集合。
     * 对该集合的所有访问（增、删、遍历）都必须在持有 `mainLock` 的情况下进行。
     */
    private final HashSet<Worker> workers = new HashSet<>();

    /**
     * 用于支持 awaitTermination 方法的条件变量，与 `mainLock` 关联。
     * 当线程池终止时，会通过 `termination.signalAll()` 唤醒等待的线程。
     */
    private final Condition termination = mainLock.newCondition();

    // --- 3. 线程池配置参数 (volatile) ---
    // 这些参数被声明为 volatile，以确保在一个线程修改后，其他线程能立即看到最新值。
    // 这对于运行时的动态调整至关重要。

    /**
     * 线程工厂，用于创建新的工作线程。
     */
    private volatile ThreadFactory threadFactory;

    /**
     * 拒绝策略处理器，在线程池和队列都饱和时调用。
     */
    private volatile RejectedExecutionHandler handler;

    /**
     * 非核心线程的空闲存活时间（纳秒）。
     */
    private volatile long keepAliveTime;

    /**
     * 是否允许核心线程超时。默认为 false。
     * 如果为 true，核心线程也会在空闲时间超过 keepAliveTime 后被回收。
     */
    private volatile boolean allowCoreThreadTimeOut;

    /**
     * 核心线程数。
     */
    private volatile int corePoolSize;

    /**
     * 最大线程数。
     */
    private volatile int maximumPoolSize;

    // --- 4. 统计与监控信息 ---

    /**
     * 记录线程池生命周期内曾经达到的最大线程数。
     * 仅在持有 `mainLock` 时访问。
     */
    private int largestPoolSize;

    /**
     * 已完成任务的总数。
     * 仅在持有 `mainLock` 时更新（在 processWorkerExit 中）。
     */
    private long completedTaskCount;

    // --- 5. 默认值与权限 ---
    private static final RejectedExecutionHandler defaultHandler = new AbortPolicy();
    private static final RuntimePermission shutdownPerm = new RuntimePermission("modifyThread");

    // ... Worker 内部类定义 ...
}
```

‍

## ThreadPoolExecutor七个参数

要理解一个系统，首先要理解它的配置。ThreadPoolExecutor 的七大参数就是它的“配置蓝图”，定义了其所有的行为特性。

```java
   
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) 
```

1. 核心线程数（corePoolSize）

核心线程数指的是**线程池中一直保持活动的线程数量**，即使它们处于空闲状态（除非设置允许核心参数超时销毁）。这是线程池的“常备军”。corePoolSize 的设定决定了线程池能同时处理的**基本并发任务量**。一个合理的 corePoolSize 可以确保线程池在大部分时间里都能快速响应任务，因为核心线程是“热”的，无需创建即可执行。  
特例：**如果调用 allowCoreThreadTimeOut(true)，那么核心线程在空闲时间超过 keepAliveTime 后也会被回收。**

2. 最大线程数（maximumPoolSize）

最大线程数指的是**线程池中允许的最大线程数量**。当线程池中线程数量超过核心线程数并且任务队列已满时，线程池会创建新的线程来执行任务，直到达到最大线程数。超过最大线程数的任务将根据**拒绝策略**进行处理。

3. 线程空闲时间（keepAliveTime）

线程空闲时间指的是**当线程池中的线程数量超过核心线程数时，多余的空闲线程在被回收之前的等待时间**。如果线程在等待时间内没有任务可执行，则会被终止并从线程池中移除。

这是线程池资源“弹性伸缩”的关键。在任务高峰期过后，通过回收空闲的非核心线程，线程池可以将资源占用降低到 corePoolSize 的水平，**避免长期占用不必要的资源**。

4. TimeUnit unit  
    定义：keepAliveTime 的时间单位（如秒、毫秒等）。

5. 任务队列（workQueue）

任务队列用于**存放待执行的任务**，采用的是阻塞队列，获取元素时如果队列为空则阻塞直到队列中放入任务被唤醒。当线程池中的线程数量达到核心线程数时，新的任务会被放入任务队列中等待执行。

- ArrayBlockingQueue：**有界队列**。能有效防止资源耗尽，但需要合理评估队列大小，否则易触发拒绝策略。
- LinkedBlockingQueue：**无界队列**（默认容量 Integer.MAX_VALUE）。会导致 maximumPoolSize 参数失效，因为队列永远不会满，线程数最多只会增长到 corePoolSize。适用于任务量可控的场景，但要警惕内存溢出风险。
- SynchronousQueue：**不存储元素的队列**。每个 put 操作必须等待一个 take 操作。这会强制线程池在任务到来时，如果没有空闲线程，就必须立即创建新线程（直到 maximumPoolsize），非常适合需要快速响应、任务处理时间短的场景。

‍

6. 拒绝策略（handler）

拒绝策略定义了当任务无法被线程池执行时的处理方式。当任务队列已满且无法继续添加任务时，线程池会根据拒绝策略来决定如何处理这个任务。JDK 提供了四种预设策略：

- AbortPolicy (默认)：**抛出 RejectedExecutionException 异常**，最直接地将压力反馈给调用方。

```java
public static class AbortPolicy implements RejectedExecutionHandler {
    public AbortPolicy() { }
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        throw new RejectedExecutionException("Task " + r.toString() +
                                             " rejected from " +
                                             e.toString());
    }
}
```

- CallerRunsPolicy：**由提交任务的线程自己来执行该任务**。这是一种巧妙的“反压”机制，调用方线程被占用，自然会减慢其提交任务的速度。

```java

public static class CallerRunsPolicy implements RejectedExecutionHandler {
    public CallerRunsPolicy() { }
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            r.run();
        }
    }
}
```

- DiscardPolicy：**静默地丢弃任务**，不做任何处理。适用于允许任务丢失的场景。

```java
public static class DiscardPolicy implements RejectedExecutionHandler {
    public DiscardPolicy() { }
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
    }
}
```

- DiscardOldestPolicy：丢弃等待队列中等待最久的任务，然后重新尝试提交当前任务。

```java
public static class DiscardOldestPolicy implements RejectedExecutionHandler {
    public DiscardOldestPolicy() { }
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            e.getQueue().poll();
            e.execute(r);
        }
    }
}
```

7. ThreadFactory threadFactory (线程工厂)

    线程工厂提供了对线程创建过程的完全控制。可以通过自定义 ThreadFactory 来实现：

    - 为线程池的线程设置有意义的**名称**（如 my-pool-thread-1），极大地方便了问题排查和性能分析。
    - 将线程设置为**守护线程**（setDaemon(true)）。
    - 设置线程的**优先级**。
    - 为线程设置自定义的 UncaughtExceptionHandler。

‍

除了7个核心参数之外，ThreadPoolExecutor还有一个非常重要的成员变量

## ctl 原子状态控制器

Doug Lea 通过一个 AtomicInteger 变量，无锁化地管理了线程池的两种核心状态。

线程的状态信息和数量信息用同一个int的原子变量存储，高3位存储状态信息，低29位存储线程数量。

通过将线程池的状态和线程数量合二为一，可以做到**一次CAS原子操作更新数据**。

```java
// ctl (control) 是一个复合状态变量
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));

// Integer.SIZE 是 32。COUNT_BITS = 32 - 3 = 29。
// 定义了 workerCount 占用的位数。
private static final int COUNT_BITS = Integer.SIZE - 3;
// COUNT_MASK: 00011111111111111111111111111111
// 一个位掩码，用于从 ctl 中提取 workerCount。
private static final int COUNT_MASK = (1 << COUNT_BITS) - 1;

// 线程池的 5 种状态，存储在 ctl 的高 3 位。
// 它们的值被精心设计成单调递增的，便于进行范围比较。
private static final int RUNNING    = -1 << COUNT_BITS; // 111...
private static final int SHUTDOWN   =  0 << COUNT_BITS; // 000...
private static final int STOP       =  1 << COUNT_BITS; // 001...
private static final int TIDYING    =  2 << COUNT_BITS; // 010...
private static final int TERMINATED =  3 << COUNT_BITS; // 011...

// --- ctl 的打包与解包方法 ---
private static int runStateOf(int c)     { return c & ~COUNT_MASK; }
private static int workerCountOf(int c)  { return c & COUNT_MASK; }
private static int ctlOf(int rs, int wc) { return rs | wc; }
```

‍

将状态可视化

|状态|高3位值|说明|
| ------------| ---------| ------------------------------------------------------------------------------------|
|RUNNING|111|运行状态，线程池被创建后的初始状态，能接受新提交的任务，也能处理阻塞队列中的任务。|
|SHUTDOWN|000|关闭状态，不再接受新提交的任务，但可以处理阻塞队列中的任务。|
|STOP|001|停止状态，会中断正在处理的线程，不能接受新提交的任务，也不会处理阻塞队列中的任务。|
|TIDYING|010|所有任务都已经终止，有效工作线程为0。|
|TERMINATED|011|终止状态，线程池彻底终止。|

这是状态之间的流转图

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/image-20250914211159-svlx923.png)

#### cas设置ctl的值

线程池的很多决策，例如“**是否应该创建新线程**？”，需要同时依赖于 runState 和 workerCount。如果这两个是独立的 volatile 变量，那么在你读取 runState 之后、读取 workerCount 之前，**可能另一个线程已经修改了它们，导致你的决策基于了过时且不一致的数据。** 要保证一致性，就必须加锁，而锁会带来性能开销和死锁风险。

ctl 将两个变量打包，使得可以通过一次 **CAS (Compare-And-Swap)**  操作同时对它们进行检查和更新。例如，`compareAndIncrementWorkerCount` 方法，它实际上是在说：“如果 ctl 的当前值还是我期望的 `expect`（意味着状态和线程数都没变），那么就原子性地把它更新为` expect + 1`（线程数加一）”。这是一种高效的乐观锁实现，避免了重量级的互斥锁。

```java
// 使用 CAS 方式 让 ctl 值 +1 ，成功返回 true, 失败返回 false
private boolean compareAndIncrementWorkerCount(int expect) {
    return ctl.compareAndSet(expect, expect + 1);
}
// 使用 CAS 方式 让 ctl 值 -1 ，成功返回 true, 失败返回 false
private boolean compareAndDecrementWorkerCount(int expect) {
    return ctl.compareAndSet(expect, expect - 1);
}
// 将 ctl 值减一，do while 循环会一直重试，直到成功为止
private void decrementWorkerCount() {
    do {} while (!compareAndDecrementWorkerCount(ctl.get()));
}
```

‍

## 任务提交

![image-20220609222015253](https://woniumd.oss-cn-hangzhou.aliyuncs.com/java/yangguang/20220609222015.png)

当一个新任务被提交至 ThreadPoolExecutor 时，首先，线程池会检查当前运行的线程数是否已达到 **corePoolSize**，若未达到，则会立即创建一个**新的核心线程**来执行此任务。如果核心线程数已满，任务将被尝试放入配置的 workQueue 等待队列中。若队列已满而无法接收，线程池会进行最后一步扩容尝试：检查当前总线程数是否达到了 maxiPoolSize，若未达到，则会创建一个新的**非核心线程**来处理该任务。如果连这一步也无法满足，即线程总数和队列容量均已饱和，线程池将不再接收，并通过 **RejectedExecutionHandler** 执行既定的拒绝策略。

### execute方法

线程池创建完成之后，就可以提交任务到线程池去执行了，提交任务有两种方法，一种是submit，一种是execute。submit方法提交到线程池后会返回一个Future对象，可以使用Future跟踪线程执行是否执行完成及获取结果，其实是将任务封装成RunnableFuture对象，真正的执行也是调用的execute方法，而execute方法不带返回值。

```java
// 提交Runnable任务，返回Future对象
public Future<?> submit(Runnable task) {
    if (task == null) throw new NullPointerException();
    RunnableFuture<Void> ftask = newTaskFor(task, null);
    execute(ftask);
    return ftask;
}
// 提交Runnable任务，返回Future对象，带返回值result
public <T> Future<T> submit(Runnable task, T result) {
    if (task == null) throw new NullPointerException();
    RunnableFuture<T> ftask = newTaskFor(task, result);
    execute(ftask);
    return ftask;
}
// 提交Callable任务，返回Future对象，具体的返回值是实现Callable的call方法的返回值。
public <T> Future<T> submit(Callable<T> task) {
    if (task == null) throw new NullPointerException();
    RunnableFuture<T> ftask = newTaskFor(task);
    execute(ftask);
    return ftask;
}
```

接下来让我们详细解析execute方法

```java
public void execute(Runnable command) {
    if (command == null)
        throw new NullPointerException();
    
    int c = ctl.get();

    // --- 步骤 1: 核心线程调度 ---
    // 如果当前工作线程数小于核心线程数，优先创建核心线程。
    if (workerCountOf(c) < corePoolSize) {
        // addWorker 尝试原子性地增加 workerCount 并创建一个 Worker。
        // `true` 表示这是一个核心线程的调度尝试。
        if (addWorker(command, true))
            return; // 成功，任务已被新线程接管。
        c = ctl.get(); // addWorker 失败，重新读取 ctl，进入后续流程。
    }

    // --- 步骤 2: 队列缓冲 ---
    // 如果核心线程已满，或步骤1创建失败，尝试将任务入队。
    // isRunning(c) 是一个检查 c < SHUTDOWN 的便捷方法。
    if (isRunning(c) && workQueue.offer(command)) {
        int recheck = ctl.get();
        // **双重检查 (Double-Check) - 并发控制的关键**
        // 检查1: 在任务成功入队后，再次检查线程池是否已关闭。
        if (!isRunning(recheck) && remove(command)) {
            // 这是一个竞态条件处理：如果在 offer 之后，线程池被 shutdown，
            // 那么这个刚入队的任务需要被移除并拒绝，否则会造成任务丢失。
            reject(command);
        }
        // 检查2: 如果线程池仍在运行，但工作线程数为 0。
        else if (workerCountOf(recheck) == 0) {
            // 这种情况可能发生在：任务入队时，所有线程都因异常或其他原因终止了。
            // 此时必须创建一个新线程，否则队列中的任务将永远得不到执行。
            addWorker(null, false);
        }
    }
    // --- 步骤 3: 最大线程调度 ---
    // 如果队列已满 (offer 返回 false)，则进行最后一次尝试。
    else if (!addWorker(command, false)) {
        // 尝试创建非核心线程。如果 addWorker 返回 false，
        // 说明当前线程数已达到 maximumPoolSize，线程池已完全饱和。
        reject(command);
    }
}
```

可以看到其中addWoker方法是非常重要的，Worker 是 ThreadPoolExecutor 的动力核心，它既是线程的载体，又是状态的控制器。

### Worker 为什么是一把锁 (AQS)

想象一下你是一家繁忙餐厅的经理。餐厅里有一群服务员（Worker 线程）。作为经理，你需要处理两个日常管理问题：

1. **安排轮休**：在餐厅客人不多的时候（比如下午茶时段），您想让那些 当前正站着没事干、等着接新客人 的服务员先去休息室轮休 (`shutdown() `时中断空闲线程)。但您绝对不能打扰那些正在为客人点餐、上菜的服务员。
2. **评估繁忙度**：在高峰期，您需要快速知道 当前有多少服务员正在服务客人 (`getActiveCount()`)，以便决定是否需要从后厨再叫人出来帮忙。

怎么判断一个服务员是“空闲”还是“忙碌”呢？

你可能会想：“很简单，我去看看员工的状态 Thread.getState() 就行了。”  
很快会发现问题：

- 一个正在从队列里等待任务的空闲线程，它的状态是 WAITING 或 TIMED_WAITING。
- 一个正在执行任务，但任务代码中恰好因为等待某个锁或资源而阻塞的忙碌线程，它的状态也可能是 WAITING 或 TIMED_WAITING。

**Thread.getState() 无法精确区分“业务上的空闲”和“技术上的阻塞”。**  需要一个更可靠的、能反映 业务状态 的机制。

于是你决定给每个服务员发一个双面的 “状态翻牌器”。这个翻牌器放在服务员胸前的口袋里，只有两面：

- 绿色面朝外：表示 “可接待” (Available)。
- 红色面朝外：表示 “服务中” (Serving)。

每个服务员在接到一个新客人的点餐单时，必须 立即将翻牌器翻到“服务中”（红色）。当他完成了这桌客人的所有服务（上完菜、结完账）后，必须 立即将翻牌器翻回“可接待”（绿色）。

有了这个翻牌器，管理问题迎刃而解：  
安排轮休时：您只需扫视大厅，所有胸前是 **绿色牌子** 的服务员，都可以让他们去休息。  
评估繁忙度时：您只需数一数有多少个胸前是 **红色牌子** 的服务员，就能知道当前的繁忙程度。  
这个 “服务状态翻牌器”，就是 ThreadPoolExecutor 中 Worker 类实现的那把锁

**AQS 的核心 state 变量非常适合用来制作这个翻牌器。**   
​`state == 0`：代表翻牌器是 绿色面“可接待”。我们称之为 “未锁定” 状态。  
​`state == 1`：代表翻牌器是 红色面“服务中”。我们称之为 “已锁定” 状态。

```java
private final class Worker
    // 继承 AQS，赋予 Worker 锁的特性。
    extends AbstractQueuedSynchronizer
    // 实现 Runnable，使其能被 Thread 执行。
    implements Runnable
{
    // Worker 内部封装的实际执行线程。
    final Thread thread;
    // Worker 创建时被赋予的第一个任务。
    Runnable firstTask;
    // ...

    Worker(Runnable firstTask) {
        // 调用 AQS 的 setState(-1)，在构造期间暂时禁止中断。
        setState(-1); 
        this.firstTask = firstTask;
        this.thread = getThreadFactory().newThread(this);
    }

    public void run() {
        runWorker(this);
    }

    // --- AQS 实现：一把不可重入的互斥锁 ---
    // 这个锁并非给用户使用，而是线程池内部用来判断 Worker 状态的机制。
    // state == 0: 未锁定，表示 Worker 空闲（在 getTask() 中等待）。
    // state == 1: 已锁定，表示 Worker 忙碌（正在执行任务）。
    protected boolean tryAcquire(int unused) {
        if (compareAndSetState(0, 1)) {
            setExclusiveOwnerThread(Thread.currentThread());
            return true;
        }
        return false;
    }
    // ... lock(), unlock(), isLocked() 等方法 ...
}
```

‍

#### 特别说明：setState(-1) 的作用

在 Worker 的构造函数中，setState(-1) 相当于服务员刚入职，正在“岗前培训”，他的翻牌器还没发下来。这可以防止一个新来的、还没开始正式工作的服务员，被经理错误地当作“空闲”而安排去轮休。当 runWorker 方法开始，服务员正式上岗时，第一件事就是 w.unlock()，把翻牌器领到手并设置为“可接待”（绿色）。

‍

### addWorker() - 线程的创建与注册

这是线程池中逻辑最复杂的函数之一，因为它要在高并发环境下原子性地完成“检查条件、更新 ctl、创建对象、注册到集合”这一系列操作。

addWorker 是线程池中逻辑最复杂、并发控制最精细的函数之一。它的核心任务是安全地创建一个新的工作线程并启动它。我们可以将这个精密的过程划分为两个主要阶段：

- 第一阶段：抢占名额 (无锁 CAS)。此阶段在无锁的环境下，通过 CAS 自旋来原子性地更新 ctl 中的 `workerCount`。这相当于在公司的“编制系统”里抢先注册一个新员工的名额。此阶段只与` ctl `交互，速度极快。
- 第二阶段：办理入职 (加锁操作)。在成功抢占名额后，此阶段负责创建 Worker 对象和底层的 Thread，并将其安全地添加到 workers 集合中。由于 workers 是一个非线程安全的 HashSet，此阶段必须在 `mainLock `的保护下进行。这相当于新员工的“入职手续办理”。

```java
/**
 * 添加工作线程
 * @param firstTask 初始任务，可以为 null。如果非 null，新线程将直接执行此任务，而不是从队列获取。
 * @param core      用于区分此次添加的目标是核心线程还是非核心线程。
 *                  - true:  尝试添加核心线程，上限为 corePoolSize。
 *                  - false: 尝试添加非核心线程，上限为 maximumPoolSize。
 */
private boolean addWorker(Runnable firstTask, boolean core) {
    // =================================================================
    // ==                  第一阶段: 抢占名额 (无锁 CAS)                  ==
    // =================================================================
    retry: // 使用 retry 标签，便于在内层循环中直接跳出外层循环。
    for (;;) {
        int c = ctl.get();
        int rs = runStateOf(c);
 
        // 前置条件检查：判断当前状态是否允许添加新线程。
        // 如果线程池状态 >= SHUTDOWN，通常不允许添加。
        // 但有一个例外：在 SHUTDOWN 状态下，如果 firstTask 为 null 且队列非空，
        // 允许添加一个没有初始任务的 Worker，用于处理队列中的存量任务。
        if (rs >= SHUTDOWN &&
            ! (rs == SHUTDOWN &&
               firstTask == null &&
               ! workQueue.isEmpty()))
            return false;

        // 内层循环：通过自旋 + CAS 来原子性地增加 workerCount。
        for (;;) {
            int wc = workerCountOf(c);
            // 容量检查：判断是否已达到上限。
            // CAPACITY 是 (2^29)-1，是一个理论上限。
            // 核心判断是 wc 是否达到了 corePoolSize 或 maximumPoolSize。
            if (wc >= CAPACITY ||
                wc >= (core ? corePoolSize : maximumPoolSize))
                return false;

            // **关键原子操作**: 尝试将 workerCount 加 1。
            if (compareAndIncrementWorkerCount(c))
                break retry; // CAS 成功！已抢占名额，跳出所有循环，进入第二阶段。

            c = ctl.get();  // CAS 失败，说明 ctl 被并发修改，重新读取最新值。
            // 状态检查：如果 runState 发生了变化，需要回到外层循环重新进行前置条件检查。
            if (runStateOf(c) != rs)
                continue retry;
            // 如果 runState 未变，仅 workerCount 变化，则继续在内层循环尝试 CAS。
        }
    }

    // =================================================================
    // ==                  第二阶段: (加锁操作)                  ==
    // =================================================================
    boolean workerStarted = false;
    boolean workerAdded = false;
    Worker w = null;
    try {
        // 1. 创建 Worker 对象。Worker 的构造函数会通过 ThreadFactory 创建一个真正的 Thread。
        w = new Worker(firstTask);
        final Thread t = w.thread;
        if (t != null) {
            // 2. 加全局锁，准备修改共享的 workers 集合。
            final ReentrantLock mainLock = this.mainLock;
            mainLock.lock();
            try {
                // 在持有锁的情况下，再次检查线程池状态。
                // 这是最后的保障，防止在 CAS 成功后、获取锁的过程中，线程池状态发生改变。
                int rs = runStateOf(c.get());
                if (rs < SHUTDOWN ||
                    (rs == SHUTDOWN && firstTask == null)) {
                    // 线程不应在此时是活的，这是一个防御性检查。
                    if (t.isAlive())
                        throw new IllegalThreadStateException();
                    
                    // 3. 将新 Worker 添加到 workers 集合中，完成“登记”。
                    workers.add(w);
                    int s = workers.size();
                    // 更新线程池生命周期内曾经达到的最大线程数。
                    if (s > largestPoolSize)
                        largestPoolSize = s;
                    workerAdded = true;
                }
            } finally {
                mainLock.unlock();
            }
            if (workerAdded) {
                // 4. 启动线程，新员工正式开始工作。
                t.start();
                workerStarted = true;
            }
        }
    } finally {
        // **异常回滚处理**
        // 如果第二阶段的任何一步失败（如 ThreadFactory 返回 null, 线程启动异常），
        // 必须撤销第一阶段的操作。
        if (! workerStarted)
            addWorkerFailed(w);
    }
    return workerStarted;
}
```

#### **addWorkerFailed(Worker) - 严谨的失败回滚机制**

addWorker 的健壮性很大程度上体现在其失败处理上。addWorkerFailed 就是这个回滚机制的核心。

```java
private void addWorkerFailed(Worker w) {
    final ReentrantLock mainLock = this.mainLock;
    // 同样，对 workers 的操作和后续的 tryTerminate 都需要锁保护。
    mainLock.lock();
    try {
        // 如果 Worker 对象已创建并可能已添加到集合中，则移除它。
        if (w != null)
            workers.remove(w);
        
        // **核心回滚**: 将第一阶段增加的 workerCount 减回去。
        decrementWorkerCount();
        
        // 检查此次失败是否导致线程池满足终止条件。
        // 例如，可能这是最后一个潜在的线程，它的创建失败导致线程池变为空，
        // 从而可以进入 TIDYING 状态。
        tryTerminate();
    } finally {
        mainLock.unlock();
    }
}
```

‍

#### **​`addWorker`​** **参数组合的深度解析**

​`addWorker` 的两个参数 `firstTask` 和 `core` 的不同组合，对应了线程池在不同场景下的线程创建策略。

|​`firstTask` (Runnable)|​`core` (boolean)|场景与作用|
| :----------------| :---------------| :-----------------------------------------------------------------------------------------------------------------------------|
|​`command` (非 null)|​`true`​|**标准核心线程创建**：`execute()` 方法的第一步。当前线程数 < `corePoolSize`，创建一个核心线程并让它立即执行 `command`，避免了任务入队出队的开销。|
|​`command` (非 null)|​`false`​|**救急性非核心线程创建**：`execute()` 方法的第三步。核心线程已满，且 `workQueue` 也已满。创建一个非核心线程来立即执行 `command`，这是线程池处理能力的最后一道防线。|
|​`null`​|​`true`​|**核心线程预热**：由 `prestartCoreThread()` 或 `prestartAllCoreThreads()` 调用。创建的线程没有初始任务，启动后会立即去 `workQueue` 中拉取任务执行。|
|​`null`​|​`false`​|**补充性线程创建**：最典型的场景是 `execute()` 的双重检查中，任务入队后发现 `workerCount` 为 0。此时需创建一个线程去处理队列任务。也用于 `processWorkerExit` 中替换异常退出的线程。|

### runWorker() - 线程的主循环

runWorker 是每个工作线程启动后真正执行的逻辑。它是一个**永不停歇的循环**（除非被告知需要退出），不断地从任务队列中获取任务并执行。这个方法是线程池性能的直接体现，也是其健壮性的保障。

```java
/**
 * Worker 线程的主执行循环。
 * @param w 正在执行此方法的 Worker 实例。
 */
final void runWorker(Worker w) {
    // 获取当前执行此方法的线程，即 Worker 内部的 thread。
    Thread wt = Thread.currentThread();
    // 获取此 Worker 的初始任务。
    Runnable task = w.firstTask;
    // 立即清空 firstTask 字段，帮助 GC，并确保它只被执行一次。
    w.firstTask = null;
    
    // **关键解锁操作**: 将 AQS state 从 -1 置为 0。
    // 这标志着 Worker 初始化完成，正式进入“可接受中断”和“可锁定”的工作状态。
    // 在此之前，interruptIfStarted() 不会生效。
    w.unlock(); 
    
    // 标记线程是否因未捕获的异常而突然终止。
    // 如果是正常退出（getTask()返回null），此值将在循环后被设为 false。
    boolean completedAbruptly = true;
    try {
        // **主工作循环**:
        // 循环条件：
        // 1. `task != null`: 第一次循环时，如果 firstTask 存在，则直接执行。
        // 2. `(task = getTask()) != null`: 后续循环中，不断调用 getTask() 尝试获取新任务。
        //    如果 getTask() 返回 null，表示此 Worker 的生命周期应结束，循环终止。
        while (task != null || (task = getTask()) != null) {
            // **锁定 Worker**: 在执行任务前，获取 Worker 自身的锁。
            // 这将 AQS state 从 0 置为 1，将 Worker 标记为“忙碌/执行中”。
            // 这是 getActiveCount() 和 interruptIdleWorkers() 等功能的基础。
            w.lock();
            
            // **中断处理逻辑**: 这是一个关键的防御性检查。
            // 目标是确保在线程池进入 STOP 状态后，即使任务本身不响应中断，
            // 也能在任务开始前再次设置线程的中断标志。
            // `Thread.interrupted()` 会清除中断状态，所以需要重新检查 runState。
            if ((runStateAtLeast(ctl.get(), STOP) ||
                 (Thread.interrupted() && runStateAtLeast(ctl.get(), STOP))) &&
                !wt.isInterrupted())
                wt.interrupt();
            
            try {
                // **钩子方法**: 在执行任务前调用，留给子类扩展。
                // 例如，可以用于设置 ThreadLocal、记录日志、进行性能监控等。
                beforeExecute(wt, task);
                
                Throwable thrown = null;
                try {
                    // **核心**: 真正执行任务的 run() 方法。
                    task.run();
                } catch (RuntimeException x) {
                    thrown = x; throw x;
                } catch (Error x) {
                    thrown = x; throw x;
                } catch (Throwable x) {
                    // 对于非 RuntimeException 和 Error 的受检异常，进行包装。
                    thrown = x; throw new Error(x);
                } finally {
                    // **钩子方法**: 在任务执行后调用，无论是否抛出异常。
                    // `thrown` 参数可以用于获取任务执行期间的异常。
                    afterExecute(task, thrown);
                }
            } finally {
                // 清理工作
                task = null; // 帮助 GC
                w.completedTasks++; // 增加此 Worker 的已完成任务计数
                
                // **解锁 Worker**: 任务执行完毕，释放锁。
                // 将 AQS state 从 1 置为 0，将 Worker 标记为“空闲/可接单”。
                w.unlock();
            }
        }
        // 如果循环正常结束（getTask() 返回 null），说明是计划内的退出，而非异常。
        completedAbruptly = false;
    } finally {
        // **最终处理**: 无论线程是正常退出还是异常终止，都必须执行退出流程。
        processWorkerExit(w, completedAbruptly);
    }
}
```

‍

### 等待与抉择: getTask()

getTask 的职责不仅仅是“**获取任务**”，更重要的是，它决**定了工作线程的生死存亡**。线程是继续存活、等待下一个任务，还是应该被回收、终止生命周期，都由这个方法的返回值决定。

```java
/**
 * 从工作队列中获取任务。此方法会处理各种可能导致工作线程终止的情况。
 * @return 一个 Runnable 任务，如果线程应该终止，则返回 null。
 */
private Runnable getTask() {
    // 标记上一次从队列 poll 是否超时。
    // 这个局部变量用于在循环中传递状态。
    boolean timedOut = false; 

    // 使用 for(;;) 无限循环，退出逻辑完全由内部的 return 或 continue 控制。
    for (;;) {
        int c = ctl.get();
        int rs = runStateOf(c);

        // **检查退出条件 1：线程池关闭**
        // 如果线程池状态为 STOP，或者状态为 SHUTDOWN 且队列已空，
        // 那么此工作线程就不应再获取新任务，必须退出。
        if (rs >= SHUTDOWN && (rs >= STOP || workQueue.isEmpty())) {
            // 在退出前，原子性地递减 workerCount。
            decrementWorkerCount();
            return null; // 返回 null，runWorker 循环将终止。
        }

        int wc = workerCountOf(c);

        // **判断是否允许超时回收**:
        // `timed` 为 true 表示此线程在获取任务时应该使用带超时的 poll() 方法。
        // 条件：
        // 1. `allowCoreThreadTimeOut` 为 true: 允许核心线程超时。
        // 2. `wc > corePoolSize`: 当前线程是非核心线程。
        boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;

        // **检查退出条件 2：线程超时回收 或 动态缩容**
        // 这个 if 条件非常关键，它决定了空闲线程何时被回收。
        // 条件1: `wc > maximumPoolSize`
        //   - 这种情况很少见，但可能发生：在运行时通过 setMaximumPoolSize() 调小了最大线程数。
        //     此时多余的线程需要被回收。
        // 条件2: `timed && timedOut`
        //   - `timed` 为 true (允许超时) 并且 `timedOut` 为 true (上一次 poll 确实超时了)。
        //     这是最常见的线程回收场景。
        // 并且，必须满足附加条件 `wc > 1 || workQueue.isEmpty()`
        //   - 这是为了避免在队列为空时，将线程池中最后一个线程也回收掉，保证至少有一个线程可以响应未来的任务。
        if ((wc > maximumPoolSize || (timed && timedOut))
            && (wc > 1 || workQueue.isEmpty())) {
            // **尝试原子性地递减 workerCount**
            if (compareAndDecrementWorkerCount(c))
                return null; // CAS 成功，此线程正式“退休”，返回 null。
            continue; // CAS 失败，说明 ctl 被并发修改，重新开始循环检查所有条件。
        }

        try {
            // **从队列获取任务**:
            // 根据 `timed` 标志，决定是无限期阻塞等待 (take) 还是超时等待 (poll)。
            Runnable r = timed ?
                workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
                workQueue.take();
            
            // 如果成功获取到任务，返回它，runWorker 将继续执行。
            if (r != null)
                return r;
            
            // 如果 poll 返回 null，说明等待超时，将 timedOut 标志设为 true。
            // 在下一次循环开始时，上面的“检查退出条件2”就会被满足。
            timedOut = true;
        } catch (InterruptedException retry) {
            // 如果在 take() 或 poll() 中被中断（例如被 shutdown() 中断），
            // 会捕获 InterruptedException。
            // 此时不应退出，而是重置 timedOut 标志并重新开始循环。
            // 循环开始时会重新检查线程池状态，从而响应中断信号。
            timedOut = false;
        }
    }
}
```

从getTask方法返回，只有两种结果，一种是拿到了任务，执行任务后接着进行下一次循环继续拿任务，还有一种是返回null，表示未获取到任务，这就是空闲线程，可以销毁了，这时已经在getTask方法中奖ctl的线程数减1了，在runWorker方法的processWorkerExit正常将线程从工作线程集合移除即可。  
  

‍

‍

### 消亡: processWorkerExit() - 线程的善后处理

#todo

‍

### shutdown() vs shutdownNow() 源码全解析

#todo

‍

‍

### 一些面试题

1. 当一个线程池达到最大线程数以后，没有任务执行，哪些线程会被销毁？

    1. **非核心线程会被销毁**：当线程池中的线程总数 大于 corePoolSize 时，那些超出 corePoolSize 的线程（即我们之前说的“非核心线程”或“救急线程”）如果处于空闲状态，并且空闲时间超过了设定的 keepAliveTime，它们就会被销毁。
    2. **核心线程默认不会被销毁**：默认情况下（allowCoreThreadTimeOut 为 false），即使核心线程（数量 <= corePoolSize）处于长期空闲状态，它们也 不会 被销毁。这是为了保持线程池的“常备军”，以便快速响应未来的任务。
    3. 核心线程也可以被销毁（特殊配置）：如果您调用了 **allowCoreThreadTimeOut(true)**  方法，那么规则就会改变。在这种模式下，核心线程和非核心线程一视同仁，只要任何线程的空闲时间超过了 keepAliveTime，它就会被销毁。这种配置下，一个长期没有任务的线程池，其内部线程数最终可以降为 0。
2. 线程池中的最大线程数可以设置为多少？

    1. 理论上，maximumPoolSize 的最大值受 ThreadPoolExecutor 内部设计的限制。在源码中，工作线程数 workerCount 是存储在一个 int 变量 ctl 的低 29 位中。
3. 线程池中的等待队列的任务是由核心线程来执行还是非核心线程来执行呢？

    答案可能和直觉有些不同：

    **等待队列中的任务，既可能由核心线程执行，也可能由非核心线程执行。线程本身并没有“核心”与“非核心”的身份标签，它们在执行任务时是一视同仁的。**

    让我们来详细解释一下这个机制：

    **线程的“身份”只在创建时有意义**

    “核心线程”和“非核心线程”这个概念，实际上是 `ThreadPoolExecutor` 在 **决定是否要创建新线程** 时使用的一个 **策略性标签**。

    - 当线程池决定要创建一个新线程时，它会调用 `addWorker(task, core)` 方法。
    - 第二个参数 `core` (一个布尔值) 告诉 `addWorker` 方法：“我这次创建线程的**理由**是因为核心线程数没满（`core=true`），还是因为队列满了需要救急（`core=false`）？”
    - ​`addWorker` 会根据这个 `core` 参数来对比 `corePoolSize` 或 `maximumPoolSize`，以判断是否可以创建。
    - **但是，一旦一个** **​`Worker`​** **对象（及其内部的** **​`Thread`​**​ **）被创建出来，它就只是一个普通的工作线程。**  它的 `runWorker` 方法和其他所有工作线程的 `runWorker` 方法是完全一样的。线程池内部没有一个列表专门存放“核心线程”，另一个列表存放“非核心线程”。所有的 `Worker` 都存放在同一个 `workers` 集合里。

    **所有线程都从同一个队列取任务**

    所有工作线程，无论它是因何理由被创建的，都执行着相同的 `runWorker` 逻辑。在这个逻辑的核心，它们都调用同一个 `getTask()` 方法，从 **同一个** **​`workQueue`​** 中获取任务。

    这是一个典型的“抢占式”或“共享式”的工作模式：

    1. 线程池中有一个公共的“任务池”（`workQueue`）。
    2. 所有空闲的工作线程（无论是最初为了凑齐 `corePoolSize` 而创建的，还是后来为了救急而创建的）都像嗷嗷待哺的雏鸟一样，盯着这个任务池。
    3. 一旦有新任务进入队列，某个正在 `workQueue.take()` 或 `poll()` 上阻塞的线程会被唤醒（具体是哪一个由队列的实现和操作系统的线程调度决定），它会“抢”到这个任务并开始执行。

    **所以，一个任务被放入队列后，下一个空闲下来的线程——无论是“核心”还是“非核心”——都会去执行它。**

    **销毁时的区别才体现出“身份”**

    “核心”与“非核心”的真正区别体现在 **线程空闲时是否会被销毁** 上。

    - 一个线程在 `getTask()` 方法里等待任务时，会判断自己是否应该被回收。
    - 这个判断逻辑是：`allowCoreThreadTimeOut || workerCount > corePoolSize`。
    - 这意味着：

      - 如果当前总线程数 **大于** **​`corePoolSize`​**，那么这个线程就被认为是“非核心”的，它在等待任务时会使用带超时的 `poll()`。一旦超时，它就会被销-毁。
      - 如果当前总线程数 **小于等于** **​`corePoolSize`​**（并且 `allowCoreThreadTimeOut` 为 `false`），那么这个线程就被认为是“核心”的，它会使用无限期阻塞的 `take()`。它会一直等待，直到有新任务或线程池关闭，而不会因为空闲而被销毁。
4. 线程池中如何来复用一个线程？

    1. **首次执行**：一个工作线程（`Worker`）被创建时，可能会带一个初始任务 (`firstTask`)。`runWorker` 循环的第一次迭代会执行这个任务。
    2. **循环获取新任务**：当第一个任务执行完毕后，`while` 循环不会结束。它会继续执行 `(task = getTask()) != null` 这部分。
    3. **阻塞等待**：`getTask()` 方法会去工作队列 (`workQueue`) 中获取下一个任务。如果队列中没有任务，`getTask()` 会根据配置调用 `workQueue.take()` (无限期阻塞) 或 `workQueue.poll()` (带超时阻塞)。此时，**线程并没有死，它只是在队列上“挂起”并等待**。
    4. **唤醒并再次执行**：当一个新的任务被提交到队列中时，正在 `take()` 或 `poll()` 上阻塞的线程会被唤醒。`getTask()` 方法会返回这个新任务。
    5. **循环往复**：`runWorker` 的 `while` 循环条件再次满足，线程会继续执行这个新任务。执行完毕后，再次回到步骤 2，继续去队列获取下一个任务。

‍

#### 5.1.

![image-20220609222015253](https://woniumd.oss-cn-hangzhou.aliyuncs.com/java/yangguang/20220609222015.png)

任务进到线程池之后，看当前线程池正在工作的线程总数有没有达到核心线程数，如果没有就创建新的线程开始处理，如果已经达到最大核心线程数就放入等待队列，如果等待队列已满就看是否达到最大线程数，如果没达到就新建非核心线程，如果达到最大线程数之后直接执行拒绝策略，

‍

‍

### 额外的Executors

Executors是一个java.util.concurrent包中的工具类，可以方便的为我们创建几种特定的线程池。

- FixedThreadPool:具有固定线程数量的线程池

线程池中的线程数量是固定的，当提交给线程池的任务数量大于池中的线程数量后，任务会在等待队列中排队，此处等待队列使用的是无界队列。当线程处理完一个任务后，会从等待队列中获取新的任务处理。

构造方法：

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```

```java
public class ThreadPoolExecutorDemo {

    public static void main(String[] args) {
        //创建持有5个线程的线程池
        ExecutorService pool = Executors.newFixedThreadPool(5);

        for (int i = 0; i < 10; i++) {
            //向线程池中提交10个执行任务
            pool.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("线程：" + Thread.currentThread().getName());
                }
            });
        }
        //关闭线程池
        pool.shutdown();
    }


}
```

- CachedThreadPool:线程数量可以动态伸缩的线程池

如果有新任务提交进来，只要没有空闲的线程处理，就会创建新的线程并处理。

构造方法如下：

核心线程数为0，最大线程数为Integer.MAX_VALUE，等待队列是个同步队列，不能存放任何元素，只是起到传递任务给工作线程的作用。

```java
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }
```

使用样例：

```java
public class ThreadPoolExecutorDemo {

    public static void main(String[] args) {
        //创建线程数量课动态伸缩线程池
        ExecutorService pool = Executors.newCachedThreadPool();

        for (int i = 0; i < 30; i++) {
            //向线程池中提交30个执行任务
            pool.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("线程：" + Thread.currentThread().getName());
                }
            });
        }
        //关闭线程池
        pool.shutdown();
    }


}

```

- SingleThreadPool:单个线程的线程池

这个线程池核心线程数和最大线程数都是1，队列是一个LinkedBlockingQueue的无界队列

构造函数：

```java
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
```

使用样例：

```java

public class ThreadPoolExecutorDemo {

    public static void main(String[] args) {
        //创建单个线程的线程池
        ExecutorService pool = Executors.newSingleThreadExecutor();

        for (int i = 0; i < 10; i++) {
            //向线程池中提交10个执行任务
            pool.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("线程：" + Thread.currentThread().getName());
                }
            });
        }
        //关闭线程池
        pool.shutdown();
    }


}
```

- ScheduledThreadPool:可以运行定时任务的线程池

构造函数：

```java
    public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        return new ScheduledThreadPoolExecutor(corePoolSize);
    }

    public ScheduledThreadPoolExecutor(int corePoolSize) {
        super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
              new DelayedWorkQueue());
    }
    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue) {
        this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,
             Executors.defaultThreadFactory(), defaultHandler);
    }
```

执行样例：

```java
public class ThreadPoolExecutorDemo {

    public static void main(String[] args) {
        //创建一个具有定时任务功能的线程池，注意：这里的类型是ScheduledExecutorService
        ScheduledExecutorService pool = Executors.newScheduledThreadPool(2);


            //向线程池中提交1个执行任务
            System.out.println("提交任务时间："+new Date());
            pool.schedule(new Runnable() {
                @Override
                public void run() {
                    System.out.println("线程：" + Thread.currentThread().getName());
                    System.out.println("线程执行任务时间："+new Date());
                }
            },5,TimeUnit.SECONDS);//这里的第二个参数5和第三个参数放在一起意思是提交任务到线程										池后，要等待5秒再开始执行
    }
}

```
