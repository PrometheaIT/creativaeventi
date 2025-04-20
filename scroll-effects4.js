// ===============================
// Scroll Effects & Particle Formation (Optimized) - IMAGE VERSION
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

        offscreenCanvas.width = options.width || window.innerWidth;
        offscreenCanvas.height = options.height || window.innerHeight;

        const fontSize = options.fontSize || 100;
        ctx.font = `bold ${fontSize}px 'Poiret One', cursive`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        ctx.fillText(text, offscreenCanvas.width / 2, offscreenCanvas.height / 4);

        const { data } = ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        const coords = [];
        const threshold = options.threshold || 128;
        const step = options.step || 4;

        for (let y = 0; y < offscreenCanvas.height; y += step) {
            for (let x = 0; x < offscreenCanvas.width; x += step) {
                if (data[(y * offscreenCanvas.width + x) * 4 + 3] > threshold) {
                    coords.push({ x, y });
                }
            }
        }
        return coords;
    } catch (error) {
        console.error('Error generating text coordinates:', error);
        return [];
    }
}

class PartyParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 1200; // Ridotto per performance
        this.formationProgress = 0;
        this.textOffsetY = -170;
        this.dispersionMultiplier = 2.5;
        this.logoImage = new Image();
        this.animationFrameId = null;
        this.isImageLoaded = false;

        // Configurazione immagine
        this.logoImage.crossOrigin = "Anonymous";
        this.logoImage.src = 'assets/img/logodef.png';
        this.logoImage.onload = () => {
            this.isImageLoaded = true;
            console.log('Image loaded successfully');
        };
        this.logoImage.onerror = () => {
            console.error('Failed to load image');
        };

        this.init();
    }

    async init() {
        try {
            this.resizeCanvas();
            await ensureFontLoaded();
            
            this.targetCoords = await generateTextCoordinates('CREATIVA EVENTI', {
                fontSize: 100,
                threshold: 128,
                width: this.canvas.width,
                height: this.canvas.height,
                step: 4
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
            size: Math.random() * 0.25 + 0.25, // Dimensione aumentata
            speedX: (Math.random() - 0.5) * 0.3, // Velocità ridotta
            speedY: (Math.random() - 0.5) * 0.3,
            target: this.targetCoords[Math.floor(Math.random() * this.targetCoords.length)],
            opacity: 0.9,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        }));
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.onMouseMove(e.clientX - rect.left, e.clientY - rect.top);
        });
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.formationProgress = Math.min(scrollTop / docHeight, 1);
        });
    }

    onMouseMove(mx, my) {
        this.particles.forEach(p => {
            const dx = mx - p.x;
            const dy = my - p.y;
            const distance = dx * dx + dy * dy;
            if (distance < 22500) { // 150px radius
                p.x -= dx * 0.02;
                p.y -= dy * 0.02;
            }
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.body.scrollHeight;
    }

    animate() {
        if (!this.canvas || !this.ctx || !this.isImageLoaded) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Disegna testo se necessario
        if (this.formationProgress > 0.9) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.7 * this.formationProgress;
            this.ctx.font = 'bold 100px "Poiret One", cursive';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.strokeStyle = 'rgba(29,29,27,0.3)';
            this.ctx.lineWidth = 4;
            const txtY = window.innerHeight / 2 + this.textOffsetY;
            this.ctx.strokeText('CREATIVA EVENTI', window.innerWidth/2, txtY);
            this.ctx.restore();
        }

        this.particles.forEach(p => {
            // Aggiorna posizione
            if (this.formationProgress > 0 && p.target) {
                const ty = p.target.y + this.textOffsetY;
                const interp = 0.04;
                p.x += (p.target.x - p.x) * interp;
                p.y += (ty - p.y) * interp;
            } else {
                p.x += p.speedX * (1 + (1 - this.formationProgress) * this.dispersionMultiplier);
                p.y += p.speedY * (1 + (1 - this.formationProgress) * this.dispersionMultiplier);
            }

            // Gestione bordi
            if (p.x < 0) p.speedX = Math.abs(p.speedX);
            if (p.x > this.canvas.width) p.speedX = -Math.abs(p.speedX);
            if (p.y < 0) p.speedY = Math.abs(p.speedY);
            if (p.y > this.canvas.height) p.speedY = -Math.abs(p.speedY);

            // Disegna particella
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            
            const imgSize = p.size * 25; // Moltiplicatore aumentato
            const halfSize = imgSize / 2;
            
            this.ctx.drawImage(
                this.logoImage,
                -halfSize,
                -halfSize,
                imgSize,
                imgSize
            );
            
            this.ctx.restore();

            // Aggiorna rotazione
            p.rotation += p.rotationSpeed;
        });

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        window.removeEventListener('resize', this.resizeCanvas);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('scroll', this.handleScroll);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('partyCanvas');
    if (canvas) {
        canvas.style.zIndex = '10';
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.position = 'relative';
        }
        window.particleSystem = new PartyParticleSystem(canvas);
    }
});