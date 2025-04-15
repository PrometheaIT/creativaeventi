// Main Application Script
document.addEventListener('DOMContentLoaded', () => {
  initComponents();
  initMobileMenu();
  initFormValidation();
  initSmoothScroll();
});

// Component Initialization
function initComponents() {
  // Initialize all components
  const components = [
      { selector: '.animated-form', handler: handleFormAnimations },
      { selector: '.parallax-section', handler: initParallax }
  ];

  components.forEach(component => {
      document.querySelectorAll(component.selector).forEach(element => {
          component.handler(element);
      });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const menuToggle = document.createElement('div');
  menuToggle.className = 'mobile-menu-toggle';
  menuToggle.innerHTML = '☰';
  document.querySelector('.main-header').appendChild(menuToggle);

  menuToggle.addEventListener('click', () => {
      document.querySelector('.main-nav ul').classList.toggle('active');
      menuToggle.classList.toggle('open');
  });
}

// Form Validation
function initFormValidation() {
  document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          if(form.id === 'career-form') {
              const fileInput = form.querySelector('input[type="file"]');
              if(fileInput.files[0].size > 5 * 1024 * 1024) {
                  alert('Il file deve essere minore di 5MB');
                  return;
              }
              
              if(fileInput.files[0].type !== 'application/pdf') {
                  alert('Si prega di caricare un file PDF');
                  return;
              }
          }

          // Simulate form submission
          const formData = new FormData(form);
          try {
              // Replace with actual fetch call
              await new Promise(resolve => setTimeout(resolve, 1000));
              form.reset();
              showSubmissionFeedback('success');
          } catch (error) {
              showSubmissionFeedback('error');
          }
      });
  });
}

function showSubmissionFeedback(type) {
  const feedback = document.createElement('div');
  feedback.className = `form-feedback ${type}`;
  feedback.textContent = type === 'success' 
      ? 'Invio completato con successo!' 
      : 'Errore durante l\'invio. Riprovare.';
  
  document.body.appendChild(feedback);
  setTimeout(() => feedback.remove(), 3000);
}

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if(target) {
              target.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
          }
      });
  });
}

// Animation Initializer
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if(entry.isIntersecting) {
              entry.target.classList.add('visible');
          }
      });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(element => {
      observer.observe(element);
  });
}

// Aggiungi questa funzione
function handleHeaderSpacing() {
  const header = document.querySelector('.main-header');
  const headerHeight = header.offsetHeight;
  document.body.style.paddingTop = `${headerHeight}px`;
  document.querySelectorAll('.parallax-section').forEach(section => {
      section.style.marginTop = `-${headerHeight}px`;
      section.style.height = `calc(100vh - ${headerHeight}px)`; // Aggiungi questa linea
  });
}


// Aggiungi questi event listener
document.addEventListener('DOMContentLoaded', handleHeaderSpacing);
window.addEventListener('resize', handleHeaderSpacing);

// Ottimizza le animazioni
let lastTime = 0;
const fps = 30;

function animateParticles(time) {
    const deltaTime = time - lastTime;
    if(deltaTime > 1000/fps) {
        // Aggiorna logica animazione
        lastTime = time;
    }
    requestAnimationFrame(animateParticles);
}
animateParticles(0);


// RESIZE
function handleResize() {
  const canvas = document.getElementById('partyCanvas');
  if(canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  }
}

window.addEventListener('resize', handleResize);