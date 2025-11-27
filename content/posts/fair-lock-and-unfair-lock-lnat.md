---
title: 公平锁和非公平锁
slug: fair-lock-and-unfair-lock-lnat
url: /post/fair-lock-and-unfair-lock-lnat.html
date: '2025-10-09 23:21:33+08:00'
lastmod: '2025-11-27 15:43:44+08:00'
tags:
  - juc
categories:
  - Java八股文
keywords: juc
toc: true
isCJKLanguage: true
---





这是一篇完整的博客文章 Markdown 源码。你可以直接将其复制到你的博客编辑器中（如 Hexo, Hugo, VuePress, 或者支持 HTML 的 CMS）。

**注意**：为了让文中的“交互演示”生效，你的博客平台必须支持**原生 HTML/JS 渲染**。

---

```markdown
# ☕️ 深入理解 Java 并发：为什么 ReentrantLock 默认是非公平的？

在 Java 并发编程中，锁（Lock）是我们最常用的工具之一。而当我们创建一个 `ReentrantLock` 时，你是否注意过它其实有两种模式：**公平锁**与**非公平锁**？

‍```java
// 默认是非公平锁
Lock lock = new ReentrantLock(); 
```

JDK 默认将 `ReentrantLock` 设置为非公平锁，这背后的设计哲学是什么？难道“公平”不是在这个世界上最重要的事情吗？

今天我们就来聊聊锁的公平性，并通过一个**可视化模拟器**来体验它对性能的巨大影响。

---

## 1. 什么是公平锁与非公平锁？

我们可以用生活中的“排队买票”来类比这两种锁的区别。

### 🐢 公平锁 (Fair Lock)

**核心准则：先来后到。**

就像在银行排队办理业务。所有的线程在尝试获取锁时，如果发现锁已经被占用了，它们会老老实实地进入“等待队列”的尾部排队。

- 锁释放时，只有队列里的第一个线程（头节点）会被唤醒并获得锁。
- **代码**：`new ReentrantLock(true)`

### 🐇 非公平锁 (Unfair Lock)

**核心准则：有机会就插队，没机会再排队。**

这更像是早高峰挤地铁。当一个线程尝试获取锁时：

1. 它不管有没有人在排队，先尝试直接抢锁。
2. 如果运气好，刚好锁是空闲的，它就直接拿走（插队成功）。
3. 如果运气不好，锁正在被使用，它才会乖乖去队尾排队。
4. **代码**：`new ReentrantLock(false)`​ 或 `new ReentrantLock()`

---

## 2. 为什么会有“非公平”的设计？

初学者通常会认为：“公平多好啊，大家按顺序来，不会乱套。” 但在计算机的高并发世界里， **“公平”往往意味着昂贵的代价**。

### 🚀 性能的真相：填补 CPU 的空窗期

要理解这个问题，我们需要从 CPU 的角度看世界。

当一个线程释放锁，到等待队列中的下一个线程被唤醒并真正开始运行，这之间存在一个**时间差**（唤醒延迟）。

- **对于开发人员**：这个时间差微乎其微（微秒级）。
- **对于 CPU**：这简直是漫长的几个世纪！CPU 指令执行速度极快，这段时间足够它处理大量的逻辑。

**非公平锁的逻辑是：**

> “既然被唤醒的那个兄弟还没准备好（还在做上下文切换），那我这个刚来的、正处于运行状态的线程，不如顺手先把锁拿着用完。等你醒透了，我可能已经把活干完释放锁了。”

**图解性能差异：**

1. **公平模式**：A 释放 -> **CPU 空闲 (唤醒 B)**  -> B 运行。
2. **非公平模式**：A 释放 -> **C 插队 (CPU 忙碌)**  -> C 释放 -> B 醒来运行。

**结论**：非公平锁能更充分地利用 CPU 的时间片，减少 CPU 空闲状态，从而显著提升系统的**吞吐量**。

---

## 🧩 交互演示：公平 vs 非公平

为了让你更直观地理解，我写了一个简单的嵌入式模拟器。

- **公平模式**：必须排队，即使锁空闲，只要队列有人，新来的就得排队。
- **非公平模式**：狂点“请求锁”，你会发现新来的线程经常能插队成功，直接绕过队列抢到锁。

<!-- 下面是嵌入的 HTML/JS 可视化组件 -->  
<style>  
    /* 样式隔离，防止污染博客全局 */  
    .lock-demo-wrapper { font-family: 'Segoe UI', sans-serif; background: #f8f9fa; display: flex; flex-direction: column; align-items: center; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;}  
    .lock-demo-container { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); width: 100%; max-width: 550px; box-sizing: border-box; }  
    .ld-controls { margin-bottom: 20px; padding: 10px; background: #eef2f5; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; }  
    .ld-btn { padding: 8px 16px; cursor: pointer; border: none; border-radius: 4px; font-weight: 600; transition: 0.2s; margin-right: 5px; font-size: 12px; letter-spacing: 0.5px;}  
    .ld-btn:hover { opacity: 0.9; transform: translateY(-1px); }  
    .ld-btn:active { transform: translateY(1px); }

    .ld-btn-fair { background: #3498db; color: white; }  
    .ld-btn-unfair { background: #e74c3c; color: white; }  
    .ld-btn-req { background: #2ecc71; color: white; margin-right: 10px; font-size: 14px; padding: 10px 20px;}  
    .ld-btn-rel { background: #f39c12; color: white; font-size: 14px; padding: 10px 20px;}

    .ld-visualization { display: flex; flex-direction: column; gap: 20px; margin-top: 25px; margin-bottom: 20px;}  
    .ld-lock-box { width: 90px; height: 90px; background: #ecf0f1; border: 4px solid #bdc3c7; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto; font-weight: bold; color: #7f8c8d; transition: all 0.3s; font-size: 13px; position: relative;}  
    .ld-lock-box.locked { background: #ff7675; border-color: #d63031; color: white; box-shadow: 0 0 20px rgba(231, 76, 60, 0.4); animation: pulse 1s infinite alternate;}

    @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.05); } }

    .ld-queue-track { height: 60px; border-bottom: 3px dashed #bdc3c7; display: flex; align-items: center; padding-left: 10px; position: relative; overflow-x: auto; background-color: #fafafa; border-radius: 4px;}

    .ld-thread { width: 36px; height: 36px; border-radius: 50%; background: #6c5ce7; color: white; display: flex; justify-content: center; align-items: center; font-size: 11px; margin-right: 8px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 2px solid white;}

    .ld-log-box { height: 140px; overflow-y: auto; background: #2d3436; color: #dfe6e9; padding: 12px; font-family: 'Consolas', monospace; font-size: 12px; border-radius: 6px; margin-top: 10px; text-align: left; line-height: 1.5; border: 1px solid #636e72;}  
    .ld-log-entry { margin-bottom: 4px; border-bottom: 1px solid #444; padding-bottom: 2px; }  
</style>

<div class="lock-demo-wrapper">
    <div class="lock-demo-container">
        <h3 style="text-align: center; margin-top:0; color: #2c3e50;">🔒 锁竞争模拟器</h3>

        <div class="ld-controls">  
            <div>  
                <button class="ld-btn ld-btn-fair" onclick="demo_setMode(true)">切换为：公平锁</button>  
                <button class="ld-btn ld-btn-unfair" onclick="demo_setMode(false)">切换为：非公平</button>  
            </div>  
            <div id="demo_modeDisplay" style="font-weight: bold; color: #3498db;">当前: 公平锁</div>  
        </div>

        <div style="text-align: center; margin-bottom: 10px;">  
            <button class="ld-btn ld-btn-req" onclick="demo_requestLock()">➕ 请求锁</button>  
            <button class="ld-btn ld-btn-rel" onclick="demo_releaseLock()">🔓 释放锁</button>  
        </div>

        <div class="ld-visualization">  
            <!-- 锁 -->  
            <div id="demo_lock" class="ld-lock-box">空闲</div>  
            <!-- 队列 -->  
            <div class="ld-queue-track" id="demo_queueTrack">  
                <span style="font-size: 12px; color: #95a5a6; margin-right: 10px; font-weight:bold;">等待队列:</span>  
            </div>  
        </div>

        <div class="ld-log-box" id="demo_logBox">  
            <div class="ld-log-entry" style="color:#aaa">系统就绪...请点击按钮操作</div>  
        </div>  
    </div>  
</div>

<script>  
    (function(){  
        let isFair = true;  
        let isLocked = false;  
        let queue = [];  
        let threadCount = 0;  
        let currentThread = null;

        window.demo_log = function(msg) {  
            const box = document.getElementById('demo_logBox');  
            const time = new Date().toLocaleTimeString().split(' ')[0];  
            const color = isFair ? '#74b9ff' : '#​ff7675';  
            box.innerHTML = `<div class="ld-log-entry"><span style="color:${color}">[${isFair ? '公平' : '非公平'}]</span> ${time}: ${msg}</div>` + box.innerHTML;  
        }

        window.demo_setMode = function(fair) {  
            isFair = fair;  
            const display = document.getElementById('demo_modeDisplay');  
            display.innerText = `当前: ${fair ? '公平锁' : '非公平锁'}`​;  
            display.style.color = fair ? '#3498db' : '#​e74c3c';  
            demo_log(`模式切换为: ${fair ? '公平锁 (严格排队)' : '非公平锁 (允许插队)'}`);  
        }

        window.demo_renderQueue = function() {  
            const track = document.getElementById('demo_queueTrack');  
            track.innerHTML = '<span style="font-size: 12px; color: #95a5a6; margin-right: 10px; font-weight:bold;">等待队列:</span>';  
            queue.forEach(t => {  
                const div = document.createElement('div');  
                div.className = 'ld-thread';  
                div.innerText = 'T' + t.id;  
                track.appendChild(div);  
            });

            const lockDiv = document.getElementById('demo_lock');  
            if (isLocked && currentThread) {  
                lockDiv.classList.add('locked');  
                lockDiv.innerText = 'T' + currentThread.id;  
                lockDiv.style.background = '#ff7675';            } else {                lockDiv.classList.remove('locked');                lockDiv.innerText = '空闲';                lockDiv.style.background = '#ecf0f1';  
            }  
        }

        window.demo_requestLock = function() {  
            threadCount++;  
            const thread = { id: threadCount };

            // 核心逻辑：非公平锁且锁空闲，直接抢占！  
            if (!isLocked && !isFair) {  
                isLocked = true;  
                currentThread = thread;  
                demo_log(`线程 T${thread.id} <b style="color:#e74c3c">插队成功!</b> (运气好,锁刚好空闲)`, 'unfair');  
                demo_renderQueue();  
                return;  
            }

            // 公平锁模式，或者锁正忙  
            if (!isLocked && queue.length === 0) {  
                // 锁空闲且队列为空，正常获取  
                isLocked = true;  
                currentThread = thread;  
                demo_log(`线程 T${thread.id} 获取锁 (无竞争)`​);  
            } else {  
                // 必须排队  
                queue.push(thread);  
                demo_log(`线程 T${thread.id} 锁被占用/必须排队 -> <span style="color:#a29bfe">进入队尾</span>`);  
            }  
            demo_renderQueue();  
        }

        window.demo_releaseLock = function() {  
            if (!isLocked) return demo_log("当前没有锁被占用");

            const prevId = currentThread.id;  
            demo_log(`线程 T${prevId} 释放了锁... (CPU 调度中)`);  
            isLocked = false;  
            currentThread = null;  
            demo_renderQueue();

            // 模拟 600ms 的唤醒延迟（这期间就是非公平锁插队的机会）  
            setTimeout(() => {  
                // 如果在延迟期间没有被“非公平”的线程插队抢走，则唤醒队列  
                if (!isLocked && queue.length > 0) {  
                    const nextThread = queue.shift();  
                    isLocked = true;  
                    currentThread = nextThread;  
                    demo_log(`队列头部线程 T${nextThread.id} 被唤醒并获取锁`);  
                    demo_renderQueue();  
                }  
            }, 600);  
        }  
    })();  
</script>  
<!-- 演示结束 -->

---

## 3. 为什么刚释放锁的线程容易再次获取锁？

在使用非公平锁时，我们常观察到一个现象：**线程 A 刚释放锁，接着又获得了锁。**

这是因为**线程切换是有开销的**。

1. 线程 A 正在运行，它持有 CPU 缓存（Hot Cache），状态是热乎的。
2. 如果 A 释放锁后立刻再次请求锁，且此时 B 还在被操作系统唤醒的过程中（Context Switch），那么 A 拿到锁的概率非常大。
3. **好处**：减少了线程 A 被挂起和恢复的开销，复用了 CPU 缓存，效率极高。

---

## 4. 面试题总结

最后，我们将核心知识点浓缩为 3 道经典的面试题（**建议背诵**）：

#### Q1: 什么是公平锁和非公平锁？它们默认的实现是什么？

- **答**：

  - **公平锁**：多个线程按照申请锁的顺序来获取锁，类似排队，先来先得。
  - **非公平锁**：线程获取锁的顺序不一定按照申请顺序，后申请的线程可能会比先申请的线程优先获取锁（插队）。
  - ​`ReentrantLock`​ 默认是**非公平锁**，`synchronized`​ 也是**非公平锁**。

#### Q2: 既然公平锁符合正常逻辑，为什么 Java 要默认使用非公平锁？（核心）

- **答**：**为了性能（吞吐量）** 。

  - **减少开销**：恢复挂起的线程需要时间（上下文切换）。
  - **利用时间差**：非公平锁允许新来的线程在等待队列中的线程醒来之前，抢先获取锁并执行完毕。这填补了 CPU 的空窗期，大大提升了系统整体的吞吐量。

#### Q3: 非公平锁有什么缺点？什么时候应该使用公平锁？

- **答**：

  - **缺点**：可能造成**线程饥饿**（某个线程一直在队尾排队，永远抢不过插队的人）或**优先级反转**。
  - **使用场景**：当业务逻辑要求必须按照请求顺序执行时，或者为了避免某些线程长时间等待（例如持有锁时间长），才应显式使用公平锁。
