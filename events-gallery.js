// Aggiungi allo script esistente
document.addEventListener('DOMContentLoaded', function() {
    const events = {
        corporate: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        matrimoni: ['img4.jpg', 'img5.jpg'],
        concert: ['img6.jpg', 'img7.jpg'],
        privati: ['img8.jpg', 'img9.jpg'],
        culturali: ['img10.jpg', 'img11.jpg']
    };

    let currentEvent = 'corporate';
    let currentIndex = 0;
    const mainImage = document.querySelector('.active-image');
    const eventItems = document.querySelectorAll('.event-item');

    // Gestione click eventi
    eventItems.forEach(item => {
        item.addEventListener('click', function() {
            eventItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentEvent = this.dataset.event;
            currentIndex = 0;
            updateImage();
        });
    });

    // Navigazione immagini
    document.querySelector('.prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + events[currentEvent].length) % events[currentEvent].length;
        updateImage();
    });

    document.querySelector('.next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % events[currentEvent].length;
        updateImage();
    });

    function updateImage() {
        mainImage.style.opacity = 0;
        setTimeout(() => {
            mainImage.src = `assets/img/events/${currentEvent}/${events[currentEvent][currentIndex]}`;
            mainImage.style.opacity = 1;
        }, 300);
    }
});