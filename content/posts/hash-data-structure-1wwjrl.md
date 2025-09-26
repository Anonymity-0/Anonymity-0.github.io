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





案例

‍

redis 6

127.0. 0.1:6379> config get hash*  
1)"hash-max- ziplist- entries"  
2））"512"  
3)"hash-max-ziplist-value"  
4）“64"  
127. 0. 0. 1: 6379>

‍

redis7

127.0.0.1:6379> config get hash*  
)"hash-max-listpack-entries"  
2)"512"  
3)"hash- max- ziplist- entries"  
4)"512"  
5)"hash-max-listpack- value"  
6)"64"  
7)"hash-max-ziplist-value"  
8)"64"  
127.0.0.1: 6379>

ziplist

**hash-max-ziplist-entries：使用压缩列表保存时哈希集合中的最大元素个数。
hash-max-ziplist-value：使用压缩列表保存时哈希集合中单个元素的最大长度。**   
Hash类型键的字段个数小于hash-max-ziplist-entries并且每个字段名和字段值的长度小于hash-max-ziplist-value时，  
Redis才会使用OBJ_ENCODING_ZIPLIST来存储该键，**前述条件任意一个不满足则会转换为OBJ_ENCODING_HT的编码方式**

‍

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926135557.png)

‍

127. 0. 0.1: 6379> hset user01 id 11  
          (integer）1  
          127.0. 0.1:6379> 0BJECT encoding user01  
          "ziplist"
128. 0.0.1: 6379> hset user01 id 1234567891112  
      （integer）o  
      127.0.0.1: 6379> 0BJECT encoding user01  
      "hashtable"
129. 0. 0. 1: 6379>  
              127.0.0.1:6379> hset user02 id 12 cname z3 age 22  
              （integer）3  
              127.0.0.1:6379> config get hash*  
              1)）"hash-max- ziplist-entries"  
              2）"3"  
              3））"hash-max- ziplist-value"  
              4)"8"  
              127.0.0.1: 6379> 0BJECT encoding user02  
              "ziplist"  
              127.0.0.1:6379> hset user02 id 12 cname z3 age 22 phone 13811111111  
              (integer）1  
              127.0.0.1:6379> 0BJECT encoding user02  
              'hashtable"
130. 0. 0.1: 6379>
131. .哈希对象保存的键值对数量小于512个；  
      2.所有的键值对的健和值的字符串长度都小于等于64byte（一个英文字母一个字节）  
      时用ziplist，反之用hashtable  
      ziplist升级到hashtable可以，反过来降级不可以

一旦从压缩列表转为了哈希表，Hash类型就会一直用哈希表进行保存而不会再转回压缩列表了。  
在节省内存空间方面哈希表就没有压缩列表高效了。

​

‍

源码分析

在Redis 中，hashtable 被称为字典（dictionary），它是一个数组+链表的结构  
OBJ_ENCODING_HT编码分析每个键值对都会有一个dictEnt

**每个键值对都会有一个dictEntry**

OBJ_ENCODING_HT这种编码方式内部才是真正的哈希表结构，或称为字典结构，其可以实现O(1)复杂度的读写操作，因此效率很高。  
在Redis内部，从OBJ_ENCODING_HT类型到底层真正的散列表数据结构是一层层嵌套下去的，组织关系见面图：

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926140706.png)

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926140923.png)

‍

‍

hset命令解读类型

hset其实就是调用hsetcommand

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926141231.png)

可以看到编码的转换

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926141918.png)

‍

Ziplist压缩列表是一种紧凑编码格式，总体思想是多花时间来换取节约空间即以部分读写性能为代价，来换取极高的内存空间利用率，  
因此只会用于**字段个数少，且字段值也较小的场景**。压缩列表内存利用率极高的原因与其连续内存的特性是分不开的。

> The ziplist is a specially encoded dually linked list that is designed
>
> - to be very memory efficient. It stores both strings and integer values,  
>   where integers are encoded as actual integers instead of a series of  
>   characters.1It allows push and pop operations on either side of the list  
>   in o(1) time.However, because every operation requires a reallocation of  
>   the memory used by the ziplist, the actual complexity is related to the  
>   amount of memory used by the ziplist.

