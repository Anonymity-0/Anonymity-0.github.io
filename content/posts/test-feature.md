---
title: "功能测试文章"
description: "测试代码块行号和相关文章功能"
date: 2024-01-15T10:00:00+08:00
image: 
math: 
license: 
hidden: false
comments: true
draft: false
categories:
    - 技术分享
tags:
    - Hugo
    - 前端
    - 测试
---

## 代码块测试

这里是一个Python代码块，测试行号显示：

```python
def fibonacci(n):
    """计算斐波那契数列的第n项"""
    if n <= 1:
        return n
    else:
        # 递归计算
        return fibonacci(n-1) + fibonacci(n-2)

# 测试函数
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

这里是一个JavaScript代码块：

```javascript
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];
    
    for (let element of arr) {
        if (element < pivot) {
            left.push(element);
        } else if (element > pivot) {
            right.push(element);
        } else {
            equal.push(element);
        }
    }
    
    return [...quickSort(left), ...equal, ...quickSort(right)];
}

// 测试
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("排序前:", numbers);
console.log("排序后:", quickSort(numbers));
```

## 行内代码测试

这是一些行内代码：`console.log("Hello World")`，还有 `npm install` 命令。

## 总结

这篇文章用于测试代码块行号显示和相关文章功能。
