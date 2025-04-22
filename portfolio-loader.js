// assets/js/portfolio-loader.js

// 1) Definizione delle funzioni (come ce le avevi)
async function loadPartners() {
    try {
        const [response] = await Promise.all([
            fetch('assets/data/partners.json'),
            new Promise(resolve => setTimeout(resolve, 300)) // Delay minimo per fluidità
        ]);
        
        const data = await response.json();
        
        // Caricamento parallelo
        await Promise.all([
            loadFeaturedPartners(data.featured),
            loadAllPartners(data.allPartners)
        ]);
        
    } catch (error) {
        console.error('Error loading partners:', error);
    }
}

function loadFeaturedPartners(partners) {
    const grid = document.getElementById('portfolio-grid');
    grid.innerHTML = partners.map(partner => `
        <div class="partner-card">
            <img src="${partner.logo}" 
                 alt="${partner.name}" 
                 loading="lazy"
                 decoding="async"
                 style="aspect-ratio: ${Math.random() * 0.5 + 1.5}">
        </div>
    `).join('');
}

function loadAllPartners(partners) {
    const list = document.querySelector('.partner-list');
    list.innerHTML = partners.map(partner => `
        <div class="partner-list-item">
            <div class="partner-list-logo">
                <img src="${partner.logo}" 
                     alt="${partner.name}"
                     loading="lazy"
                     decoding="async">
            </div>
            <div class="partner-list-content">
                <h3>${partner.name}</h3>
                <p>${partner.description}</p>
            </div>
        </div>
    `).join('');
}

// 2) **Ecco la chiamata che mancava**: al DOMContentLoaded eseguo loadPartners
document.addEventListener('DOMContentLoaded', () => {
    loadPartners().then(() => {
        console.log('Partners caricati con successo');
    });
});
