---
title: Redis的ZSet数据结构
slug: redis-s-zset-data-structure-1tfno
url: /post/redis-s-zset-data-structure-1tfno.html
date: '2025-09-27 22:45:59+08:00'
lastmod: '2025-09-28 14:33:48+08:00'
tags:
  - redis
categories:
  - Java八股文
keywords: redis
toc: true
isCJKLanguage: true
---





案例  
ziplist  
redis6  
skiplist  
ZSet的两种编码格式  
listpack  
redis7  
skiplist

‍

redis6

127.0.0.1:6379> config get zset*  
1)）"zset-max-ziplist-entries"  
2)"128"  
3）"zset-max-ziplist-value"  
④）"64"  
127. 0. 0.1: 6

redis7

127.0.0.1:6379> config get zset*  
"zset-max-listpack-value"  
"64"  
"zset-max- ziplist-value"  
"64"  
"zset-max-ziplist-entries"  
“128"  
D"zset-max-listpack-entries"  
8）"128"  
127. 0. 0. 1: 6379>

和其他类型一样做了过渡和兼容

redis6  
当有序集合中包含的元素数量超过服务器属性server.zset_max_ziplist_entries的值（默认值为128），  
或者有序集合中新添加元素的member的长度大于服务器属性server.zset_max_ziplist_value的值（默认值为64）时，  
redis会使用跳跃表作为有序集合的底层实现。  
否则会使用ziplist作为有序集合的底层实现

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927224930.png)

‍

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927224950.png)

范围以内ziplist，范围以外调表

‍

‍

redis7也类似

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927225138.png)

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927225225.png)

‍

范围以内listpack，范围以外ziplist

根据源码

ntztAddrobj *zobj,double score,sds ele,int in_flags,int* **out_flags,double**  ***newscore）{1320ptions into simple to check vars.1321int incr =（in_flags &amp;ZADD_IN_INCR)1=0;1322int nx=（in_flags&amp;ZADD_INNX)!=0;1323intxx=(in_flags&amp;ZADD_IN XX)!=0;1324int gt=（（in_flags&amp;ZZADD_IN GT)1=0;1325tnt it=（in_flags&amp;ZADD_IN_LT)!=0;1326***​**out_flags=0;We'll return our response flags.**​ */1327double curscore;13281329Nal as input is an error regardless of all the other parameters.1330if（isnan(score)）{1331*out_flags-ZADD_OUT_NAN;  
1332return 0;  
1333  
1334  
1335Update the sortedet according to its  
1336if（zobj->encoding  
coding.  
OBJ_ENCODING_LISTPACK  
1337unsigned char  
1338  
1339if（（eptr =zz1Find（zobj->ptr,ele,&curscore））1-NULL）{  
1340*NX? Return, same element already exists.* /  
1341if（nx）{  
1342*out_flags |-ZADD_OUT_NOP

也可以看出来

‍

‍

为什么引|出跳表

先从一个单链表来讲

对于一个单链表来讲，即便链表中存储的数据是有序的，如果我们要想在其中查找某个数据，也只能从头到尾遍历链表。  
这样查找效率就会很低，时间复杂度会很高O(N)

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927234607.png)

‍

数组和链表各有优缺点  
链表遍历的时候，时间复杂度最差会出现O（N)，我们优化一下，尝试  
空间换时间，给链表加个索引，称为“索引升级”，两两取首即可。

‍

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927234631.png)

‍

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927234745.png)

从这个例子里，我们看出，加来一层索引之后，查找一个结点需要遍历的结点个数减少了，也就是说查找效率提高了。

‍

‍

画了一个包含64个结点的链表，按  
照前面讲的这种思路，建立了五级索引

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927234854.png)

找第62个，之前需要62次现在只需5次

skiplist是一种以空门换取时间的结构。简单来说，**跳表就是支持二分查找的链表，总结来讲跳表=链表+多级索引**  
由于链表，无法进行二分查找，因此借鉴数据库索引的思想，提取出链表中关键节点（索引），先在关键节点上查找，再进入下层链  
表查找，提取多层关键节点，就形成了跳跃表  
but  
**由于索引也要占据一定空间的，所以，索引添加的越多，空间占用的越多**

