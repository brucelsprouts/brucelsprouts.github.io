/**
 * Project Page JavaScript
 * Handles animations, scrolling effects, and responsive elements for project detail pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page elements
    initProjectPage();

    // Animate elements on scroll
    window.addEventListener('scroll', handleScrollAnimations);
});

/**
 * Initialize project page elements and animations
 */
function initProjectPage() {
    // Add animation classes to elements when page loads
    animateElementsOnLoad();
    
    // Setup image zoom functionality
    setupImageZoom();
    
    // Setup related projects hover effects
    setupRelatedProjects();
}

/**
 * Apply load animations to page elements
 */
function animateElementsOnLoad() {
    // Project title animation
    const projectTitle = document.querySelector('.project-title');
    if (projectTitle) {
        projectTitle.classList.add('animate-in');
    }
    
    // Project content sections
    const contentSections = document.querySelectorAll('.row');
    contentSections.forEach((section, index) => {
        // Add a delay based on the index to create a cascade effect
        setTimeout(() => {
            section.classList.add('fade-in');
        }, 200 + (index * 100));
    });
    
    // Project image
    const projectImage = document.querySelector('.project-image');
    if (projectImage) {
        projectImage.classList.add('scale-in');
    }
}

/**
 * Handle scroll-based animations
 */
function handleScrollAnimations() {
    // Get all elements that should animate on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
    
    animateElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('animated');
        }
    });
    
    // Update active section in navigation (if implemented)
    updateActiveSection();
}

/**
 * Check if an element is in the viewport
 * @param {Element} element - The DOM element to check
 * @returns {boolean} - True if element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

/**
 * Setup image zoom functionality for project images
 */
function setupImageZoom() {
    const projectImage = document.querySelector('.project-image');
    
    if (projectImage) {
        projectImage.addEventListener('click', function() {
            // Create modal for zoomed image
            const modal = document.createElement('div');
            modal.className = 'image-zoom-modal';
            
            // Create close button
            const closeButton = document.createElement('span');
            closeButton.className = 'close-modal';
            closeButton.innerHTML = '&times;';
            
            // Create zoomed image
            const zoomedImage = document.createElement('img');
            zoomedImage.src = this.src;
            zoomedImage.className = 'zoomed-image';
            
            // Add elements to modal
            modal.appendChild(closeButton);
            modal.appendChild(zoomedImage);
            document.body.appendChild(modal);
            
            // Prevent scrolling on body
            document.body.style.overflow = 'hidden';
            
            // Add animation class
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Close modal on click
            modal.addEventListener('click', function() {
                modal.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                }, 300);
            });
        });
    }
}

/**
 * Setup hover effects for related projects
 */
function setupRelatedProjects() {
    const relatedItems = document.querySelectorAll('.related-item');
    
    relatedItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}

/**
 * Update active section in navigation based on scroll position
 */
function updateActiveSection() {
    // Implementation for section highlighting if needed
    const sections = document.querySelectorAll('.row');
    let currentSection = null;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
        }
    });
    
    if (currentSection) {
        // Highlight the current section if needed
        currentSection.classList.add('active-section');
    }
} 