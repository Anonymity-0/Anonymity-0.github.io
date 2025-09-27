---
title: Redis的Hash数据结构
slug: hash-data-structure-1wwjrl
url: /post/hash-data-structure-1wwjrl.html
date: '2025-09-26 13:50:52+08:00'
lastmod: '2025-09-26 16:59:11+08:00'
tags:
  - redis
categories:
  - Java八股文
keywords: redis
toc: true
isCJKLanguage: true
---





在Redis的五大经典数据类型中，Hash因其直观的`field-value`结构而备受青睐。然而，为了在性能和内存之间寻求极致的平衡，一个看似简单的Hash对象，其底层实现却暗藏玄机。Redis会根据存储数据的大小和数量，动态地为其选择不同的编码方式——在早期版本中是`ziplist`（压缩列表）和`hashtable`，而在Redis 7中，主角则换成了`listpack`（紧凑列表）。

## **Hash的两种“面孔”：紧凑与分散**

一个Hash对象在Redis中，通常会有两种存储形态：

1. **紧凑形态 (Compact)** ：当Hash中存储的键值对数量较少，且每个键和值的长度都较短时，Redis会采用一种极其节省内存的连续存储结构。在Redis 6及之前是`ziplist`，Redis 7之后是`listpack`。
2. **分散形态 (Sparse)** ：一旦超出预设的阈值，Hash就会被转换为标准的`hashtable`（字典）结构。

这个转换的“门槛”由两个参数共同决定：

- ​**​`hash-max-ziplist-entries`​**  **/**  **​`hash-max-listpack-entries`​**：紧凑形态下允许的最大条目数（默认512）。
- ​**​`hash-max-ziplist-value`​**  **/**  **​`hash-max-listpack-value`​**：紧凑形态下每个键或值的最大长度（默认64字节）。

```shell
# Redis 6中的配置
127.0.0.1:6379> CONFIG GET hash-max-ziplist-*
1) "hash-max-ziplist-entries"
2) "512"
3) "hash-max-ziplist-value"
4) "64"

# Redis 7中的配置 (同时保留ziplist以兼容)
127.0.0.1:6379> CONFIG GET hash-max-*-*
1) "hash-max-listpack-entries"
2) "512"
3) "hash-max-ziplist-entries"
4) "512"
5) "hash-max-listpack-value"
6) "64"
7) "hash-max-ziplist-value"
8) "64"
```

只要**任一条件不满足**，Hash就会从紧凑形态**自动升级**为`hashtable`。这种升级是**单向的，不可逆**。

```shell
# 在Redis 6中演示ziplist到hashtable的转换
# 初始为ziplist
127.0.0.1:6379> HSET user:01 name "Alice"
(integer) 1
127.0.0.1:6379> OBJECT ENCODING user:01
"ziplist"

# 添加一个超长的值，触发转换
127.0.0.1:6379> HSET user:01 bio "A very long biography string that is definitely longer than 64 bytes to trigger the encoding conversion."
(integer) 1
127.0.0.1:6379> OBJECT ENCODING user:01
"hashtable"
```

![ziplist到hashtable的转换](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926135557.png)

逻辑如下：![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926135958.png)

## **当紧凑不再：**​**​`hashtable`​**​**编码的登场**

当一个Hash对象因为元素过多或过大，无法再使用节省空间的`ziplist`/`listpack`编码时，它就会采用`OBJ_ENCODING_HT`编码。这标志着它从一个紧凑的线性结构，演变成了一个真正的高性能哈希表——在Redis的源码中，它被称为**字典 (dictionary)** 。

​**​`hashtable`​**​ **：Redis高性能的基石**

​`OBJ_ENCODING_HT`这种编码方式是Redis实现**O(1)** 平均时间复杂度读写的核心。它的内部结构是经典的“**数组 + 链表**”设计。

![字典的组织关系](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926140706.png)

1. **顶层结构 (**​**​`dict`​**​ **)** : 这是`hashtable`的“指挥中心”。它内部包含**两个**哈希表（`ht[0]`和`ht[1]`），这种设计是为了实现平滑的**渐进式rehash**（扩容），避免因数据迁移而导致服务长时间阻塞。
2. **哈希表实现 (**​**​`dictht`​**​ **)** : 这是“数组”部分，一个由指针组成的数组，我们称之为“桶”（bucket）。
3. **哈希节点 (**​**​`dictEntry`​**​ **)** : 如果多个键（Key）通过哈希计算后落入同一个“桶”，它们就会通过指针连接成一个**链表**，这就是“链地址法”解决哈希冲突的经典实现。每个`dictEntry`节点都包含了指向键和值的指针。

