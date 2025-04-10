// Gallery Animation Scripts
document.addEventListener('DOMContentLoaded', function() {
    initGalleryAnimations();
    initGalleryFilters();
    initGalleryLazyLoad();
});

// Initialize gallery item animations
function initGalleryAnimations() {
    const galleries = document.querySelectorAll('.gallery');
    
    galleries.forEach((gallery, index) => {
        // Add fade-in-up animation class
        gallery.classList.add('fade-in-up');
        
        // Set increasing delay for staggered appearance
        const delay = 0.1 + (index * 0.05);
        gallery.style.transitionDelay = `${delay}s`;
        
        // Add hover effect listeners if not on mobile
        if (window.innerWidth > 768) {
            gallery.addEventListener('mousemove', handleGalleryHover);
            gallery.addEventListener('mouseleave', resetGalleryPosition);
        }
        
        // Check if in viewport
        if (isInViewport(gallery)) {
            setTimeout(() => {
                gallery.classList.add('visible');
            }, 100);
        }
    });
    
    // Listen for scroll to reveal items
    window.addEventListener('scroll', revealGalleryItems);
}

// Handle gallery hover effect for 3D tilt
function handleGalleryHover(e) {
    const gallery = e.currentTarget;
    const rect = gallery.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = (mouseX / (rect.width / 2)) * 8; // max 8deg
    const rotateX = -((mouseY / (rect.height / 2)) * 8); // max 8deg
    
    gallery.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    
    // Add subtle shadow and brightness changes
    gallery.style.boxShadow = `0 15px 30px rgba(0, 0, 0, 0.3), 
                               ${-rotateY * 0.5}px ${-rotateX * 0.5}px 15px rgba(0, 0, 0, 0.15)`;
    
    // Enhance image within gallery
    const image = gallery.querySelector('img');
    if (image) {
        image.style.transform = `scale(1.05) translateX(${rotateY * 0.3}px) translateY(${rotateX * 0.3}px)`;
    }
}

// Reset gallery position on mouse leave
function resetGalleryPosition(e) {
    const gallery = e.currentTarget;
    gallery.style.transform = '';
    gallery.style.boxShadow = '';
    
    const image = gallery.querySelector('img');
    if (image) {
        image.style.transform = '';
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
        rect.bottom >= 0
    );
}

// Reveal gallery items on scroll
function revealGalleryItems() {
    const galleries = document.querySelectorAll('.gallery.fade-in-up:not(.visible)');
    
    galleries.forEach(gallery => {
        if (isInViewport(gallery)) {
            gallery.classList.add('visible');
        }
    });
}

// Initialize gallery filtering functionality
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter gallery items
            const galleries = document.querySelectorAll('.gallery');
            galleries.forEach(gallery => {
                if (filterValue === 'all') {
                    gallery.style.display = '';
                    setTimeout(() => {
                        gallery.classList.add('visible');
                    }, 100);
                } else {
                    const category = gallery.getAttribute('data-category');
                    if (category && category.includes(filterValue)) {
                        gallery.style.display = '';
                        setTimeout(() => {
                            gallery.classList.add('visible');
                        }, 100);
                    } else {
                        gallery.classList.remove('visible');
                        setTimeout(() => {
                            gallery.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// Initialize lazy loading for gallery images
function initGalleryLazyLoad() {
    const lazyImages = document.querySelectorAll('.gallery img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

// Window resize handler
window.addEventListener('resize', function() {
    const galleries = document.querySelectorAll('.gallery');
    
    if (window.innerWidth <= 768) {
        // Remove hover effects on mobile
        galleries.forEach(gallery => {
            gallery.removeEventListener('mousemove', handleGalleryHover);
            gallery.removeEventListener('mouseleave', resetGalleryPosition);
            gallery.style.transform = '';
            gallery.style.boxShadow = '';
            
            const image = gallery.querySelector('img');
            if (image) {
                image.style.transform = '';
            }
        });
    } else {
        // Add hover effects on desktop
        galleries.forEach(gallery => {
            gallery.addEventListener('mousemove', handleGalleryHover);
            gallery.addEventListener('mouseleave', resetGalleryPosition);
        });
    }
}); 