(() => {
  // <stdin>
  document.addEventListener("DOMContentLoaded", function() {
    const menuLinks = document.querySelectorAll(".menu-link");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement("span");
        ripple.className = "menu-ripple";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        this.appendChild(ripple);
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
      link.addEventListener("touchstart", function() {
        this.classList.add("menu-touched");
      });
      link.addEventListener("touchend", function() {
        setTimeout(() => {
          this.classList.remove("menu-touched");
        }, 150);
      });
    });
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll(".menu li");
    menuItems.forEach((item) => {
      const link = item.querySelector("a");
      if (link) {
        const href = link.getAttribute("href");
        item.classList.remove("current");
        if (href === "/" && currentPath === "/") {
          item.classList.add("current");
        } else if (href !== "/" && currentPath.startsWith(href)) {
          item.classList.add("current");
        }
      }
    });
  });
})();