![字典的详细结构](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926140923.png)

**总结来说**，

1. 一个redisObject的ptr指针指向一个dict结构。
2. dict结构中的ht[0]指向一个dictht（主哈希表）。
3. dictht的table是一个指针数组。
4. 数组的每个索引位置（“桶”）通过哈希函数 hash(key) & sizemask 来确定。
5. 如果该位置没有元素，则指针为NULL。  
    如果该位置有元素，则指针指向第一个dictEntry。  
    如果发生哈希冲突，后续的dictEntry通过next指针形成一个链表。

```text
redisObject
    ↓ ptr
   dict
    ↓ ht[0]
  dictht
    ↓ table (size=4)
+-----------+
| index 0   | → NULL
+-----------+
| index 1   | → [dictEntry: key="a"] → [dictEntry: key="c"] → NULL
+-----------+
| index 2   | → [dictEntry: key="b"] → NULL
+-----------+
| index 3   | → NULL
+-----------+
```

## **源码片段解读：**​**​`HSET`​**​**命令背后的编码转换**

当我们执行`HSET`命令时，Redis内部是如何决策和执行编码转换的呢？其核心逻辑位于`hsetCommand`函数中，它会调用更底层的函数来处理。

![hsetCommand调用栈](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926141231.png)

在对象创建和修改的函数中（如`hashTypeSet`），存在类似下面这样的关键判断逻辑：

![编码转换逻辑](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926141918.png)

**源码逻辑解读**：

1. **检查字段长度**：在向Hash对象添加新字段前，代码会首先检查新加入的`field`和`value`的长度是否超过了`server.hash_max_ziplist_value`（或`listpack`的对应配置）。
2. **检查条目数量**：如果长度检查通过，代码还会检查添加新元素后，总条目数是否会超过`server.hash_max_ziplist_entries`。
3. **触发转换**：如果上述**任一检查不通过**，且当前编码是`ziplist`（或`listpack`），Redis就会调用`hashTypeConvert`函数。这个函数会创建一个新的`hashtable`，并将旧`ziplist`中的所有数据迁移到新的`hashtable`中，最后释放旧的`ziplist`。

## **​`ziplist`​**​

​`ziplist`（压缩列表）是Redis早期为了极致地节省内存而设计的一种数据结构。它的核心思想是：**以部分读写性能为代价，换取极高的内存空间利用率**。

> **Redis官方对Ziplist的描述** (ziplist.c):
>
> The ziplist is a specially encoded dually linked list that is designed to be very memory efficient. It stores both strings and integer values, where integers are encoded as actual integers instead of a series of characters. It allows push and pop operations on either side of the list in O(1) time. However, because every operation requires a reallocation of the memory used by the ziplist, the actual complexity is related to the amount of memory used by the ziplist.

‍

### **​`ziplist`​** **的内存布局**

​`ziplist`将所有数据存储在一块**连续的内存**中。它没有传统双向链表的`prev`和`next`指针，而是通过存储**前一个节点的长度**来实现反向遍历。

![ziplist内存布局](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926142314.png)

一个`ziplist`由以下几部分组成：

- ​`zlbytes`: 整个`ziplist`的总字节数。
- ​`zltail`: 到达尾节点的偏移量，用于快速定位尾部。
- ​`zllen`: 节点数量。
- ​`entry`: 若干个数据节点。
- ​`zlend`: 特殊的结束标记 (0xFF)。

### `zlentry` 节点结构

每个`entry`是`ziplist`的核心，其结构如下：

- ​`previous_entry_length`: **记录前一个节点的长度**。这是`ziplist`能够反向遍历的关键，也是其致命缺陷的根源。
- ​`encoding`: 记录当前节点数据的类型。
- ​`content`: 实际存储的数据。

![zlentry节点结构](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926144032.png)

通过`previous_entry_length`，`ziplist`可以从当前节点指针减去该长度，从而找到前一个节点的起始地址，实现了O(1)复杂度的反向跳转。这是一种典型的“**时间换空间**”设计。

 **“ziplist 不是有** **​`len`​** **吗？为什么还要** **​`prev_length`​**​ **？”**

