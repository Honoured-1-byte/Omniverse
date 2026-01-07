const contactForm = document.querySelector('.contact form');
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const subject = contactForm.querySelector('input[type="text"]:nth-child(3)').value;
    const message = contactForm.querySelector('textarea').value;

    const formData = { name, email, subject, message };

    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        contactForm.reset();
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
});