想想我们的学过的一种GC垃圾回收机制：标记--压缩算法  
当一个hash对象只包含少量键值对且每个键值对的键和值要么就是小整数要么就是长度比较短的字符串，那么它用ziplist作为底层实现

‍

ziplist是一个经过特殊编码的双向链表，，它**不存储指向前一个链表节点prev和指向下一个链表节点的指针next而是存储上一个节点长度和当前节点长度**，通过牺牲部分读写性能，来换取高效的内存空间利用率，节约内存，是一种时间换空间的思想。只用在**字段个数少，字段值小的场景里面。**

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926142314.png)

性类型长度用途  
zlbytesuint32_t4字节记录整个压缩列表占用的内存字节数：在对压缩列表进行内存重分配，  
或者计算zlend的位置时使用  
zltailuint32_t4字节记录压缩列表表尾节点距离压缩列表的起始地址有多少字节：通过这个  
偏移量，程序无须遍历整个压缩列表就可以确定表尾节点的地址  
记录了压缩列表包含的节点数量：当这个属性的值小于UINT16_MAX  
zllenuint16_t2字节（65535）时，这个属性的值就是压缩列表包含节点的数量；当这个值等于  
UINT16MAX时，节点的真实数量需要遍历整个压缩列表才能计算得出  
entryx列表节点不定压缩列表包含的各个节点，节点的长度由节点保存的内容决定  
zlenduint8_t1字节特殊值0xFF（十进制255），用于标记压缩列表的末端

‍

java hash“封装了一个什么类型的数组？？

finalvputval（int hash，K key，V value，boolean onlyIfAbsent，  
boolean evict){  
INode<K,V>[] tab;Node<K,V>p; int n,i;  
if （(tab =table) ** nul1 11(n =tab.length)** 0)n = (tab = resize()).length;if （(p =tab[i =(n -1)&amp; hash]）== nul1)  
tab[i] = newNode(hash, key, value, next:nul1);  
else {

原来存的不是数值而是存的node

static classNode<K,V>implements Map.Entry<K,V>{  
final int hash;  
final K key;  
Vvalue;  
Node<K,V> next;

redis hash  
封装了一个新的特有数据结构ziplist

typedef struct zlentry  
unsigned int prevralensize;；/* Bytes used to encode the previous entry len */unsigned int prevrawlen;/* Previous entry len. */unsigned int lensize;/*  Bytes used to encode this entry type/len.  
For example strings have a1,2or 5bytes  
header. Integers always use a single byte. */unsigned int len;/*  Bytes used to represent the actual entry.  
For strings this is just the string length  
while for integers it is 1,2,3,4,8 or  
0（for 4 bit immediate) depending on the  
number range.  
unsigned int headersize;*prevrawlensize +lensize.* /  
unsigned char encoding;*Set to ZIP_STR_* or ZIP_INT_*depending onthe entry encoding.However for 4 bitsimmediate integers this can assume a rangeunsigned char* **p;of values and must be range-checked.**​ *//* Pointer to the very start of the entry,that  
is, this points to prev-entry-len field.*/  
zlentry;

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926144032.png)

‍

从命令来具体分析

‍

‍

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926143827.png)

压缩列表zlentry节点结构：每个zlentry由前一个节点的长度、encoding和entry-data三部分组成 最重要的三个zhi**prevlen记录了前一个节点的长度；
encoding记录了当前节点实际数据的类型以及长度
data记录了当前节点的实际数据**

前节点：I（前节点占用的内存字节数)表示前1个zlentry的长度，privious_entry_length有两种取值情况：**1字节或5字节**。取值1字节时，表示上一  
个entry的长度小于254字节。虽然1字节的值能表示的数值范围是0到255，但是压缩列表中zlend的取值默认是255，因此，就默认用255表示整个  
压缩列表的结束，其他表示长度的地方就不能再用255这个值了。所以，当上一个entry长度小于254字节时，preV_len取值为1字节，否则，就取  
值为5字节。记录长度的好处：占用内存小，1或者5个字节