ziplist 有 `len`，但它只是『数据部分的长度』，不是整个 entry 的总长度。它没有 self_total_len，所以必须依赖 `prev_length` 来实现正向跳转。

###  **“连锁更新”问题**

​`ziplist`的设计初衷虽好，但`previous_entry_length`字段的存在引入了一个灾难性的问题——**连锁更新 (Cascading Update)** 。

​`previous_entry_length`字段本身是变长的（1字节或5字节）。

- 如果前一个节点的长度 `< 254` 字节，它占用1字节。
- 如果前一个节点的长度 `>= 254` 字节，它占用5字节。

**灾难场景**：

1. 假设我们有一个`ziplist`，其中包含一连串长度都为250-253字节的节点。此时，每个节点的`previous_entry_length`都占用1字节。

    ![连锁更新前](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926150242.png)
2. 现在，我们在**头部**插入一个长度 `>= 254` 字节的新节点。

    ![插入新节点](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926150316.png)
3. 原先的第一个节点（`entry1`）现在需要更新它的`previous_entry_length`来记录新头的长度。这个字段必须从1字节扩展到5字节。
4. **连锁反应开始**：`entry1`因为自身增加了4个字节，其总长度很可能也超过了254字节。这导致它的后继节点`entry2`也必须将其`previous_entry_length`从1字节扩展到5字节。
5. 这个过程像多米诺骨牌一样，一个接一个地向后传播，可能导致整个`ziplist`进行大规模的空间重分配。

    ![连锁更新过程](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926150433.png)

这种在最坏情况下需要O(N^2)复杂度的连锁更新，使得`ziplist`在某些场景下性能变得不可预测，成为了Redis一个待优化问题。

## **​`listpack`​**​

为了彻底根除“连锁更新”问题，Redis 7中引入了`listpack`（紧凑列表）作为`ziplist`的替代品。

‍

### **​`listpack`​** **的核心变化**

​`listpack`的设计非常巧妙，它解决了问题的根源：

> ​**​`listpack`​** **的每个节点不再存储前一个节点的长度，而是只存储自己的元信息和内容。**

![listpack内存布局](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926161332.png)

一个`listpack`的`entry`结构如下：

- ​`encoding-type`: 编码类型。
- ​`element-data`: 元素数据。
- ​**​`element-total-len`​**: **当前节点自身的总长度**。

![listpack与ziplist节点对比](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926161640.png)

### **如何实现反向遍历？**

既然不存前一个节点的长度，`listpack`如何从后往前遍历呢？

答案是：**从后往前“跳”** 。

1. 指针首先指向`listpack`的末尾。
2. 通过末尾的`listpack-end-byte`向前一个字节，定位到最后一个节点的末尾。
3. 解析最后一个节点的`element-total-len`字段，知道了该节点的总长度。
4. 用当前指针减去这个长度，就**精确地跳到了该节点的起始位置**，也就是倒数第二个节点的末尾。
5. 重复此过程，即可实现高效且安全的反向遍历。

通过这个设计，对`listpack`中任何一个节点的修改，都只会影响该节点自身的空间，**绝不会波及其后继节点**，从而彻底杜绝了连锁更新问题。

## **遍历机制的对决 ——**  **​`ziplist`​** **vs** **​`listpack`​**​

最后让我们来深入对比一下这两种结构在正向和反向遍历上的设计。

### **正向遍历**

正向遍历的目标很简单：从当前节点的起始位置，准确地跳转到下一个节点的起始位置。

#### **​`ziplist`​** **的正向遍历：计算后前进**

- **结构**: `[prev_len] [encoding] [content]`​
- **流程**:

  1. 指针位于当前 `entry` 的起始位置。
  2. 解析 `encoding` 字段，这是一个“自描述”字段，通过解读它的前几个比特位，可以计算出 `content` 的长度。
  3. **计算**出当前 `entry` 的总长度：`总长度 = sizeof(prev_len) + sizeof(encoding) + sizeof(content)`。
  4. 将当前指针加上这个**计算出的总长度**，即可跳到下一个 `entry`。

![ziplist正向遍历](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926144609.png)

- **特点**：前进的“步长”是**动态计算**出来的。

