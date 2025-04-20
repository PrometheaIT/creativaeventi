
// CONTATORE:
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.counter-number');
  const options = { threshold: 0.4 };

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const counter = entry.target;
              const target = +counter.dataset.target;
              const numberSpan = counter.querySelector('.number');
              const duration = 2500;
              let start = 0;

              const updateCounter = () => {
                  const progress = Math.min(start / target, 1);
                  const current = Math.floor(target * progress);
                  numberSpan.textContent = current;
                  
                  if (progress < 1) {
                      requestAnimationFrame(updateCounter);
                      start += (target / duration) * 16.67;
                  } else {
                      numberSpan.textContent = target;
                  }
              };

              requestAnimationFrame(updateCounter);
              observer.unobserve(counter);
          }
      });
  }, options);

  counters.forEach(counter => observer.observe(counter));
});