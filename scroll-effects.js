// ===============================
// Scroll Effects e Particle Formation
// ===============================

/**
 * Inizializza l'Intersection Observer per gli elementi che devono essere "revelati" allo scroll.
 */
function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.reveal-on-scroll').forEach(element => {
      observer.observe(element);
    });
  }
  
  /**
   * Cambia il colore di sfondo dell'header in base allo scroll.
   */
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 100) {
      header.style.backgroundColor = 'rgba(91, 165, 158, 0.3)';
    } else {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
  });
  
  /**
   * Funzione che genera un array di coordinate leggendo i pixel “attivi” (alpha > soglia)
   * di un testo disegnato su un canvas off-screen.
   *
   * @param {string} text - Il testo da disegnare.
   * @param {object} options - Opzioni per il font, dimensioni, soglia e step di campionamento.
   * @returns {Array} Array di oggetti {x, y} contenente le coordinate dei pixel.
   */
  function generateTextCoordinates(text, options = {}) {
    const offscreenCanvas = document.createElement('canvas');
    const ctx = offscreenCanvas.getContext('2d');
  
    // Imposta le dimensioni del canvas off-screen.
    offscreenCanvas.width = options.width || window.innerWidth;
    offscreenCanvas.height = options.height || window.innerHeight;
  
    const fontSize = options.fontSize || 100;
    // Usa il grassetto per rendere il testo più definito
    ctx.font = `bold ${fontSize}px Poiret One`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  
    // Disegna il testo in bianco sul canvas off-screen
    ctx.fillStyle = 'white';
    ctx.fillText(text, offscreenCanvas.width / 2, offscreenCanvas.height / 2);
  
    // Estrae i dati dei pixel
    const imageData = ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    const data = imageData.data;
    const coordinates = [];
  
    // Aumenta la precisione campionando pixel più ravvicinati (step minore)
    const threshold = options.threshold || 128;
    const step = options.step || 2; // Ridotto da 4 a 2 per maggior dettaglio
  
    for (let y = 0; y < offscreenCanvas.height; y += step) {
      for (let x = 0; x < offscreenCanvas.width; x += step) {
        const index = (y * offscreenCanvas.width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > threshold) {
          coordinates.push({ x, y });
        }
      }
    }
    return coordinates;
  }
  
  
  /**
   * Classe per la gestione del sistema di particelle.
   * Integra la logica del movimento casuale e della formazione della scritta.
   */
  class PartyParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.maxParticles = 500;
      this.colors = ['#00A09B', '#FF4081', '#FFD700', '#7C4DFF'];
      
      // Variabile per il progresso della formazione:
      // 0 = movimento casuale, 1 = convergenza totale verso il target.
      this.formationProgress = 0;
      
      // Genera le coordinate target per il testo "CREATIVA EVENTI"
      this.targetCoordinates = generateTextCoordinates("CREATIVA EVENTI", {
        fontSize: 100,
        threshold: 128,
        width: this.canvas.width,
        height: this.canvas.height,
        step: 4
      });
  
      this.init();
    }
  
    init() {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  
      for (let i = 0; i < this.maxParticles; i++) {
        this.particles.push(this.createParticle());
      }
  
      this.animate();
    }
  
    /**
     * Crea una particella e le assegna un target casuale preso dall'array di coordinate.
     */
    createParticle() {
      const targetIndex = Math.floor(Math.random() * this.targetCoordinates.length);
      const target = this.targetCoordinates[targetIndex];
  
      return {
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 3,
        speedY: (Math.random() - 0.5) * 3,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        angle: 0,
        target: target
      };
    }
  
    /**
     * Gestisce l'effetto repulsione delle particelle al passaggio del mouse.
     */
    handleMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
  
      this.particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          particle.x -= dx * 0.02;
          particle.y -= dy * 0.02;
        }
      });
    }
  
    /**
     * Ridimensiona il canvas e rigenera le coordinate target. Aggiorna anche il target
     * per ogni particella per mantenere una distribuzione uniforme.
     */
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.targetCoordinates = generateTextCoordinates("CREATIVA EVENTI", {
        fontSize: 100,
        threshold: 128,
        width: this.canvas.width,
        height: this.canvas.height,
        step: 4
      });
      // Aggiorna il target di ogni particella (opzionale)
      this.particles.forEach(p => {
        const targetIndex = Math.floor(Math.random() * this.targetCoordinates.length);
        p.target = this.targetCoordinates[targetIndex];
      });
    }
  
    /**
     * Animazione principale: se la formazione è attiva, ogni particella si muove
     * interpolando dalla sua posizione corrente verso il target.
     */
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
        this.particles.forEach(particle => {
          if (this.formationProgress > 0 && particle.target) {
            particle.x += (particle.target.x - particle.x) * 0.05 * this.formationProgress;
            particle.y += (particle.target.y - particle.y) * 0.05 * this.formationProgress;
          } else {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
          }
      
          particle.angle += 0.02;
      
          if (particle.x > this.canvas.width || particle.x < 0) particle.speedX *= -1;
          if (particle.y > this.canvas.height || particle.y < 0) particle.speedY *= -1;
      
          this.ctx.save();
          this.ctx.translate(particle.x, particle.y);
          this.ctx.rotate(particle.angle);
          
          // Disegno della particella (stile normale)
          this.ctx.fillStyle = particle.color;
          this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
          
          this.ctx.restore();
        });
      
        // Se la formazione è quasi completa, disegna il testo in overlay
        if (this.formationProgress > 0.9) {
          this.ctx.save();
          // Imposta un'alpha ridotta (opzionale) per miscelare meglio il testo con le particelle
          this.ctx.globalAlpha = 0.8;
          // Definisci font, allineamento e stile per il testo
          const fontSize = 120; // Regola la dimensione in base alle tue necessità
          this.ctx.font = `bold ${fontSize}px Poiret One`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          // Disegna un contorno (stroke) bianco, con una linea spessa che enfatizza il testo
          this.ctx.strokeStyle = '#FFFFFF';
          this.ctx.lineWidth = 4; // Regola lo spessore dell'outline
          this.ctx.strokeText("CREATIVA EVENTI", this.canvas.width / 2, this.canvas.height / 2);
          this.ctx.restore();
        }
      
        requestAnimationFrame(() => this.animate());
      }
  }
  
  /**
   * Inizializza il sistema di particelle e le animazioni scroll-based.
   */
  document.addEventListener('DOMContentLoaded', () => {
    // Inizializza gli effetti di scroll per gli elementi reveal
    initScrollAnimations();
  
    const canvas = document.getElementById('partyCanvas');
    if (canvas) {
      window.particleSystem = new PartyParticleSystem(canvas);
    }
  });
  
  /**
   * Aggiorna il progresso di formazione in base allo scroll.
   * Si definisce l'inizio e la fine della transizione in percentuale.
   */
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = scrollTop / docHeight;
  
    // Imposta che la formazione inizia al 30% e si completa al 60% dello scroll
    const startFormation = 0.3;
    const endFormation = 0.6;
    let formationProgress = 0;
    if (scrollProgress > startFormation) {
      formationProgress = Math.min((scrollProgress - startFormation) / (endFormation - startFormation), 1);
    }
  
    if (window.particleSystem) {
      window.particleSystem.formationProgress = formationProgress;
    }
  });