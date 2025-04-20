
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('events-carousel');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');

    // Sample data - Replace with actual API data
    const events = Array.from({length: 10}, (_, i) => ({
        id: i+1,
        title: `Evento ${i+1}`,
        date: new Date().toLocaleDateString(),
        image: `https://picsum.photos/190/254?random=${i}`,
        description: `Descrizione evento ${i+1} con qualche dettaglio interessante.`
    }));

    // Populate carousel
    function populateCarousel() {
        carousel.innerHTML = events.map(event => `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${event.image}" alt="${event.title}">
                    </div>
                    <div class="flip-card-back">
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-date">${event.date}</p>
                        <p class="event-description">${event.description}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Carousel navigation
    function scrollCarousel(direction) {
        const cardWidth = carousel.firstElementChild?.offsetWidth || 190;
        const gap = parseInt(getComputedStyle(carousel).gap) || 24;
        const scrollAmount = (cardWidth + gap) * 3; // Scroll 3 cards at a time
        
        carousel.scrollBy({
            left: direction === 'prev' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }

    // Event listeners
    prevButton.addEventListener('click', () => scrollCarousel('prev'));
    nextButton.addEventListener('click', () => scrollCarousel('next'));

    // Initialize
    populateCarousel();

    // TODO: Add API fetch function for real data
    /*
    async function fetchEvents() {
        try {
            const response = await fetch('YOUR_API_ENDPOINT');
            const data = await response.json();
            // Process data and update events array
            populateCarousel();
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }
    fetchEvents();
    */
});


