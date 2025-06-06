/**
 * Project Page JavaScript
 * Handles basic interactions for project detail pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize image zoom functionality if needed
    setupImageZoom();
    
    // Setup project card hover effects
    setupProjectCards();
});

/**
 * Setup image zoom functionality for project images
 */
function setupImageZoom() {
    const showcaseImage = document.querySelector('.showcase-image img');
    
    if (showcaseImage) {
        showcaseImage.addEventListener('click', function() {
            // Create modal for zoomed image
            const modal = document.createElement('div');
            modal.className = 'image-zoom-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            modal.style.zIndex = '9999';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            
            // Create close button
            const closeButton = document.createElement('span');
            closeButton.className = 'close-modal';
            closeButton.innerHTML = '&times;';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '20px';
            closeButton.style.right = '30px';
            closeButton.style.color = 'white';
            closeButton.style.fontSize = '40px';
            closeButton.style.fontWeight = 'bold';
            closeButton.style.cursor = 'pointer';
            
            // Create zoomed image
            const zoomedImage = document.createElement('img');
            zoomedImage.src = this.src;
            zoomedImage.style.maxWidth = '90%';
            zoomedImage.style.maxHeight = '90%';
            zoomedImage.style.objectFit = 'contain';
            
            // Add elements to modal
            modal.appendChild(closeButton);
            modal.appendChild(zoomedImage);
            document.body.appendChild(modal);
            
            // Prevent scrolling on body
            document.body.style.overflow = 'hidden';
            
            // Close modal on click
            modal.addEventListener('click', function() {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * Setup hover effects for project cards
 */
function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
} 