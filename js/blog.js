// Blog Search and Filtering Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('blog-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const tagFilters = document.querySelectorAll('.tag-filter');
    const blogCards = document.querySelectorAll('.blog-card');
    const noResults = document.getElementById('no-results');
    const blogContainer = document.getElementById('blog-container');
    
    let currentSearchTerm = '';
    let currentActiveTag = 'all';
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        currentSearchTerm = this.value.toLowerCase().trim();
        updateClearButton();
        filterBlogPosts();
    });
    
    // Clear search
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        currentSearchTerm = '';
        updateClearButton();
        filterBlogPosts();
        searchInput.focus();
    });
    
    // Tag filtering
    tagFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            tagFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            this.classList.add('active');
            currentActiveTag = this.getAttribute('data-tag');
            filterBlogPosts();
        });
    });
    
    // Update clear button visibility
    function updateClearButton() {
        if (currentSearchTerm.length > 0) {
            clearSearchBtn.classList.add('visible');
        } else {
            clearSearchBtn.classList.remove('visible');
        }
    }
    
    // Filter blog posts based on search term and active tag
    function filterBlogPosts() {
        let visibleCount = 0;
        
        blogCards.forEach(card => {
            const tags = card.getAttribute('data-tags').split(',');
            const searchData = card.getAttribute('data-search').toLowerCase();
            const title = card.querySelector('h3').textContent.toLowerCase();
            const summary = card.querySelector('.summary').textContent.toLowerCase();
            
            // Check if card matches search term
            const matchesSearch = currentSearchTerm === '' || 
                searchData.includes(currentSearchTerm) ||
                title.includes(currentSearchTerm) ||
                summary.includes(currentSearchTerm);
            
            // Check if card matches active tag
            const matchesTag = currentActiveTag === 'all' || tags.includes(currentActiveTag);
            
            // Show/hide card based on filters
            if (matchesSearch && matchesTag) {
                card.classList.remove('hidden');
                visibleCount++;
                
                // Add animation delay for staggered effect
                card.style.animationDelay = `${visibleCount * 0.1}s`;
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = 'flex';
            blogContainer.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            blogContainer.style.display = 'flex';
        }
        
        // Update progress bar and scroll indicators
        updateBlogScrollIndicators();
    }
    
    // Update blog scroll indicators after filtering
    function updateBlogScrollIndicators() {
        const blogWrapper = document.querySelector('.blog-container-wrapper');
        const progressBar = document.querySelector('.blog-progress-bar');
        
        if (blogContainer && blogWrapper) {
            // Reset scroll position
            blogContainer.scrollTop = 0;
            
            // Update progress bar
            if (progressBar) {
                progressBar.style.width = '0%';
                progressBar.setAttribute('aria-valuenow', '0');
            }
            
            // Reset scroll indicators
            blogWrapper.classList.remove('scrolled-down');
        }
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            currentSearchTerm = '';
            updateClearButton();
            filterBlogPosts();
        }
    });
    
    // Initialize
    updateClearButton();
    
    // Add search input focus effect
    searchInput.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
    
    // Add hover effects for tag filters
    tagFilters.forEach(filter => {
        filter.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        filter.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Add click outside to clear search focus
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            searchInput.blur();
        }
    });
    
    // Accessibility improvements
    searchInput.setAttribute('aria-label', 'Search blog posts');
    searchInput.setAttribute('aria-describedby', 'search-description');
    
    // Add search description for screen readers
    const searchDescription = document.createElement('div');
    searchDescription.id = 'search-description';
    searchDescription.className = 'sr-only';
    searchDescription.textContent = 'Search through blog posts by title, content, or keywords. Use Ctrl+K to quickly focus this search box.';
    searchInput.parentElement.appendChild(searchDescription);
    
    // Add screen reader only class
    const style = document.createElement('style');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(style);
}); 