#### **​`listpack`​** **的正向遍历：计算后前进（类似）**

- **结构**: `[encoding] [content] [self_total_len]`​
- **流程**:

  1. 指针位于当前 `entry` 的起始位置。
  2. 解析 `encoding` 字段，同样可以计算出 `content` 的长度。
  3. **计算**出当前 `entry` 的总长度（不含 `self_total_len` 部分）。
  4. 将当前指针加上这个**计算出的长度**，即可跳到 `self_total_len` 字段，再跳过它，到达下一个 `entry`。  
       *(或者，直接读取*​*​`self_total_len`​*​*字段，然后用当前指针加上它)* ![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926161640.png)

- **特点**：与 `ziplist` 类似，前进的步长也需要通过解析 `encoding` 来确定。

**正向遍历对比结论**：在正向遍历上，两者思路相似，都需要通过解析 `encoding` 来确定前进的距离，性能差异不大。

---

### **反向遍历—— 核心差异所在**

反向遍历的目标是：从当前节点的起始位置，准确地跳转到**前一个节点**的起始位置。这正是两种结构分道扬镳的地方。

#### **​`ziplist`​** **的反向遍历：直接读取，精确后退**

- **结构**: `[prev_len] [encoding] [content]`​
- **流程**:

  1. 指针位于当前 `entry` 的起始位置。
  2. 直接读取位于最头部的 `prev_len` 字段。这个字段**直接、显式地存储了前一个节点的总长度**。
  3. 将当前指针**减去** `prev_len` 的值。
  4. 指针就精确地回到了**前一个** **​`entry`​** **的起始位置**。
- **特点**：后退的“步长”是**直接读取**的，非常高效。但正是这个 `prev_len` 字段，导致了“连锁更新”的致命问题。它让节点之间产生了紧密的物理耦合。

#### **​`listpack`​** **的反向遍历：先定位，再读取，然后后退**

​`listpack` 抛弃了 `prev_len`，那么它如何后退呢？答案是“**从后往前看**”。

- **结构**: `[encoding] [content] [self_total_len]`​
- **流程**:

  1. 指针位于当前 `entry` 的起始位置。这个位置同时也是**前一个** **​`entry`​** **的结束位置**。
  2. 从这个位置**向前**读取1个字节，这个字节是前一个 `entry` 的 `self_total_len` 字段的**最后一部分**。
  3. ​`self_total_len` 字段本身也是变长的，但它的编码方式允许我们从后往前解析，从而**解码出前一个** **​`entry`​** **的完整总长度**。
  4. 将当前指针**减去**这个解码出的“前一个 `entry` 的总长度”。
  5. 指针就精确地回到了**前一个** **​`entry`​** **的起始位置**。
- **特点**：后退的“步长”是**通过读取前一个节点的尾部信息来解码**的。这个过程比 `ziplist` 略微复杂，但它彻底解除了节点间的耦合，根治了连锁更新。

### **总结**

|遍历方式|​`ziplist` (压缩列表)|​`listpack` (紧凑列表)|
| :---------| :-------------------------| :-------------------------------------------|
|**正向遍历**|**计算后前进** (解析`encoding`算总长)|**计算后前进** (解析`encoding`算总长)|
|**反向遍历**|**直接后退** (读取`prev_len`字段)|**解码后后退** (读取前一个节点的`self_total_len`字段)|
|**设计核心**|依赖 **​`prev_len`​** 字段|依赖 **​`self_total_len`​** 字段|
|**优点**|反向遍历的实现非常直接。|彻底解决了连锁更新问题，更新操作稳定高效。|
|**缺点**|**连锁更新**的致命风险。|反向遍历的逻辑比 `ziplist` 略微复杂。|

**最终结论**

​`ziplist` 为了实现看似简单的反向遍历，引入了 `prev_len` 字段，却意外地打开了“连锁更新”的潘多拉魔盒，导致其在某些场景下性能极不稳定。

​`listpack` 则以一种更聪明的方式解决了问题。它将每个节点的长度信息“私有化”，只跟自己有关，并放在节点的尾部。这使得反向遍历虽然需要一个“从后往前解码”的步骤，但换来的是整个数据结构的稳定与安全。这无疑是一笔非常划算的交易，也是 `listpack` 最终取代 `ziplist` 的根本原因。

‍