跳表查询的时间复杂度分析，如果链表里有N个结点，会有多少级索引呢？  
按照我们前面讲的两两取首。每两个结点会抽出一个结点作为上一级索引的结点，以此估算：  
第一级索引的结点个数大约就是n/2，  
第二级索引的结点个数大约就是n/4，  
第三级索引的结点个数大约就是n/8，依次类推..….  
也就是说，第k级索引的结点个数是第k-1级索引的结点个数的1/2，那第k级索引结点的个数就是n/(2个k)  
假设索引|有h级，最高级的索引|有2个结点。通过上面的公式，  
我们可以得到n/(2h)=2，从而求得h=log2n-1  
如果包含原始链表这一层，整个跳表的高度就是log2n

假设索引|有h级，最高级的索引|有2个结点。通过上面的公式，  
我们可以得到n/(2h)=2，从而求得h=log2n-1  
如果包含原始链表这一层，整个跳表的高度就是log2n

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927235226.png)

跳表查询的空间复杂度分析  
比起单纯的单链表，跳表需要存储多级索引，肯定要消耗更多的存储空间。那到底需要消耗多少额外的存储空间呢？  
我们来分析一下跳表的空间复杂度。  
第一步：首先原始链表长度为n，  
第二步：两两取首，每层索引的结点数：n/2，n/4，n/8...，8，4，2每上升一级就减少一半，直到剩下2个结点，以此类推；如果我们把每层索引的  
结点数写出来，就是一个等比数列。  
原始链表大小为n，每2个结点抽1个，每层索引的结点数：  
nhn  
2，，,8，4，2  
这几级索引的结点总和就是n/2+n/4+n/8+8+4+2=n-2。所以，跳表的空间复杂度是O（n）。也就是说，如果将包含n个结点的单链表构造成  
跳表，我们需要额外再用接近n个结点的存储空间。

第三步：思考三三取首，每层索引的结点数：n/3，n/9，n/27...，9，3，1以此类推；  
第一级索引需要大约n/3个结点，第二级索引需要大约n/9个结点。每往上一级，索引结点个数都除以3。为了方便计算，我们假设最高一级的索  
引结点个数是1。我们把每级索引的结点个数都写下来，也是一个等比数列

第三步：思考三三取首，每层索引的结点数：n/3，n/9，n/27...，9，3，1以此类推；  
第一级索引需要大约n/3个结点，第二级索引需要大约n/9个结点。每往上一级，索引结点个数都除以3。为了方便计算，我们假设最高一级的索  
引结点个数是1。我们把每级索引的结点个数都写下来，也是一个等比数列  
原始链表大小为n，每3个结点抽1个，每层索引的结点数：  
hhn  
3,9'279,3.1  
通过等比数列求和公式，总的索引结点大约就是n/3+n/9+n/27+…+9+3+1=n/2。尽管空间复杂度还是O(n），但比上面的每两个结点抽一个结  
点的索引构建方法，要减少了一半的索引结点存储空间。  
所以空间复杂度是o（n)；

‍

那为什么不每4个取一个

‍

‍

‍

优点：  
跳表是一个最典型的空间换时间解决方案，而且只有在数据量较大的情况下才能体现出来优势。而且应该是读多写少的情况下才能使用，所以它的适  
用范围应该还是比较有限的  
缺点：  
维护成本相对要高，  
在单链表中，一旦定位好要插入的位置，插入结点的时间复杂度是很低的，就是O(1)  
but  
新增或者删除时需要把所有索引都更新一遍，为了保证原始链表中数据的有序性，我们需要先找  
到要动作的位置，这个查找操作就会比较耗时最后在新增和删除的过程中的更新，时间复杂度也是O(logn)

‍

‍

插入删除的过程请补充，带源码

‍

在Redis丰富的数据类型中，`ZSet`（有序集合）以其独特的“分数-成员”结构，在排行榜、延迟队列、范围查找等场景中扮演着不可或-的角色。为了支撑其高效的排序和查找能力，`ZSet`的底层实现同样采用了动态编码策略，在追求内存效率的`ziplist`/`listpack`和追求极致性能的`skiplist`（跳表）之间进行智能切换。

本文将深入`ZSet`的内部世界，解析其两种编码形态的转换机制，并重点探究其高性能核心——`skiplist`的设计思想、时空复杂度，以及其优雅的插入与删除操作。

## **ZSet的两种“面孔”：紧凑与高效**

与Hash类型相似，一个`ZSet`对象也会根据存储数据的大小和数量，在两种编码方式之间进行选择。

1. **紧凑编码**：当`ZSet`中存储的元素数量较少，且每个元素的成员（member）长度都较短时，Redis会采用一种极其节省内存的连续存储结构。

    - **Redis 6及之前**: `ziplist` (压缩列表)
    - **Redis 7之后**: `listpack` (紧凑列表)