enncoding：记录节点的content保存数据的类型和长度。

content：保存实际数据内容

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926144259.png)

为什么zlentry这么设计？数组和链表数据结构对比

privious_entry_length，encoding长度都可以根据编码方式推算，真正变化的是conent，而content长度记录在encoding里，因此entry的长  
度就知道了。entry总长度=privious_entry_length字节数+encoding字节数+content字节数

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926144609.png)

**为什么entry这么设计？记录前一个节点的长度？**   
链表在内存中，一般是不连续的，遍历相对比较慢，而ziplist可以很好的解决这个问题。如果知道了当前的起始地址，因为entry是连续的，entry后一定是另一个entry，想知道下一个entry的地址，只要将当前的起始地址加上当前entry总长度。如果还想遍历下一个entry，只要继续同样的操作。虽然你可以用「当前entry 长度」跳到**下一个 entry**，但如果你不知道「前一个 entry 的长度」，你就无法从后往前**反向遍历**，也无法快速定位前一个节点。

‍

**明明有链表了，为什么出来一个压缩链表？**

1普通的双向链表会有两个指针，在存储数据很小的情况下，我们存储的实际数据的大小可能还没有指针占用的内存大，得不偿失。ziplist是一个  
特殊的双向链表没有维护双向指针：previousnext；而是存储上一个entry的长度和当前entry的长度，通过长度推算下一个元素在什么地方。牺牲  
读取的性能，获得高效的存储空间，因为（简短字符串的情况)存储指针比存储entry长度更费内存。这是典型的“时间换空间”。  
2链表在内存中一般是不连续的，遍历相对比较慢而ziplist可以很好的解决这个问题，普通数组的遍历是根据数组里存储的数据类型找到下一个元素  
的(例如int类型的数组访问下一个元素时每次只需要移动一个sizeof(int)就行)，但是ziplist的每个节点的长度是可以不一样的，而我们面对不同长  
度的节点又不可能直接sizeof(entry)，所以ziplist只好将一些必要的偏移量信息记录在了每一个节点里，使之能跳到上一个节点或下一个节点。  
备注：sizeof实际上是获取了数据在内存中所占用的存储空间，以字节为单位来计数。  
3头节点里有头节点里同时还有一个参数len，和string类型提到的SDS类似，这里是用来记录链表长度的。因此获取链表长度时不用再遍历整个  
链表，直接拿到len值就可以了，这个时间复杂度是O(1)

‍

总结

ziplist为了节省内存，采用了紧凑的连续存储。I  
ziplist是一个双向链表，可以在时间复杂度为O(1）下从头部、尾部进行pop 或push。  
**新增或更新元素可能会出现连锁更新现象(致命缺点导致被listpack替换)。**   
不能保存过多的元素，否则查询效率就会降低，数量小和内容小的情况下可以使用。

‍

redis7

hash-max-listpack-entries:使用上保存时哈希集合中的最大元素个数。  
hash-max-listpack-va使用压缩列表保存时哈希集合中单个元素的最大长度。  
Hash类型键的字段个数小hash-max-listpack-entries且每个字段名和字段值的长度小于hash-max-listpack-value时，  
Redis才会使用OB]_ENCODING_LISTPACK来存储该键，前述条件任意一个不满足则会转换为OBJ_ENCODING_HT的编码方式

redis7为了兼容还是保留了zipilist，listpack的修改会影响ziplist，ziplist的修改也会影响listpack

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926145433.png)

