// 菜单点击效果增强
document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        // 添加点击波纹效果
        link.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 创建波纹元素
            const ripple = document.createElement('span');
            ripple.className = 'menu-ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            // 移除波纹元素
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // 添加触摸反馈
        link.addEventListener('touchstart', function() {
            this.classList.add('menu-touched');
        });
        
        link.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('menu-touched');
            }, 150);
        });
    });
    
    // 高亮当前页面对应的菜单项
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu li');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            
            // 移除所有current类
            item.classList.remove('current');
            
            // 根据当前路径设置active状态
            if (href === '/' && currentPath === '/') {
                item.classList.add('current');
            } else if (href !== '/' && currentPath.startsWith(href)) {
                item.classList.add('current');
            }
        }
    });
});
