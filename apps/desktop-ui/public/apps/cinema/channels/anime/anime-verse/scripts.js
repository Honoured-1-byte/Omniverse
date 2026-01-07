// scripts.js - Main JavaScript File

// --- Hero Slider ---
const heroSlider = document.querySelector('.hero-slider');
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentSlide = 0;

function showSlide(index) {
    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    heroSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

let autoplayInterval = setInterval(nextSlide, 5000); // Auto-rotate every 5 seconds

prevButton.addEventListener('click', () => {
    clearInterval(autoplayInterval); // Stop autoplay on manual navigation
    prevSlide();
    autoplayInterval = setInterval(nextSlide, 5000); // Restart autoplay
});

nextButton.addEventListener('click', () => {
    clearInterval(autoplayInterval);
    nextSlide();
    autoplayInterval = setInterval(nextSlide, 5000);
});

showSlide(currentSlide); // Initialize slider

// --- Burger Menu ---
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

// --- Modal Functionality ---
const watchTrailerButton = document.querySelector('.watch-trailer-button'); // Make sure this element exists on the page where this script is used.
const modal = document.getElementById('trailerModal');
const closeModalButton = document.querySelector('.close-button');

if(watchTrailerButton && modal && closeModalButton){
  watchTrailerButton.addEventListener('click', () => {
      modal.style.display = 'block';
  });

  closeModalButton.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  });
}


// --- Newsletter Form Validation ---
const newsletterForm = document.querySelector('.newsletter');
if (newsletterForm) { // Check if the form exists
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const subscribeButton = newsletterForm.querySelector('button');

    subscribeButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission

        const email = emailInput.value.trim();
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.'); // Simple alert, can be replaced with inline error message
        } else {
            alert('Thank you for subscribing!'); // Successful subscription message
            // In a real scenario, you'd send the email to your backend.
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// --- Comment Form Validation ---
const commentForm = document.querySelector('.comment-form');
if (commentForm) { // Check if the form exists
    const nameInput = commentForm.querySelector('input[name="name"]');
    const emailInput = commentForm.querySelector('input[name="email"]');
    const commentTextarea = commentForm.querySelector('textarea[name="comment"]');
    const submitButton = commentForm.querySelector('button[type="submit"]');

    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission

        let isValid = true;

        // Reset Errors
        resetErrors();

        // Validate Name
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            isValid = false;
        }

        // Validate Email
        const email = emailInput.value.trim();
        if (email === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Comment
        if (commentTextarea.value.trim() === '') {
            showError(commentTextarea, 'Comment is required');
            isValid = false;
        }

        if (isValid) {
            // Simulate submitting the comment (replace with actual submission)
            alert('Comment submitted!');
            commentForm.reset(); // Clear the form
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(inputElement, message) {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error';
        errorSpan.textContent = message;
        inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling); // Insert error after input
    }

    function resetErrors() {
        const errorSpans = document.querySelectorAll('.error');
        errorSpans.forEach(span => span.remove());
    }
}

