(function() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  let fireworks = [];
  let particles = [];
  let lastLaunch = 0;
  let animationFrame;

  // Configurazione aggiornata
  const config = {
    firework: {
      spawnInterval: 2000,     // Un fuoco ogni 2 secondi
      minSpeed: 1,
      maxSpeed: 4,
      trailLength: 5
    },
    particle: {
      count: 80,
      minSpeed: 1,
      maxSpeed: 4,
      fade: 0.008,
      gravity: 0.03
    }
  };

  function resize() {
    const navbarHeight = document.querySelector('.main-header').offsetHeight;
    const footerHeight = document.querySelector('.footer').offsetHeight;
    const container = document.querySelector('.fireworks-container');
    
    // Imposta dinamicamente i margini
    container.style.top = `${navbarHeight}px`;
    container.style.bottom = `${footerHeight}px`;
    
    // Aggiorna le dimensioni del canvas
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

  class Firework {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = Math.random() * (canvas.height * 0.3) + canvas.height * 0.2;
      this.speed = Math.random() * (config.firework.maxSpeed - config.firework.minSpeed) + config.firework.minSpeed;
      this.hue = Math.random() * 360;
      this.trail = [];
      this.exploded = false;
    }

    update() {
      this.y -= this.speed;
      
      // Aggiungi punto alla scia
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      if(this.trail.length > config.firework.trailLength) this.trail.shift();
      
      return this.y > this.targetY;
    }

    explode() {
      if(this.exploded) return;
      this.exploded = true;
      
      for(let i = 0; i < config.particle.count; i++) {
        const angle = (i / config.particle.count) * Math.PI * 2;
        const speed = Math.random() * config.particle.maxSpeed + config.particle.minSpeed;
        particles.push(new Particle(
          this.x,
          this.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          this.hue + Math.random() * 160 - 130 // Variazione colore ±30 gradi
        ));
      }
    }
  }

  class Particle {
    constructor(x, y, vx, vy, hue) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.alpha = 1;
      this.hue = hue;
      this.size = Math.random() * 3 + 1;
    }

    update() {
      this.vy += config.particle.gravity;
      this.vx *= 0.96;
      this.vy *= 0.92;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= config.particle.fade;
      return this.alpha > 0;
    }

    draw() {
      ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate(timestamp) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Sfondo bianco con effeto dissolvenza
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generazione fuochi temporizzata
    if(timestamp - lastLaunch > config.firework.spawnInterval) {
      fireworks.push(new Firework());
      lastLaunch = timestamp;
    }

    // Aggiorna fuochi
    fireworks = fireworks.filter(firework => {
      const alive = firework.update();
      
      // Disegna scia colorata
      firework.trail.forEach((pos, index) => {
        const alpha = (index / firework.trail.length) * 0.7;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${firework.hue}, 70%, 60%, ${alpha})`;
        ctx.fill();
      });

      if(!alive && !firework.exploded) firework.explode();
      return alive;
    });

    // Aggiorna particelle
    particles = particles.filter(particle => {
      const alive = particle.update();
      if(alive) particle.draw();
      return alive;
    });

    animationFrame = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    window.addEventListener('resize', resize);
    canvas.style.backgroundColor = '#ffffff'; // Sfondo bianco fisso
    animate(0);
  }

  init();
})();