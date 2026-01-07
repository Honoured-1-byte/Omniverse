// Search Functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase();
    const animeCards = document.querySelectorAll('.anime-card');
    
    animeCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Review Submission
const reviewForm = document.querySelector('.anime-detail form');
reviewForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const reviewText = reviewForm.querySelector('textarea').value;
    const rating = reviewForm.querySelector('input[type="radio"]:checked')?.value || 'No rating';

    if (reviewText) {
        const reviewList = document.querySelector('.anime-detail .review-list');
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
        
        reviewDiv.innerHTML = `
            <p><strong>Username:</strong> (Your Name)</p>
            <p>Rating: ${rating}</p>
            <p>${reviewText}</p>
        `;
        
        reviewList.appendChild(reviewDiv);
        reviewForm.reset();
    } else {
        alert('Please write a review!');
    }
});

// Email Submission (For Contact Page)
const contactForm = document.querySelector('.contact form');
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const subject = contactForm.querySelector('input[type="text"]:nth-child(3)').value;
    const message = contactForm.querySelector('textarea').value;

    if (name && email && subject && message) {
        alert('Your message has been sent successfully!');
        contactForm.reset();
    } else {
        alert('Please fill in all the fields.');
    }
});
