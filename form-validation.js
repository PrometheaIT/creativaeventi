// assets/js/form-validation.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('career-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validazione campi
        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const messaggio = form.messaggio.value.trim();
        const cv = form.cv.files[0];

        // Reset errori
        resetErrors();

        // Validazioni
        let isValid = true;

        if (!nome) {
            showError(form.nome, 'Inserisci il tuo nome completo');
            isValid = false;
        }

        if (!email || !validateEmail(email)) {
            showError(form.email, 'Inserisci un indirizzo email valido');
            isValid = false;
        }

        if (!messaggio) {
            showError(form.messaggio, 'Inserisci un messaggio');
            isValid = false;
        }

        if (!cv) {
            showError(form.cv.parentNode, 'Carica il tuo CV');
            isValid = false;
        } else if (cv.type !== 'application/pdf') {
            showError(form.cv.parentNode, 'Il file deve essere un PDF');
            isValid = false;
        }

        if (isValid) {
            try {
                // Invio dati
                await sendApplication({
                    nome,
                    email,
                    messaggio,
                    cv_name: cv.name
                });

                showSuccess('Candidatura inviata con successo!');
                form.reset();
            } catch (error) {
                showError(form, 'Errore nell\'invio. Riprova più tardi.');
            }
        }
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ff4444';
        errorElement.style.marginTop = '5px';
        errorElement.style.fontSize = '0.9em';
        
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        field.classList.add('error');
    }

    function resetErrors() {
        document.querySelectorAll('.form-error').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    function showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'form-success';
        successElement.textContent = message;
        successElement.style.color = '#00C851';
        successElement.style.margin = '20px 0';
        successElement.style.textAlign = 'center';
        
        form.prepend(successElement);
        setTimeout(() => successElement.remove(), 5000);
    }

    async function sendApplication(data) {
        // Configura EmailJS (servizio esterno per invio email)
        // Registrati su https://www.emailjs.com e ottieni questi ID
        const serviceID = 'YOUR_SERVICE_ID';
        const templateID = 'YOUR_TEMPLATE_ID';
        const userID = 'YOUR_PUBLIC_KEY';

        // Crea un template in EmailJS con questi placeholder:
        // {{nome}}, {{email}}, {{messaggio}}, {{cv_name}}

        try {
            await emailjs.send(serviceID, templateID, {
                nome: data.nome,
                email: data.email,
                messaggio: data.messaggio,
                cv_name: data.cv_name
            }, userID);

            return true;
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
});