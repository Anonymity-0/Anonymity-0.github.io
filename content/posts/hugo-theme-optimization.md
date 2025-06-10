---
title: "Hugo主题优化实践"
description: "分享Hugo主题的优化经验"
date: 2024-01-20T14:30:00+08:00
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
    - 优化
---

## 主题优化概述

Hugo是一个优秀的静态网站生成器，通过合理的优化可以获得更好的用户体验。

## CSS优化

```css
/* 代码块样式优化 */
.highlight {
    border-radius: 12px;
    padding: 16px 20px;
    margin: 24px auto;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

/* 行号样式 */
.chroma .ln {
    color: #7f7f7f;
    margin-right: 0.8em;
    user-select: none;
}
```

## JavaScript增强

```javascript
// 回到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 显示/隐藏回到顶部按钮
window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});
```

## 总结

通过这些优化措施，网站的用户体验得到了显著提升。
