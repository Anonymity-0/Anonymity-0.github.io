---
title: 一文写完反转链表
slug: reverse-link-list-after-writing-an-article-z1f2d9o
url: /post/reverse-link-list-after-writing-an-article-z1f2d9o.html
date: '2025-06-28 21:21:48+08:00'
lastmod: '2025-06-28 21:22:01+08:00'
tags:
  - 链表
categories:
  - leetcode
keywords: 链表
toc: true
isCJKLanguage: true
---



# 一文写完反转链表

反转链表其实是面试里最常考的题目之一了，不管是重排链表（美团经典手撕），反转链表2,k个一组反转链表，都是非常常见的面试题，就把这个作为备战秋招的第一个算法总结来开始俺的秋招blog！

首先是链表的定义，定义也要手挫一下，因为除了团子基本上都是acm模式。

```Java
class ListNode {
    int val;
    ListNode next;
    ListNode(){}
    ListNode(int val){
        this.val = val;
    }
    ListNode(int val,ListNode next){
        this.val = val;
        this.next = next;
    }
}
```

## 反转链表

题意：反转一个单链表。

示例: 输入: 1-\>2-\>3-\>4-\>5-\>NULL 输出: 5-\>4-\>3-\>2-\>1-\>NULL

思路上参考

[https://leetcode.cn/problems/reverse-linked-list/solutions/36710/dong-hua-yan-shi-206-fan-zhuan-lian-biao-by-user74/](https://leetcode.cn/problems/reverse-linked-list/solutions/36710/dong-hua-yan-shi-206-fan-zhuan-lian-biao-by-user74/)

- 定义两个指针： pre 和 cur ；pre 在前 cur 在后。
- 每次让 cur 的 next 指向 pre ，实现一次局部反转
- 局部反转完成之后，pre 和 cur 同时往后移动一个位置
- 循环上述过程，直至 cur 到达链表尾部

这个就是基础中的基础，已经是要背下来的程度了

```Java
public ListNode reverseList(ListNode head) {
    ListNode pre = null;
    ListNode cur = head;
    while (cur != null) {
        ListNode tmp = cur.next;
        cur.next = pre;
        pre = cur;
        cur = tmp;
    }
    return pre;
}
```

当然了，基本上不会有面试官如此仁慈只考一个最简单的反转，比较稍微进阶的是反转链表II

## 反转链表II

给你单链表的头指针 `head` 和两个整数 `left` 和 `right` ，其中 `left <= right` 。请你反转从位置 `left`到位置 `right` 的链表节点，返回 **反转后的链表** 。

其实反转链表II无非就是反转一部分的意思，反转的思路和反转链表差不多。

让p先走left-2步，此时p.next就是反转的起点即cur，初始化pre为null。

接着再按照反转链表I的思路进行反转right-left+1步。

此时这一段已经反转好了，但是要让p接上

p.next.next \= cur;

p.next \= pre;

```Java
class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0,head);
        ListNode p = dummy;
        for(int i = 0;i<left-1;i++){
            p = p.next;
        }
        ListNode cur = p.next;
        pre = null;
        for(int i = 0;i<right-left+1;i++){
            ListNode tmp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = tmp;
        }
        p.next.next = cur;
        p.next = pre;
        return dummy.next;    
    }
}
```

来一步步图解这个过程。

假设我们的链表是 1 -\> 2 -\> 3 -\> 4 -\> 5 -\> NULL，并且 left \= 2, right \= 4。

目标是反转从第2个节点到第4个节点的部分，即 2 -\> 3 -\> 4 反转为 4 -\> 3 -\> 2。

最终链表应该是 1 -\> 4 -\> 3 -\> 2 -\> 5 -\> NULL。

1. 创建一个哑节点 dummy，它的 next 指向原始头节点 head。这有助于处理 left\=1 的情况。p 初始化为 dummy。p 的目标是移动到需要反转部分的前一个节点。**ListNode dummy**  **=**  **new ListNode(0,head);**

**ListNode p**  **=**  **dummy;**

```Java
dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> NULL
  ^
  |
  p
```

2. **for(int i**  **=**  **0; i**  **&lt;**  **left - 1; i++) { p**  **=**  **p.next; }**

**l**eft \= 2，所以 left - 1 \= 1。循环执行1次。

现在 p 指向节点 1，它是反转开始节点（节点 2）的前一个节点。

```Java
dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> NULL
         ^
         |
         p
```

3. **ListNode cur**  **=**  **p.next; ListNode pre**  **=**  **null;**

    1. cur 指向 p.next，即节点 2。这是反转操作的起始节点。
    2. p.next 这个节点在反转后会成为反转段的**尾部**。
    3. pre 用于在反转过程中保存前一个节点。

```Plain
dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> NULL
         ^    ^
         |    |
         p   cur 
```

4. **for(int i**  **=**  **0; i**  **&lt;**  **right - left + 1; i++) { ... }**

    1. right - left + 1 \= 4 - 2 + 1 \= 3。循环执行3次，反转节点 2, 3, 4。

```Plain
dummy -> 1           (链表前半部分)
         ^
         |
         p (反转部分的前一个节点)

         4 -> 3 -> 2 -> NULL  (反转后的子链表)
         ^         ^
         |         |
         pre       p.next (p.next一开始是反转后的头, 现在是反转后的尾)

                   5 -> NULL    (链表后半部分)
                   ^
                   |
                   cur 
```

5. **p.next.next**  **=**  **cur; p.next**  **=**  **pre;**

从图中不难看出，我们需要将**将反转后的子链表的尾部p.next (节点 2) 连接到原始链表的后半部分cur (节点 5)。**

**以及将原始链表的前半部分p (节点 1) 连接到反转后的子链表的头部pre (节点 4)。**

## 重排链表

团子最爱考的链表题，没有之一，主播刚写hot100的时候巨讨厌，后来发现纯模版题，备战至今仍被考过。

主要思路就是先找到中间节点，将中点之后的部分反转，再把两部分一点一点接上。

反转的思路参考反转链表即可。

找到中间节点的代码参考，中间节点的思路参考相交链表（主播还没写）

```Java
class Solution {
    public void reorderList(ListNode head) {
        ListNode mid = middleNode(head);
        ListNode head1 = reverseList(mid);
        while(head1.next!=null){
            ListNode nextHead = head.next;
            head.next = head1;
            head = nextHead;
            ListNode nextHead1 = head1.next;
            head1.next = head;
            head1 = nextHead1;
        }
    }
    public ListNode middleNode(ListNode head){
        ListNode fast = head;
        ListNode slow = head;
        while(fast!=null&&fast.next!=null){
            fast = fast.next.next;
            slow = slow.next;
        }
        return slow;
    }
    public ListNode reverseList(ListNode head){
        ListNode pre = null;
        ListNode cur = head;
        while(cur!=null){
            ListNode tmp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = tmp;
        }
        return pre;
    }
}
```

## [两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)

在正式写k个一组之前我们先来点开胃前菜（其实我感觉面试记不住也没事，反正k个一组把k设置成2）

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ODBhMGMzZWFhOTI2MWE5NmMxYWUzNTIxMDdhNzc1YmVfVUdRUnJZVUlFQ3J5TGZhdjcwQmpCTU1oNjMwbDJDQUtfVG9rZW46SjVWWmJ6bmcyb2JXVml4YVhjUWNsNWdEbm9lXzE3NTU3ODI1MTI6MTc1NTc4NjExMl9WNA)

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OGUyZmQ5ZDMzNTdmZjA0NDRjMWFlODU3ZjM3MzlhZTJfc0M3NzIyYWJLN1FVUDlZTUdzc2dMOEFtdm4xcWhsbXJfVG9rZW46QjQ3M2J6TzAyb25HZTR4RFlMb2M1YjZDbjdjXzE3NTU3ODI1MTI6MTc1NTc4NjExMl9WNA)

```Plain
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0,head);
        
    }
}
```

## k个一组反转链表

```Java
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0,head);
        ListNode pre = dummy;
        ListNode end = dummy;
        while(end.next!=null){
            for(int i =0;i<k&&end!=null;i++){
                end = end.next;
            }
            if(end==null) break;
            ListNode nextStart = end.next;
            ListNode start = pre.next;
            end.next = null;
            pre.next = reverseList(start);
            pre = nextStart;
            end = pre;
        }
        return dummy.next;
    }
    public ListNode reverseList(ListNode head){
        ListNode pre = null;
        ListNode cur = head;
        while(cur!=null){
            ListNode tmp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = tmp;
        }
        return pre;
    }
}
```
