// 导航栏增强脚本 - 为Hextra主题添加打字机效果和鸭子动画
(function() {
    'use strict';

    function enhanceNavbar() {
        console.log('开始增强导航栏...');
        console.log('当前页面:', window.location.href);

        // 查找Hextra的导航栏
        const navbar = document.querySelector('nav') || document.querySelector('.navbar') || document.querySelector('[role="navigation"]');
        if (!navbar) {
            console.log('未找到导航栏，尝试等待...');
            // 如果没找到，等待一下再试
            setTimeout(enhanceNavbar, 500);
            return;
        }

        console.log('找到导航栏:', navbar);

        // 查找logo区域或标题区域 - 增加更多调试信息
        console.log('开始查找logo区域...');
        const logoArea1 = navbar.querySelector('a[href="/"]');
        const logoArea2 = navbar.querySelector('a[href="' + window.location.origin + '/"]');
        const logoArea3 = navbar.querySelector('a[href*="localhost"]');
        const logoArea4 = navbar.querySelector('.hx\\:text-2xl');
        const logoArea5 = navbar.querySelector('.text-2xl');
        const logoArea6 = navbar.querySelector('a:first-child');

        console.log('查找结果:');
        console.log('- a[href="/"]:', logoArea1);
        console.log('- a[href="' + window.location.origin + '/"]:', logoArea2);
        console.log('- a[href*="localhost"]:', logoArea3);
        console.log('- .hx:text-2xl:', logoArea4);
        console.log('- .text-2xl:', logoArea5);
        console.log('- a:first-child:', logoArea6);

        const logoArea = logoArea1 || logoArea2 || logoArea3 || logoArea4 || logoArea5 || logoArea6;

        if (!logoArea) {
            console.log('未找到logo区域，查找所有链接:', navbar.querySelectorAll('a'));
            console.log('所有a元素:', Array.from(navbar.querySelectorAll('a')).map(a => ({
                href: a.href,
                textContent: a.textContent,
                className: a.className
            })));
            return;
        }

        console.log('找到logo区域:', logoArea);

        // 添加鸭子logo和动画
        enhanceLogo(logoArea);

        // 添加打字机效果
        addTypewriterEffect(navbar);
    }
    
    function enhanceLogo(logoArea) {
        // 查找现有的鸭子logo
        const existingDuck = document.querySelector('img[src*="duck-logo"]') || logoArea.querySelector('img');

        if (existingDuck) {
            console.log('找到现有鸭子logo，添加动画');
            // 给现有的鸭子添加动画
            existingDuck.className += ' navbar-duck-logo-animated';
            existingDuck.style.cssText += `
                animation: navbar-bounce 3s ease-in-out infinite !important;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
                transition: transform 0.3s ease !important;
            `;

            // 添加悬停效果
            existingDuck.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) !important';
                this.style.animationPlayState = 'paused';
            });

            existingDuck.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) !important';
                this.style.animationPlayState = 'running';
            });

            // 添加动画CSS
            addAnimationCSS();

            console.log('鸭子动画已添加');
            return;
        }

        // 如果没有找到现有的鸭子，创建一个新的
        const duckLogo = document.createElement('img');
        duckLogo.src = '/images/duck-logo.svg';
        duckLogo.alt = 'GAGA Duck';
        duckLogo.className = 'navbar-duck-logo-animated';
        duckLogo.style.cssText = `
            width: 32px;
            height: 32px;
            margin-right: 8px;
            animation: navbar-bounce 3s ease-in-out infinite;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            transition: transform 0.3s ease;
        `;

        // 添加悬停效果
        duckLogo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.animationPlayState = 'paused';
        });

        duckLogo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.animationPlayState = 'running';
        });

        // 插入到logo区域的开头
        logoArea.insertBefore(duckLogo, logoArea.firstChild);

        // 添加动画CSS
        addAnimationCSS();

        console.log('新鸭子logo已添加');
    }
    
    function addTypewriterEffect(navbar) {
        // 检查是否已经有打字机效果
        if (navbar.querySelector('#navbar-typewriter')) {
            console.log('打字机效果已存在');
            return;
        }

        // 查找GAGA标题旁边的位置
        const gagaTitle = navbar.querySelector('.hx\\:text-2xl') ||
                         navbar.querySelector('.text-2xl') ||
                         navbar.querySelector('[class*="text-2xl"]') ||
                         Array.from(navbar.querySelectorAll('span')).find(span => span.textContent.includes('GAGA')) ||
                         Array.from(navbar.querySelectorAll('*')).find(el => el.textContent.includes('GAGA'));

        if (!gagaTitle) {
            console.log('未找到GAGA标题，查找所有可能的元素:');
            console.log('所有span:', navbar.querySelectorAll('span'));
            console.log('所有包含文字的元素:', Array.from(navbar.querySelectorAll('*')).filter(el => el.textContent.trim()));
            return;
        }

        console.log('找到GAGA标题:', gagaTitle);

        // 创建打字机容器（简洁版，无背景框）
        const typewriterContainer = document.createElement('div');
        typewriterContainer.className = 'navbar-typewriter-container';
        typewriterContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-left: 12px;
            gap: 4px;
        `;

        // 创建文字元素（无背景框）
        const textElement = document.createElement('span');
        textElement.id = 'navbar-typewriter';
        textElement.className = 'navbar-typewriter-text';
        textElement.style.cssText = `
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 400;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            white-space: nowrap;
        `;
        textElement.textContent = 'Hello World!';

        // 创建光标
        const cursor = document.createElement('span');
        cursor.className = 'navbar-cursor';
        cursor.style.cssText = `
            font-size: 0.875rem;
            color: #3b82f6;
            font-weight: bold;
            animation: navbar-blink 1.2s infinite;
        `;
        cursor.textContent = '|';

        // 组装元素
        typewriterContainer.appendChild(textElement);
        typewriterContainer.appendChild(cursor);

        // 插入到GAGA标题旁边
        const gagaParent = gagaTitle.parentElement;
        if (gagaParent) {
            gagaParent.appendChild(typewriterContainer);
        } else {
            // 如果找不到父元素，直接插入到GAGA元素后面
            gagaTitle.insertAdjacentElement('afterend', typewriterContainer);
        }

        console.log('打字机效果已添加到GAGA旁边');

        // 启动打字机效果
        setTimeout(() => {
            startTypewriter();
        }, 1000);
    }
    
    function addAnimationCSS() {
        // 检查是否已经添加了CSS
        if (document.querySelector('#navbar-enhancement-css')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'navbar-enhancement-css';
        style.textContent = `
            @keyframes navbar-bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-4px);
                }
                60% {
                    transform: translateY(-2px);
                }
            }
            
            @keyframes navbar-blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            @media (max-width: 1024px) {
                .navbar-typewriter-container {
                    display: none !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    function startTypewriter() {
        const element = document.getElementById('navbar-typewriter');
        if (!element) {
            console.log('打字机元素未找到');
            return;
        }
        
        console.log('启动打字机效果');
        
        const texts = [
            'Hello World!',
            '你好世界！',
            'Bonjour le monde!',
            'Hola Mundo!',
            '안녕하세요!',
            'こんにちは世界！',
            'Coding is fun! 🦆',
            'GAGA 技术博客'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;
        let deleteSpeed = 40;
        let pauseTime = 2000;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 300);
                    return;
                }

                setTimeout(type, deleteSpeed);
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, pauseTime);
                    return;
                }

                setTimeout(type, typeSpeed);
            }
        }

        setTimeout(type, 500);
    }

    // 启动增强功能
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(enhanceNavbar, 500);
        });
    } else {
        setTimeout(enhanceNavbar, 500);
    }
})();
