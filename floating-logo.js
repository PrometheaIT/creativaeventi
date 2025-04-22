
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.floating-logo');
  const heroSection = document.querySelector('.hero');
  
  if (!logo || !heroSection) return;

  let posX = 50; // Percentuale iniziale
  let posY = 50; // Percentuale iniziale
  let speedX = 0.7; // Velocità ridotta
  let speedY = 0.7;
  let angle = 0;
  const rotationSpeed = 0.5; // Rotazione più lenta
  
  function getHeroBounds() {
    const rect = heroSection.getBoundingClientRect();
    return {
      minX: rect.left,
      maxX: rect.right,
      minY: rect.top,
      maxY: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }

  function animateLogo() {
    const bounds = getHeroBounds();
    const logoRect = logo.getBoundingClientRect();
    
    // Controllo bordi orizzontali
    if (posX <= 0 || posX >= 100) {
      speedX *= -1;
      posX = posX <= 0 ? 0 : 100;
    }
    
    // Controllo bordi verticali
    if (posY <= 0 || posY >= 100) {
      speedY *= -1;
      posY = posY <= 0 ? 0 : 100;
    }
    
    // Aggiorna posizione
    posX += speedX;
    posY += speedY;
    
    // Aggiorna rotazione
    angle += rotationSpeed;
    
    // Applica trasformazioni
    logo.style.left = `${posX}%`;
    logo.style.top = `${posY}%`;
    logo.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    
    requestAnimationFrame(animateLogo);
  }

  // Avvia animazione
  animateLogo();

  // Reset posizione al resize
  window.addEventListener('resize', () => {
    posX = 50;
    posY = 50;
  });
});