// 强制将所有代码块背景改为白色 - 超强力版本
(function() {
    'use strict';
    
    function forceWhiteBackground() {
        // 查找所有代码块相关元素，包括所有可能的选择器
        const selectors = [
            '.highlight', 
            '.chroma', 
            'pre.chroma', 
            '.highlight pre',
            'div.highlight',
            'pre[class*="chroma"]',
            'pre[style*="background"]'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 强制移除所有背景相关的内联样式
                element.style.removeProperty('background-color');
                element.style.removeProperty('background');
                
                // 强制设置白色背景和深色文字
                element.style.setProperty('background-color', '#ffffff', 'important');
                element.style.setProperty('background', '#ffffff', 'important');
                element.style.setProperty('color', '#24292f', 'important');
                
                // 直接修改style属性
                const styleAttr = element.getAttribute('style') || '';
                let newStyle = styleAttr
                    .replace(/background[^;]*;?/gi, '')
                    .replace(/color[^;]*;?/gi, '');
                newStyle += '; background: #ffffff !important; color: #24292f !important;';
                element.setAttribute('style', newStyle);
            });
        });
        
        // 查找所有span元素在代码块内的
        const spanElements = document.querySelectorAll('.chroma span, .highlight span');
        spanElements.forEach(span => {
            // 移除背景色
            span.style.removeProperty('background-color');
            span.style.removeProperty('background');
            span.style.setProperty('background-color', 'transparent', 'important');
            span.style.setProperty('background', 'transparent', 'important');
            
            // 修改style属性
            const styleAttr = span.getAttribute('style') || '';
            let newStyle = styleAttr.replace(/background[^;]*;?/gi, '');
            newStyle += '; background: transparent !important;';
            span.setAttribute('style', newStyle);
        });
        
        // 处理行号
        const lineNumbers = document.querySelectorAll('.chroma .ln, .highlight .ln');
        lineNumbers.forEach(ln => {
            ln.style.removeProperty('background-color');
            ln.style.removeProperty('background');
            ln.style.setProperty('background-color', 'transparent', 'important');
            ln.style.setProperty('background', 'transparent', 'important');
            ln.style.setProperty('color', '#7f7f7f', 'important');
        });
        
        console.log('强制应用白色背景完成');
    }
    
    // 立即执行一次
    forceWhiteBackground();
    
    // DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceWhiteBackground);
    } else {
        forceWhiteBackground();
    }
    
    // 监听动态内容变化
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldUpdate = true;
            }
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                shouldUpdate = true;
            }
        });
        
        if (shouldUpdate) {
            setTimeout(forceWhiteBackground, 10);
        }
    });
    
    // 开始监听
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    
    // 更频繁地检查并强制应用样式
    setInterval(forceWhiteBackground, 500);
    
    // 页面完全加载后再执行一次
    window.addEventListener('load', function() {
        setTimeout(forceWhiteBackground, 100);
    });
    
})();
