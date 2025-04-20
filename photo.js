  // ===============================
  // Photo Sections (Fixed Observer)
  // ===============================
  (function initPhotoAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.style.opacity = entry.isIntersecting ? '1' : '0';
        entry.target.style.transform = entry.isIntersecting ? 'translateX(0)' :
          (entry.target.classList.contains('left') ? 'translateX(-50px)' : 'translateX(50px)');
      });
    }, { threshold: 0.25 });
  
    document.querySelectorAll('.reveal-photo').forEach(el => observer.observe(el));
  })();