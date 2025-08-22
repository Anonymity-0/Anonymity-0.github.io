// 悬浮目录功能
(function() {
    'use strict';
    
    let tocContainer = null;
    let tocList = null;
    let progressBar = null;
    let headings = [];
    let isVisible = false;
    
    // 初始化
    function init() {
        tocContainer = document.getElementById('floating-toc');
        tocList = document.getElementById('floating-toc-list');
        progressBar = document.getElementById('reading-progress');
        
        if (!tocContainer || !tocList || !progressBar) {
            return;
        }
        
        // 获取所有标题
        headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .filter(heading => heading.id && heading.offsetParent !== null);
        
        if (headings.length === 0) {
            return;
        }
        
        // 生成目录
        generateTOC();
        
        // 绑定事件
        bindEvents();
        
        // 初始更新
        updateProgress();
        updateActiveHeading();
    }
    
    // 生成目录
    function generateTOC() {
        const fragment = document.createDocumentFragment();
        
        headings.forEach((heading, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            a.className = `toc-link toc-level-${heading.tagName.toLowerCase()}`;
            a.dataset.index = index;
            
            // 点击事件
            a.addEventListener('click', function(e) {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth' });
            });
            
            li.appendChild(a);
            fragment.appendChild(li);
        });
        
        tocList.appendChild(fragment);
    }
    
    // 绑定事件
    function bindEvents() {
        // 滚动事件
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    updateProgress();
                    updateActiveHeading();
                    toggleVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // 切换显示/隐藏
        const toggleBtn = document.getElementById('floating-toc-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                tocContainer.classList.toggle('expanded');
            });
        }
    }
    
    // 更新阅读进度
    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        if (progressBar) {
            progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
        }
    }
    
    // 更新当前激活的标题
    function updateActiveHeading() {
        if (headings.length === 0) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offset = 100; // 偏移量
        
        let activeIndex = -1;
        
        // 找到当前可见的标题
        for (let i = headings.length - 1; i >= 0; i--) {
            const heading = headings[i];
            const rect = heading.getBoundingClientRect();
            const top = rect.top + scrollTop;
            
            if (scrollTop + offset >= top) {
                activeIndex = i;
                break;
            }
        }
        
        // 更新激活状态
        const links = tocList.querySelectorAll('.toc-link');
        links.forEach((link, index) => {
            link.classList.toggle('active', index === activeIndex);
        });
    }
    
    // 切换可见性
    function toggleVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldShow = scrollTop > 300; // 滚动超过300px时显示
        
        if (shouldShow !== isVisible) {
            isVisible = shouldShow;
            tocContainer.classList.toggle('visible', isVisible);
        }
    }
    
    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
