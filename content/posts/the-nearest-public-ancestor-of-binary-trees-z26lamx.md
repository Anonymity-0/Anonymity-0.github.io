---
title: 二叉树的最近公共祖先
slug: the-nearest-public-ancestor-of-binary-trees-z26lamx
url: /post/the-nearest-public-ancestor-of-binary-trees-z26lamx.html
date: '2025-05-14 23:22:23+08:00'
lastmod: '2025-05-25 14:32:17+08:00'
toc: true
isCJKLanguage: true
---



# 二叉树的最近公共祖先

‍

## 🧠 问题描述：

给定一棵二叉树的根节点 `root`​ 和两个节点 `p`​ 和 `q`​，请找出它们的 **最近公共祖先节点**。

公共祖先定义为：在树中，某个节点是 `p`​ 和 `q`​ 的祖先（包括自己），并且离它们尽可能近。

‍

‍

---

## ✅ 示例代码 + 中文注释

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // 递归终止条件：
        // 如果当前节点为空，或者等于 p 或 q，则直接返回该节点
        if (root == null || root == p || root == q) {
            return root;
        }

        // 后序遍历：先递归查找左子树和右子树中是否包含 p 或 q
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        // 分析左右子树的查找结果
        if (left == null && right == null) {
            // 左右子树都没有找到 p 或 q，说明当前子树中不包含目标节点
            return null;
        } else if (left == null) {
            // 左子树没找到，右子树找到了，说明 p 和 q 都在右子树中
            return right;
        } else if (right == null) {
            // 右子树没找到，左子树找到了，说明 p 和 q 都在左子树中
            return left;
        } else {
            // 左右子树各找到一个，说明当前节点就是它们的最近公共祖先
            return root;
        }
    }
}
```

---

## 📌 举个例子帮助理解：

假设有一棵树如下：

```
        A
       / \
      B   C
     / \
    D   E
```

- 如果 p = D，q = E → 最近公共祖先是 B。
- 如果 p = D，q = C → 最近公共祖先是 A。
- 如果 p = B，q = A → 最近公共祖先是 A。

---

## 🧮 算法分析

- **时间复杂度**：`O(n)`​  
  每个节点最多访问一次，n 是节点总数。
- **空间复杂度**：`O(h)`​  
  h 是树的高度，主要取决于递归栈深度。

---

## 💡 总结递归逻辑：

|情况|返回值|
| ------------------------| -----------------------------|
|当前节点是 null 或 p/q|返回当前节点|
|左右都为空|当前节点不是祖先，返回 null|
|左空右非空|返回右边的结果|
|右空左非空|返回左边的结果|
|左右都有值|当前节点就是 LCA|

---
