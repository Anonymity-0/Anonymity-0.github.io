/*!
 * Back to Top Button
 */

export default function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top') as HTMLButtonElement;
    if (!backToTopButton) return;

    // Show/hide button based on scroll position
    const toggleBackToTop = () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    };

    // Smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Event listeners
    window.addEventListener('scroll', toggleBackToTop);
    backToTopButton.addEventListener('click', scrollToTop);

    // Initial check
    toggleBackToTop();
}
