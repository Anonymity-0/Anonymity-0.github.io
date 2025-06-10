// 代码块增强器 - 直接通过JavaScript设置统一背景
(function() {
    'use strict';
    
    function enhanceCodeBlocks() {
        // 查找所有代码块
        const codeBlocks = document.querySelectorAll('.chroma');
        
        codeBlocks.forEach(function(block) {
            // 清除之前的类名
            block.classList.remove('long-code-block');
            
            // 检查是否有行号表格（表示多行代码）
            const lineTable = block.querySelector('.lntable');
            if (lineTable) {
                // 计算代码行数
                const lineNumbers = block.querySelectorAll('.ln, .lnt');
                const lineCount = lineNumbers.length;
                
                // 如果超过6行，直接设置深色背景样式
                if (lineCount >= 6) {
                    // 添加类名
                    block.classList.add('long-code-block');
                    
                    // 直接设置样式，强制统一背景
                    const isDark = document.documentElement.getAttribute('data-scheme') === 'dark';
                    const bgColor = isDark ? '#161b22' : '#2c3548';
                    const textColor = isDark ? '#e6edf3' : '#e8eaf0';
                    
                    block.style.setProperty('background', bgColor, 'important');
                    block.style.setProperty('color', textColor, 'important');
                    
                    // 强制所有子元素背景透明
                    const allChildren = block.querySelectorAll('*');
                    allChildren.forEach(child => {
                        child.style.setProperty('background', 'transparent', 'important');
                        child.style.setProperty('background-color', 'transparent', 'important');
                    });
                    
                    // 特别处理行号
                    const lineNums = block.querySelectorAll('.ln, .lnt');
                    lineNums.forEach(ln => {
                        ln.style.setProperty('background', 'transparent', 'important');
                        ln.style.setProperty('background-color', 'transparent', 'important');
                        ln.style.setProperty('color', isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.7)', 'important');
                    });
                    
                    console.log(`长代码块：${lineCount} 行，已直接设置统一背景`);
                } else {
                    console.log(`短代码块：${lineCount} 行，保持浅色背景`);
                }
            } else {
                // 没有行号的代码块，检查内容行数
                const codeLines = block.querySelectorAll('.line');
                if (codeLines.length >= 6) {
                    block.classList.add('long-code-block');
                    
                    // 同样直接设置样式
                    const isDark = document.documentElement.getAttribute('data-scheme') === 'dark';
                    const bgColor = isDark ? '#161b22' : '#2c3548';
                    const textColor = isDark ? '#e6edf3' : '#e8eaf0';
                    
                    block.style.setProperty('background', bgColor, 'important');
                    block.style.setProperty('color', textColor, 'important');
                    
                    const allChildren = block.querySelectorAll('*');
                    allChildren.forEach(child => {
                        child.style.setProperty('background', 'transparent', 'important');
                        child.style.setProperty('background-color', 'transparent', 'important');
                    });
                    
                    console.log(`长代码块：${codeLines.length} 行（无行号），已直接设置统一背景`);
                }
            }
        });
    }
    
    // DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceCodeBlocks);
    } else {
        enhanceCodeBlocks();
    }
    
    // 监听主题切换，重新应用样式
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-scheme') {
                setTimeout(enhanceCodeBlocks, 100);
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-scheme']
    });
    
})();