127.0. 0.1: 6379> config set hash- max- listpack- entries 2  
OK  
127.0.0.1:6379> config set hash-max- listpack- value 4  
OK  
127.0.0.1:6379> hset user01 id 1 name z3  
[integer）2  
127. 0. 0.1: 6379>  
127.O.O.1:6379> 0BJECT ENCODING uSerO1  
"listpack"  
127.0.0.1:6379> hset user01 id 1 name z3 age 22  
(integer）1R  
127.0.O.1:6379> 0BJECT ENCODING uSer01  
"hashtable"  
127. 0. 0. 1: 6379

1.哈希对象保存的键值对数量小于512个；  
2.所有的键值对的健和值的字符串长度都小于等于64byte（一个英文字母一个字节）  
时用listpack，反之用hashtable  
listpack升级到hashtable可以，反过来降级不可以

创建hash对象的时候现在编码是lsitpack了

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926145614.png)

lpNeW函数创建了一个空的listpack，一开始分配的大小是LP_HDR_SIZE再加1个字节。LP_HDR_SIZE宏定义是在  
listpack.c中，它默认是6个字节，其中4个字节是记录listpack的总字节数，2个字节是记录listpack的元素数量。  
此外，listpack的最后一个字节是用来标识listpack的结束，其默认值是宏定义LP_EOF。  
和ziplist列表项的结束标记一样，LP_EOF的值也是255

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926145656.png)

开始创建

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926145843.png)

思路和之前一样

**明明有ziplist了，为什么出来一个listpack紧凑列表？**

压缩列表新增某个元素或修改某个元素时，如果空间不不够，压缩列表占用的内存空间就需要重新分配。而当新插入的元素较大时，T可能会导致后续  
元素的prevlen占用空间都发生变化，从而引起「连锁更新」问题，导致每个元素的空间都要重新分配，造成访问压缩列表性能的下降。  
案例说明：**压缩列表每个节点正因为需要保存前一个节点的长度字段，就会有连锁更新的隐患**

第一步：现在假设一个压缩列表中有多个连续的、长度在250～253之间的节点，如下图：

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926150242.png)

因为这些节点长度值小于254字节，所以prevlen属性需要用1字节的空间来保存这个长度值，一切OK，O（n_n)O哈哈~

第二步：这时，如果将一个长度大于等于254字节的新节点加入到压缩列表的表头节点，即新节点将成为entry1的前置节点，如下图：

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926150316.png)

因为entry1节点的prevlen属性只有1个字节大小，无法保存新节点的长度，此时就需要对压缩列表的空间重分配操作并将entry1节点的prevlen属  
性从原来的1字节大小扩展为5字节大小

**第三步：连续更新问题出现**

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926150433.png)

‍

entry1节点原本的长度在250～253之间，因为刚才的扩展空间，此时entry1节点的长度就大于等于254，因此原本entry2节点保存entry1节点的  
prevlen属性也必须从1字节扩展至5字节大小。entry1节点影响entry2节点，entry2节点影响entry3节点.... **.一直持续到结尾。这种在特殊情况下
产生的连续多次空间扩展操作就叫做「连锁更新】**

listpack是Redis设计用来取代掉ziplist的数据结构，它通过每个节点记录自己的长度且放在节点的尾部，来彻底解决掉了ziplist存在的连锁更新的问题

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926161332.png)

TotalBytes为整个listpack的空间大小，占用4个字节，每个listpack最多占用4294967295Bytes。  
num-elements为listpack中的元素个数，即Entry的个数占用2个字节  
element-1~element-N为每个具体的元素  
istpack-end-byte为listpack结束标志，占用1个字节，内容为0xFF。

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926161419.png)

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926161533.png)

ziplist内存布局VSlistpack内存布局

**和ziplist列表项类似，listpack列表项也包含了元数据信息和数据本身。不过，为了避免ziplist引起的连锁更新问题，listpack中的每个列表项不再像ziplist列表项那样保存其前一个列表项的长度。**

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250926161640.png)

✅ **ziplist**：每个 entry 存 `prev_length`（前一个 entry 的长度）→ 支持反向遍历，但有“连锁更新”问题  
❌ **listpack**：不再存 `prev_length` → 避免动态扩展和连锁更新，更稳定

🔥 **如果 listpack 不再存储“前一个 entry 的长度”，它是怎么实现反向遍历的？**

listpack 虽然不存 `prev_length`，但它把 **每个 entry 的总长度** 编码在 entry 的末尾（或可通过解析得到），然后从尾部开始，**通过读取最后一个 entry 的长度，倒推其起始地址，从而实现反向遍历。**

‍

‍

hash的两种编码格式

redis6  
hashtable

zipolist  
listpack  
redis7  
hashtable

‍

‍

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
