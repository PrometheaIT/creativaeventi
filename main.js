// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

// Apertura menu
mobileMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

// Chiusura menu cliccando fuori
document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// Chiusura menu cliccando i link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});