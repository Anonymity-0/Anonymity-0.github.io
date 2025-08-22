// 导航栏打字机效果
(function() {
    'use strict';

    function navbarTypeWriter() {
        console.log('尝试启动导航栏打字机效果...');
        const element = document.getElementById('navbar-typewriter');
        if (!element) {
            console.log('导航栏打字机元素未找到，ID: navbar-typewriter');
            // 尝试查找其他可能的元素
            const allElements = document.querySelectorAll('[id*="typewriter"]');
            console.log('找到的包含typewriter的元素:', allElements);
            return;
        }
        console.log('导航栏打字机元素找到，开始运行:', element);

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
                // 删除字符
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 300); // 短暂停顿后开始打下一个文本
                    return;
                }

                setTimeout(type, deleteSpeed);
            } else {
                // 添加字符
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, pauseTime); // 完整显示后停顿
                    return;
                }

                setTimeout(type, typeSpeed);
            }
        }

        // 开始打字机效果
        setTimeout(type, 1000);
    }

    // DOM加载完成后启动，增加延迟确保元素已渲染
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(navbarTypeWriter, 500);
        });
    } else {
        setTimeout(navbarTypeWriter, 500);
    }
})();
