---
title: 栈和队列
slug: stack-and-queue-fiafj
url: /post/stack-and-queue-fiafj.html
date: '2025-07-21 21:15:24+08:00'
lastmod: '2025-07-21 21:15:40+08:00'
tags:
  - 栈
categories:
  - leetcode
keywords: 栈
toc: true
isCJKLanguage: true
---



# 栈和队列

# [用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)

请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（`push`、`pop`、`peek`、`empty`）：

实现 `MyQueue` 类：

- ​`void push(int x)` 将元素 x 推到队列的末尾
- ​`int pop()` 从队列的开头移除并返回元素
- ​`int peek()` 返回队列开头的元素
- ​`boolean empty()` 如果队列为空，返回 `true` ；否则，返回 `false`​

**说明：**

- 你 **只能** 使用标准的栈操作 —— 也就是只有 `push to top`, `peek/pop from top`, `size`, 和 `is empty` 操作是合法的。
- 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。

栈和队列的特性就不用多说了，一个是“先进后出”（LIFO），一个是“先进先出”（FIFO）。

用栈实现队列这道题在 LeetCode 上是简单题，但我有一段时间就是想不通，觉得很难，真是有点无语。

思路大概是这样的：我们使用两个栈，比如 `Stack<Integer> A` 和 `Stack<Integer> B`。

- push 操作：始终将元素压入栈 `A` 中。
- pop 或 peek 时：如果栈 `B` 是空的，我们需要把栈 `A` 中的所有元素依次弹出并压入栈 `B`，这样顺序就被反转回来了。此时再从 `B` 中 pop 或 peek 就可以得到正确的队列顺序。

具体来说，我们可以这样处理：

- 初始化两个栈 `A` 和 `B`；
- ​`push(int x)`：直接 `A.push(x)`；
- ​`peek()`：

  - 如果 `B` 不为空，说明前面还有元素，返回 `B.peek()`；
  - 如果 `B` 为空而 `A` 也为空，则队列为空，返回 `-1`；
  - 否则将 `A` 中所有元素 `pop()` 并 `push()` 到 `B`，然后返回 `B.peek()`；
- ​`pop()`：类似 `peek()`，只是最后要调用一次 `B.pop()`；
- ​`empty()`：判断 `A.isEmpty() && B.isEmpty()` 即可。

# [有效的括号](https://leetcode.cn/problems/valid-parentheses/)

给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。

有效字符串需满足：

1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。

**示例 1：**

**输入：** s \= "()"

**输出：** true

**示例 2：**

**输入：** s \= "()[]{}"

**输出：** true

这一题其实是栈非常经典的一道题，之前忘记是暑期哪家的笔试有类似的变种，其实就是分成三种情况

思路可以参考这个图：

https://file1.kamacoder.com/i/algo/20.%E6%9C%89%E6%95%88%E6%8B%AC%E5%8F%B7.gif

其实核心思想就是：遇到左括号入栈，遇到右括号就去匹配栈顶元素，如果能匹配上继续，否则直接返回 `false`。

我们可以分成三种情况来判断是否合法：

1. 遍历结束后栈不为空 → 有未匹配的左括号 → `return false`例如：`"((())"`，最后栈里还剩两个左括号
2. 当前字符是右括号，但栈为空 → 没有对应的左括号 → `return false`例如：`")("`，第一个字符是右括号，栈是空的
3. 当前右括号与栈顶元素不匹配 → 不合法 → `return false`例如：`"([)]"`，`)` 和栈顶的 `[` 不匹配

只有当整个字符串遍历完后，栈也正好为空，才说明所有括号都正确匹配了 → `return true`​

### 小技巧：

在遇到左括号时，我们不是把左括号压入栈，而是把对应的右括号压入栈。这样在后续匹配时，只需要比较当前字符是否等于栈顶即可，不需要反复判断对应关系。

比如：

- 遇到 `'('` → 压入 `')'`​
- 遇到 `'['` → 压入 `']'`​
- 遇到 `'{'` → 压入 `'}'`​

# [ 删除字符串中的所有相邻重复项](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/)

这题也比较简单，遍历一遍字符串

https://file1.kamacoder.com/i/algo/1047.%E5%88%A0%E9%99%A4%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%AD%E7%9A%84%E6%89%80%E6%9C%89%E7%9B%B8%E9%82%BB%E9%87%8D%E5%A4%8D%E9%A1%B9.gif

# [ 逆波兰表达式求值](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)

在进一步看，本题中每一个子表达式要得出一个结果，然后拿这个结果再进行运算，那么这岂不就是一个相邻字符串消除的过程，和[1047.删除字符串中的所有相邻重复项 (opens new window)](https://programmercarl.com/1047.%E5%88%A0%E9%99%A4%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%AD%E7%9A%84%E6%89%80%E6%9C%89%E7%9B%B8%E9%82%BB%E9%87%8D%E5%A4%8D%E9%A1%B9.html)中的对对碰游戏是不是就非常像了。

如动画所示：

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MWNmMjQ5OWNhOGY5ODMyMmVkNjllNGI1NTlmZWQ5NTZfYTBjTmJRS3hUdm8wcGtXajE2S2ZBY3JHSGdRbVB2Y2hfVG9rZW46TW9PNWJCRkZsb09MNXZ4bHJjRGN5TUhCbkdlXzE3NTU3ODIxMTE6MTc1NTc4NTcxMV9WNA)

# [滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)

https://leetcode.cn/problems/sliding-window-maximum/solutions/667836/dong-hua-yan-shi-dan-diao-dui-lie-239hua-hc5u