2. **高效编码**：一旦超出预设的阈值，`ZSet`就会被转换为`skiplist`（跳表）+ `dict`（字典）的复合结构。

这个转换的“门槛”由两个参数共同决定：

- ​**​`zset-max-ziplist-entries`​**  **/**  **​`zset-max-listpack-entries`​**: 紧凑编码下允许的最大元素数量（默认128）。
- ​**​`zset-max-ziplist-value`​**  **/**  **​`zset-max-listpack-value`​**: 紧凑编码下每个成员（member）的最大长度（默认64字节）。

```shell
# Redis 6中的配置
127.0.0.1:6379> config get zset-max-ziplist-*
1) "zset-max-ziplist-entries"
2) "128"
3) "zset-max-ziplist-value"
4) "64"

# Redis 7中的配置 (同时保留ziplist以兼容)
127.0.0.1:6379> config get zset-max-*-*
1) "zset-max-listpack-value"
2) "64"
3) "zset-max-ziplist-value"
4) "64"
5) "zset-max-ziplist-entries"
6) "128"
7) "zset-max-listpack-entries"
8) "128"
```

只要**任一条件不满足**，`ZSet`就会从紧凑编码**自动升级**为`skiplist`。这种升级同样是**单向的，不可逆**。

### **编码转换实战**

- **Redis 6 (**​**​`ziplist`​**​ **)** :

  ![ziplist编码示例](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927224930.png)

  当添加的成员长度超过6字节时，编码自动转换为`skiplist`。

  ![ziplist到skiplist转换示例](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927224950.png)
- **Redis 7 (**​**​`listpack`​**​ **)** :

  ![listpack编码示例](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927225138.png)

  当元素数量超过4个时，编码自动转换为`skiplist`。

  ![listpack到skiplist转换示例](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927225225.png)

从`zaddCommand`的源码调用栈中，我们也能清晰地看到，当对象编码为`OBJ_ENCODING_LISTPACK`时，会进入特定的处理分支，并在不满足条件时触发转换。

![zadd源码逻辑](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927225421.png)

## **为何需要跳表？**

当数据量增大，`ziplist`/`listpack`这种O(N)查找效率的线性结构显然无法满足性能要求。我们需要一种更高效的有序结构。

- **普通有序链表**：查找一个元素，最坏情况下需要遍历整个链表，时间复杂度为O(N)。

  ![单链表查找](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927234607.png)
- **引入“索引”** ：为了加速查找，我们可以借鉴数据库索引的思想，从原始链表中提取出部分节点，形成一级“快速通道”或“索引”。
- **多级索引的诞生**：如果一层索引不够快，我们可以在索引之上再建立索引，层层向上，最终形成一个多级的索引结构。这就是**跳表 (Skip List)** 。

  ![多级索引](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927234745.png)

**跳表，本质上是“支持二分查找的链表”，它通过构建多级索引，实现了空间与时间的完美平衡。**

![64个节点的跳表示例](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927234854.png)

如上图，在一个包含64个节点的跳表中查找第62个元素，不再需要62次遍历，而只需沿着最高层索引“跳跃”，逐层向下逼近，效率大大提升。

##### **时空复杂度分析**

- **时间复杂度**: 假设每2个节点提取一个索引，那么`k`级索引的节点数约为`n/(2^k)`。整个跳表的高度约为`log₂n`。在每一层索引中，遍历的节点数不超过3个。因此，跳表的查找、插入、删除的时间复杂度都是**O(logN)** 。

  ![时间复杂度分析](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250927235226.png)
- **空间复杂度**: 同样假设每2个节点提取一个索引，总的索引节点数约为 `n/2 + n/4 + n/8 + ... + 2 ≈ n`。因此，跳表的空间复杂度是**O(N)** 。虽然增加了额外的存储开销，但换来的是查询效率的巨大飞跃。

## **​`skiplist`​**​**的插入与删除操作（含源码逻辑）**

跳表的动态维护是其设计的精髓所在。

### **插入操作**

1. **查找插入位置**: 插入操作首先需要像查找操作一样，从最高层索引开始，找到每一层应该插入新节点的位置。在这个过程中，我们会记录下每一层需要插入位置的前驱节点（保存在一个`update`数组中）。
2. **随机决定新节点层高**: 这是跳表的**随机化**核心。新节点会被插入到多少层索引中，是通过一个随机算法决定的。Redis的实现是：新节点有`1/P`（默认P=4，即25%）的概率增加一层，直到达到最大层高。这种概率性设计，使得跳表在动态增删后，能大概率地维持其结构平衡，而无需像平衡树那样进行复杂的旋转操作。
3. **创建并插入新节点**: 创建一个具有随机出的层高的新节点。
4. **逐层更新指针**: 遍历`update`数组，从第0层到新节点的最高层，将被记录的前驱节点的`forward`指针指向新节点，并将新节点的`forward`指针指向原前驱节点的后继节点，完成链入操作。

