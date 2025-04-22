// ===============================
// Unified Responsive Particle System (Optimized for Mobile)
// ===============================

async function ensureFontLoaded() {
  try {
    await document.fonts.load('bold 100px "Poiret One"');
    await document.fonts.ready;
  } catch (error) {
    console.error('Font loading error:', error);
  }
}

async function generateTextCoordinates(text, options = {}) {
  try {
    const offscreenCanvas = document.createElement('canvas');
    const ctx = offscreenCanvas.getContext('2d');

    const breakpoints = {
      sizes: {
        mobile: 45,   
        tablet: 80,    
        desktop: 120   
      },
      positions: {
        mobile: 0.29,   
        tablet: 0.25, 
        desktop: 0.27 
      }
    };

    const width = window.innerWidth;
    const fontSize = width >= 1024 ? breakpoints.sizes.desktop :
                     width >= 768 ? breakpoints.sizes.tablet : 
                     breakpoints.sizes.mobile;

    offscreenCanvas.width = options.width || window.innerWidth;
    offscreenCanvas.height = options.height || window.innerHeight;

    const verticalPosition = offscreenCanvas.height * 
      (width >= 1024 ? breakpoints.positions.desktop :
       width >= 768 ? breakpoints.positions.tablet : 
       breakpoints.positions.mobile);

    ctx.font = `bold ${fontSize}px 'Poiret One', cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';

    ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    ctx.fillText(text, offscreenCanvas.width / 2, verticalPosition);

    const { data } = ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    const coords = [];
    const threshold = options.threshold || (width < 768 ? 64 : 128); // Soglia dinamica
    const step = options.step || (width < 768 ? 3 : 4); // Densità aumentata per mobile

    for (let y = 0; y < offscreenCanvas.height; y += step) {
      for (let x = 0; x < offscreenCanvas.width; x += step) {
        if (data[(y * offscreenCanvas.width + x) * 4 + 3] > threshold) {
          coords.push({ 
            x, 
            y,
            originalY: y - verticalPosition
          });
        }
      }
    }
    return coords;
  } catch (error) {
    console.error('Error generating text coordinates:', error);
    return [];
  }
}

class UnifiedParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 1200;
    
    this.breakpoints = {
      yOffsets: {
        mobile: -90,  // Ridotto per mobile
        tablet: -200,  
        desktop: -250  
      }
    };

    this.formationProgress = 0;
    this.dispersionMultiplier = 2.5;
    this.logoImage = new Image();
    this.animationFrameId = null;
    this.isImageLoaded = false;
    this.currentSettings = this.getCurrentSettings();

    this.logoImage.crossOrigin = "Anonymous";
    this.logoImage.src = 'logodef.png';
    this.logoImage.onload = () => {
      this.isImageLoaded = true;
      console.log('Image loaded successfully');
    };
    this.logoImage.onerror = () => {
      console.error('Failed to load image');
    };

    this.init();
  }

  getCurrentSettings() {
    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      yOffset: width >= 1024 ? this.breakpoints.yOffsets.desktop :
               width >= 768 ? this.breakpoints.yOffsets.tablet :
               this.breakpoints.yOffsets.mobile
    };
  }

  async init() {
    try {
      this.resizeCanvas();
      await ensureFontLoaded();
      
      this.targetCoords = await generateTextCoordinates('CREATIVA EVENTI', {
        threshold: this.currentSettings.isMobile ? 64 : 128,
        width: this.canvas.width,
        height: this.canvas.height,
        step: this.currentSettings.isMobile ? 3 : 4
      });

      this.initParticles();
      this.initEventListeners();
      this.animate();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  initParticles() {
    this.particles = Array.from({ length: this.maxParticles }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: this.currentSettings.isMobile 
        ? Math.random() * 0.15 + 0.15 
        : Math.random() * 0.25 + 0.25,
      speedX: (Math.random() - 0.5) * (this.currentSettings.isMobile ? 0.2 : 0.3),
      speedY: (Math.random() - 0.5) * (this.currentSettings.isMobile ? 0.2 : 0.3),
      target: this.targetCoords[Math.floor(Math.random() * this.targetCoords.length)],
      opacity: 0.9,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    }));
  }

  initEventListeners() {
    this.resizeHandler = () => this.handleResize();
    this.mouseHandler = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.onMouseMove(e.clientX - rect.left, e.clientY - rect.top);
    };
    this.scrollHandler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.formationProgress = Math.min(scrollTop / docHeight, 1);
    };

    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('mousemove', this.mouseHandler);
    window.addEventListener('scroll', this.scrollHandler);
  }

  onMouseMove(mx, my) {
    this.particles.forEach(p => {
      const dx = mx - p.x;
      const dy = my - p.y;
      const distance = dx * dx + dy * dy;
      if (distance < 22500) {
        p.x -= dx * (this.currentSettings.isMobile ? 0.03 : 0.02);
        p.y -= dy * (this.currentSettings.isMobile ? 0.03 : 0.02);
      }
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = document.body.scrollHeight;
  }

  async handleResize() {
    this.currentSettings = this.getCurrentSettings();
    this.dispersionMultiplier = this.currentSettings.isMobile ? 1.8 : 2.5;
    this.resizeCanvas();
    this.targetCoords = await generateTextCoordinates('CREATIVA EVENTI', {
      threshold: this.currentSettings.isMobile ? 64 : 128,
      width: this.canvas.width,
      height: this.canvas.height,
      step: this.currentSettings.isMobile ? 3 : 4
    });
    this.particles.forEach(p => {
      p.target = this.targetCoords[Math.floor(Math.random() * this.targetCoords.length)];
    });
  }

  animate() {
    if (!this.canvas || !this.ctx || !this.isImageLoaded) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.formationProgress > 0.5) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.7 * this.formationProgress * (this.currentSettings.isMobile ? 1.2 : 1);
      
      const width = window.innerWidth;
      const fontSize = width >= 1024 ? 100 :
                      width >= 768 ? 70 : 
                      50; 

      this.ctx.font = `bold ${fontSize}px "Poiret One", cursive`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.strokeStyle = 'rgba(29,29,27,0.3)';
      this.ctx.lineWidth = 4;
      
      const txtY = window.innerHeight / 2 + this.currentSettings.yOffset;
      this.ctx.strokeText('CREATIVA EVENTI', window.innerWidth/2, txtY);
      this.ctx.restore();
    }

    this.particles.forEach(p => {
      if (this.formationProgress > 0 && p.target) {
        const ty = p.target.y + this.currentSettings.yOffset;
        const interp = this.currentSettings.isMobile ? 0.08 : 0.04; // Più veloce
        p.x += (p.target.x - p.x) * interp;
        p.y += (ty - p.y) * interp;
      } else {
        p.x += p.speedX * (1 + (1 - this.formationProgress) * this.dispersionMultiplier);
        p.y += p.speedY * (1 + (1 - this.formationProgress) * this.dispersionMultiplier);
      }

      if (p.x < 0) p.speedX = Math.abs(p.speedX);
      if (p.x > this.canvas.width) p.speedX = -Math.abs(p.speedX);
      if (p.y < 0) p.speedY = Math.abs(p.speedY);
      if (p.y > this.canvas.height) p.speedY = -Math.abs(p.speedY);

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      
      const sizeMultiplier = this.currentSettings.isMobile ? 15 : 25;
      const imgSize = p.size * sizeMultiplier;
      const halfSize = imgSize / 2;
      
      this.ctx.drawImage(
        this.logoImage,
        -halfSize,
        -halfSize,
        imgSize,
        imgSize
      );
      
      this.ctx.restore();

      p.rotation += p.rotationSpeed;
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('mousemove', this.mouseHandler);
    window.removeEventListener('scroll', this.scrollHandler);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('partyCanvas');
  if (!canvas) return;
  
  canvas.style.zIndex = '10';
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.style.position = 'relative';
  
  window.particleSystem = new UnifiedParticleSystem(canvas);
});
