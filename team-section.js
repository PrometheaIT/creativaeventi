// Team Section Background Hover Effect
document.addEventListener('DOMContentLoaded', function() {
    const teamSection = document.querySelector('.team-section');
    const teamMembers = document.querySelectorAll('.team-member');
    
    // Configurazione background
    const bgConfig = {
        original: 'linear-gradient(rgba(0, 160, 155, 0.8), rgba(0, 0, 0, 0.6)), url("team-bg2.jpg") center/cover fixed',
        hover: 'linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.2)), url("team-bg2.jpg") center/cover fixed'
    };

    // Funzione per cambiare background
    function changeBackground(bgType) {
        teamSection.style.background = bgConfig[bgType];
    }

    // Aggiungi event listeners
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => changeBackground('hover'));
        member.addEventListener('mouseleave', () => changeBackground('original'));
    });
});