**源码逻辑 (**​**​`zslInsert`​**​ **)** :

**目标**：在一个现有的跳表中，插入一个新节点 `{score: 21, value: "V21"}`。

```
Level 2: H ------------------------------> 37
         |                                  |
Level 1: H ------> 13 -------------------->37
         |        	|                       |
Level 0: H -> 9 -> 13 -> 17 -> 26 -> 30 -> 37 -> 42‍
```

#### **步骤1：查找插入路径并记录前驱节点 (**​**​`update`​**​**数组)**

这个过程就像一次查找，我们需要从最高层开始，为每一层找到新节点应该插入的位置，并记录下该位置的**前驱节点**。

- **Level 2**: 从 `H` 开始，`H->forward` 是 `37`。`21 < 37`，所以 `21` 应该在 `H` 和 `37` 之间。记录 Level 2 的前驱节点是 `H`。`update[2] = H`。
- **Level 1**: 从 `H` 开始，`H->forward` 是 `13`。`21 > 13`，前进。当前节点是 `13`，`13->forward` 是 `37`。`21 < 37`，所以 `21` 应该在 `13` 和 `37` 之间。记录 Level 1 的前驱节点是 `13`。`update[1] = 13`。
- **Level 0**: 从 `13` 开始（上一层的终点），`13->forward` 是 `17`。`21 > 17`，前进。当前节点是 `17`，`17->forward` 是 `26`。`21 < 26`，所以 `21` 应该在 `17` 和 `26` 之间。记录 Level 0 的前驱节点是 `17`。`update[0] = 17`。

**源码逻辑 (**​**​`zslInsert`​**​ **)** :

```c
// t_zset.c
// 1. 查找路径记录:
//    update[] 数组记录每层的前驱节点
zskiplistNode *update[ZSKIPLIST_MAXLEVEL], *x;
int i;

x = zsl->header; // 从头节点开始
for (i = zsl->level-1; i >= 0; i--) { // 从最高层向下
    // 在当前层循环查找，直到找到插入位置的前一个节点
    while (x->level[i].forward &&
            (x->level[i].forward->score < score ||
                (x->level[i].forward->score == score &&
                 sdscmp(x->level[i].forward->ele, ele) < 0)))
    {
        x = x->level[i].forward; // 前进
    }
    update[i] = x; // 记录这一层的前驱节点
}
```

#### **步骤2 &amp; 3：随机层高并创建新节点**

通过随机算法，假设我们为新节点“掷”出的层高为 **2**。这意味着新节点将出现在 Level 0 和 Level 1 中。然后，我们创建一个层高为2的新节点 `(21)`。

**源码逻辑 (**​**​`zslInsert`​**​ **)** :

```c
// 2. 随机层高:
//    zslRandomLevel() 通过概率决定新节点的层高
int level = zslRandomLevel();

// 3. 如果新层高大于当前跳表最大层高，扩展跳表
if (level > zsl->level) { /* ... */ }

// 4. 创建新节点
x = zslCreateNode(level, score, ele);
```

#### **逐层更新指针**

现在，我们利用之前记录的`update`数组来“接入”新节点。

- **Level 0**: `update[0]` 是 `17`。

  - 将 `(21)` 的 `forward[0]` 指向 `17` 原来的 `forward[0]` (即 `26`)。
  - 将 `17` 的 `forward[0]` 指向新节点 `(21)`。
- **Level 1**: `update[1]` 是 `13`。

  - 将 `(21)` 的 `forward[1]` 指向 `13` 原来的 `forward[1]` (即 `37`)。
  - 将 `13` 的 `forward[1]` 指向新节点 `(21)`。

**可视化结果**：

```
Level 2: H ------------------------------> 37
         |                                 |
Level 1: H ------> 13 ------> 21 --------> 37
         |          |          |           |
Level 0: H -> 9 -> 13 -> 17 -> 21 -> 26 -> 37 -> 42
```

**源码逻辑 (**​**​`zslInsert`​**​ **)** :

```c
// 5. 逐层更新指针:
for (i = 0; i < level; i++) {
    // 新节点的forward指针指向前驱节点原来的forward
    x->level[i].forward = update[i]->level[i].forward;
    // 前驱节点的forward指针指向新节点
    update[i]->level[i].forward = x;
}
```

