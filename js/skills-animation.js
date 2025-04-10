// Skills Section Animation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skill cards animation
    initSkillCards();
    
    // Initialize scroll animations
    initScrollAnimations();
});

// Initialize skill cards hover effects and progress bars
function initSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        // Set random initial delay for staggered appearance
        const delay = Math.random() * 0.5;
        card.style.transitionDelay = `${delay}s`;
        
        // Add hover listeners for 3D effect
        card.addEventListener('mousemove', handleCardHover);
        card.addEventListener('mouseleave', resetCardPosition);
    });
}

// 3D hover effect on skill cards
function handleCardHover(e) {
    const card = e.currentTarget;
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    
    // Calculate mouse position relative to card center
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;
    
    // Calculate rotation based on mouse position
    const rotateY = (mouseX / (cardRect.width / 2)) * 5; // max 5deg
    const rotateX = -((mouseY / (cardRect.height / 2)) * 5); // max 5deg
    
    // Apply the transformation
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
}

// Reset card position when mouse leaves
function resetCardPosition(e) {
    const card = e.currentTarget;
    card.style.transform = '';
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// Initialize scroll animations for fade-in-up effect
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');
    
    // Initial check on page load
    elements.forEach(el => {
        if (isInViewport(el)) {
            el.classList.add('visible');
        }
    });
    
    // Check on scroll
    window.addEventListener('scroll', () => {
        elements.forEach(el => {
            if (isInViewport(el) && !el.classList.contains('visible')) {
                el.classList.add('visible');
            }
        });
    });
}

// Initialize skill progress bars
function initSkillProgress() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const progressBar = card.querySelector('.skill-progress');
        if (progressBar) {
            // Get skill level from data attribute
            const skillLevel = card.getAttribute('data-skill-level') || '80';
            progressBar.style.setProperty('--skill-level', `${skillLevel}%`);
        }
    });
}

// Call this when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initSkillCards();
    initScrollAnimations();
    initSkillProgress();
}); 