// Configuration
const functionAPI = ''; // Your Azure Function API endpoint

// DOM Elements
let counterElement = null;
let scrollDownButton = null;
let backToTopButton = null;

// Initialize when DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    getVisitCount();
});

// Initialize DOM elements
function initializeElements() {
    counterElement = document.getElementById('counter');
    scrollDownButton = document.querySelector('.scroll-down');
    backToTopButton = document.querySelector('.back-to-top');
}

// Setup event listeners
function setupEventListeners() {
    // Smooth scroll functionality for both buttons
    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', (e) => handleSmoothScroll(e, '#about-me'));
    }
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => handleSmoothScroll(e, '#top'));
        // Initially hide the back to top button
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }

    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (backToTopButton) {
            if (window.scrollY > 500) {
                backToTopButton.style.opacity = '1';
                backToTopButton.style.visibility = 'visible';
            } else {
                backToTopButton.style.opacity = '0';
                backToTopButton.style.visibility = 'hidden';
            }
        }
    });
}

// Handle smooth scrolling
function handleSmoothScroll(e, targetId) {
    e.preventDefault();
    const targetElement = targetId === '#top' ? document.body : document.querySelector(targetId);
    if (targetElement) {
        window.scrollTo({
            top: targetId === '#top' ? 0 : targetElement.offsetTop,
            behavior: 'smooth'
        });
    }
}

// Visit counter functionality
async function getVisitCount() {
    if (!counterElement) return;

    try {
        if (!functionAPI) {
            console.warn('Function API endpoint not set. Using default count.');
            counterElement.textContent = '30';
            return;
        }

        const response = await fetch(functionAPI);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        animateCounter(data.count);

    } catch (error) {
        console.error('Error fetching visit count:', error);
        counterElement.textContent = '--';
    }
}

function animateCounter(finalCount) {
    if (!counterElement) return;

    const duration = 1000;
    const start = parseInt(counterElement.textContent) || 0;
    const increment = finalCount - start;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = progress * (2 - progress);
        const currentCount = Math.floor(start + (increment * easeOutQuad));

        counterElement.textContent = currentCount;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counterElement.textContent = finalCount;
        }
    }

    requestAnimationFrame(updateCounter);
}

/* JavaScript for handling animations */
// Add this to your existing JavaScript
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}

// Initialize intersection observer
const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.1,
    rootMargin: '50px'
});

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing DOMContentLoaded code ...

    // Add animation observers
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});