‍

### **删除操作**

1. **查找目标节点**: 与插入类似，首先查找到要删除的节点，并记录下其在每一层的前驱节点（同样保存在`update`数组中）。
2. **逐层更新指针 (“绕过”操作)** : 遍历每一层，如果该层包含目标节点，就将被记录的前驱节点的`forward`指针，直接指向目标节点的后继节点，从而将目标节点从该层“链”中移除。
3. **释放节点**: 在所有层都完成“绕过”操作后，释放目标节点的内存。
4. **更新跳表层高**: 如果删除的是最高层的最后一个节点，可能需要降低跳表的总层高。

**目标**：从上述跳表中，删除节点 `{score: 21, value: "V21"}`。

#### **步骤1：查找目标节点并记录前驱**

和插入一样，我们首先要找到每一层中待删除节点的前驱节点，并存入`update`数组。结果与插入时的查找过程完全相同：`update[2]=H`, `update[1]=13`, `update[0]=17`。

#### **步骤2：逐层更新指针 (“绕过”操作)**

现在，我们逐层修改指针，将被删除节点“架空”。

- **Level 0**: `update[0]` 是 `17`。它的 `forward[0]` 正是我们要删除的节点 `(21)`。

  - 我们将 `17` 的 `forward[0]` 指向 `(21)` 的 `forward[0]` (即 `26`)。
- **Level 1**: `update[1]` 是 `13`。它的 `forward[1]` 正是我们要删除的节点 `(21)`。

  - 我们将 `13` 的 `forward[1]` 指向 `(21)` 的 `forward[1]` (即 `37`)。
- **Level 2**: `update[2]` 是 `H`。它的 `forward[2]` 是 `37`，不是 `(21)`，所以这一层无需操作。

**可视化结果**：

```
Level 2: H ----------------------------- > 37
         |                                 |
Level 1: H ------> 13 -------------------> 37
         |         |                       |
Level 0: H -> 9 -> 13 -> 17 -> 26 -> 30 -> 37 -> 42
```

#### **步骤3：释放节点**

在所有指针都更新完毕后，节点 `(21)` 已经不再被任何`forward`指针引用，可以安全地释放其内存。

**源码逻辑 (**​**​`zslDelete`​**  **-&gt;**  **​`zslDeleteNode`​**​ **)** :

```c
// t_zset.c
void zslDeleteNode(zskiplist *zsl, zskiplistNode *x, zskiplistNode **update) {
    int i;
    // 1. 逐层更新指针:
    for (i = 0; i < zsl->level; i++) {
        // 如果前驱节点的下一个是目标节点x
        if (update[i]->level[i].forward == x) {
            // 将前驱节点直接指向目标节点的后继节点，完成“绕过”
            update[i]->level[i].forward = x->level[i].forward;
        }
    }
    // ...
    // zslFreeNode(x) 会在 zslDelete 中被调用
}
```

‍

###  **更新操作 (Update)**

​`skiplist`本身没有独立的“更新”操作。当需要更新一个元素的分数（score）时，Redis采用了一种**更简单、更健壮的策略**：

> **更新 = 删除旧节点 + 插入新节点**

**为什么这样做？**

- **代码复用与健壮性**：`DELETE`和`INSERT`是经过充分测试的核心操作，复用它们可以避免编写一套全新的、复杂的节点“移动”逻辑，降低了出错风险。
- **性能可接受**：由于删除和插入操作的时间复杂度都是O(logN)，所以整个更新操作的时间复杂度也是O(logN)，性能完全在可接受的范围内。
- ​**​`dict`​**​**的辅助**：`ZSet`的`skiplist`编码总是与一个`dict`（字典）并存的。当需要更新时，可以通过`dict`以O(1)的效率快速找到旧分数和节点指针，为`DELETE`操作提供了极大的便利。

#### **结论**

​`ZSet`的底层实现是Redis在内存效率与时间效率之间进行权衡的又一典范。

- 在数据量小、内容短的场景下，它采用`ziplist`/`listpack`，以**时间换空间**，追求极致的内存利用率。
- 当数据增长到一定规模，它果断“升级”为`skiplist`，以**空间换时间**，通过巧妙的多级索引结构，提供了对数级的、可预测的高性能有序操作。

​`skiplist`以其相对简单（相比平衡树）的实现，和优雅的随机化平衡策略，成为了`ZSet`高性能的核心引擎，也是Redis设计哲学中实用主义与性能并重的完美体现。
