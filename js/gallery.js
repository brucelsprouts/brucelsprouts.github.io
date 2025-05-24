// Project search function with enhanced animations
function simpleSearch() {
    let input = document.getElementById('myInput');
    let filter = input.value.toUpperCase();
    let gallery = document.querySelector('.scrollable-gallery');
    let items = gallery.getElementsByClassName('responsive');
    let noResults = document.getElementById('no-results');
    let foundItems = false;
    
    // Extract search terms for tag matching
    let searchTerms = filter.split(/[\s,]+/).filter(term => term.length > 0);
    
    // Update visual feedback on search input
    if (filter.length > 0) {
        input.classList.add('active-search');
    } else {
        input.classList.remove('active-search');
    }
    
    // If there are tag matches, highlight them
    let tagMatches = [];
    if (searchTerms.length > 0) {
        const allTags = document.querySelectorAll('.tag');
        allTags.forEach(tag => {
            const tagName = tag.textContent.split(' ')[0].toUpperCase();
            
            // Check if any search term matches this tag
            const isMatched = searchTerms.some(term => tagName.includes(term));
            
            if (isMatched) {
                tag.classList.add('search-highlight');
                tagMatches.push(tag.getAttribute('data-tag'));
            } else {
                tag.classList.remove('search-highlight');
            }
        });
    } else {
        // Clear all tag highlights if search is empty
        document.querySelectorAll('.tag.search-highlight').forEach(tag => {
            tag.classList.remove('search-highlight');
        });
    }
    
    // Create a staggered animation effect
    Array.from(items).forEach((item, index) => {
        let nameAttr = item.getAttribute('data-name') || '';
        let desc = item.querySelector('.desc p.description') || '';
        let descText = desc ? desc.textContent || desc.innerText : '';
        let itemTags = (item.getAttribute('data-tags') || '').split(',');
        
        // Match by name, description, or matching highlighted tags
        const nameMatch = nameAttr.toUpperCase().indexOf(filter) > -1;
        const descMatch = descText.toUpperCase().indexOf(filter) > -1;
        const tagMatch = tagMatches.length > 0 && tagMatches.some(tag => itemTags.includes(tag));
        
        if (nameMatch || descMatch || tagMatch || (filter === '' && !activeTags.size)) {
            // Set animation delay based on index for staggered effect
            const delay = Math.min(index * 30, 300); // Cap at 300ms
            item.style.transitionDelay = `${delay}ms`;
            
            // Smoothly show the item
            if (item.classList.contains('hidden')) {
                // First move to visible but opacity 0
                item.classList.remove('hidden');
                item.classList.add('visible', 'animating-in');
                
                // Force reflow before starting animation
                void item.offsetWidth;
                
                // Then animate opacity and transform
                setTimeout(() => {
                    item.classList.remove('animating-in');
                }, 10);
            }
            
            // Add a highlight effect for matches
            if (filter.length > 0) {
                item.classList.add('search-match');
            } else {
                item.classList.remove('search-match');
            }
            
            foundItems = true;
        } else {
            // Smoothly hide the item
            if (!item.classList.contains('hidden')) {
                // Animate out
                item.classList.add('animating-out');
                
                // After animation completes, hide the item
                setTimeout(() => {
                    item.classList.add('hidden');
                    item.classList.remove('visible', 'animating-out', 'search-match');
                    item.style.transitionDelay = '0ms';
                }, 300); // Match the CSS transition duration
            }
        }
    });
    
    // Show "no results" message if no items found
    if (!foundItems && filter !== '') {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'no-results';
            noResults.className = 'no-results-message';
            noResults.innerHTML = 'No projects found matching "<span></span>". Try a different search term.';
            gallery.appendChild(noResults);
            
            // Apply enter animation to no results message
            noResults.style.opacity = '0';
            noResults.style.transform = 'translateY(20px)';
            setTimeout(() => {
                noResults.style.opacity = '1';
                noResults.style.transform = 'translateY(0)';
            }, 10);
        } else if (noResults.style.display === 'none') {
            // Animate the no results message back in
            noResults.style.display = 'flex';
            noResults.style.opacity = '0';
            noResults.style.transform = 'translateY(20px)';
            setTimeout(() => {
                noResults.style.opacity = '1';
                noResults.style.transform = 'translateY(0)';
            }, 10);
        }
        
        noResults.querySelector('span').textContent = filter;
    } else if (noResults) {
        // Animate the no results message out
        noResults.style.opacity = '0';
        noResults.style.transform = 'translateY(20px)';
        setTimeout(() => {
            noResults.style.display = 'none';
        }, 300);
    }
}

// Sort projects by different criteria
function sortProjects(sortBy) {
    let gallery = document.querySelector('.scrollable-gallery');
    let items = Array.from(gallery.getElementsByClassName('responsive'));
    
    items.sort(function(a, b) {
        if (sortBy === 'recent') {
            return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
        } else if (sortBy === 'oldest') {
            return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
        } else if (sortBy === 'name') {
            let aName = a.getAttribute('data-name').toLowerCase();
            let bName = b.getAttribute('data-name').toLowerCase();
            return aName.localeCompare(bName);
        }
    });
    
    // Remove existing items
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }
    
    // Append sorted items
    items.forEach(function(item) {
        gallery.appendChild(item);
    });
}

// Tags system functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let activeTags = new Set();
    const tagsWrapper = document.getElementById('tags-wrapper');
    const tagsToggle = document.getElementById('tags-toggle');
    const tagsList = document.getElementById('tags-list');
    const activeFilters = document.getElementById('active-filters');
    const clearFilters = document.getElementById('clear-filters');
    const tagSearch = document.getElementById('tag-search');
    
    // Toggle tags visibility
    if (tagsToggle && tagsWrapper) {
        tagsToggle.addEventListener('click', function() {
            tagsWrapper.classList.toggle('collapsed');
            tagsToggle.classList.toggle('collapsed');
            // Store preference in localStorage
            localStorage.setItem('tagsCollapsed', tagsWrapper.classList.contains('collapsed'));
        });
        
        // Check stored preference
        if (localStorage.getItem('tagsCollapsed') === 'true') {
            tagsWrapper.classList.add('collapsed');
            tagsToggle.classList.add('collapsed');
        }
    }
    
    // Filter projects by tags with enhanced animations
    function filterProjectsByTags() {
        const gallery = document.querySelector('.scrollable-gallery');
        const items = gallery.querySelectorAll('.responsive');
        let foundItems = false;
        
        // Create a staggered animation effect
        Array.from(items).forEach((item, index) => {
            const itemTags = (item.getAttribute('data-tags') || '').split(',');
            const matchesTags = activeTags.size === 0 || Array.from(activeTags).every(tag => itemTags.includes(tag));
            
            // Set animation delay based on index for staggered effect
            const delay = Math.min(index * 30, 300); // Cap at 300ms
            item.style.transitionDelay = `${delay}ms`;
            
            if (matchesTags) {
                // Smoothly show the item
                if (item.classList.contains('hidden')) {
                    // First move to visible but opacity 0
                    item.classList.remove('hidden');
                    item.classList.add('visible', 'animating-in');
                    
                    // Force reflow before starting animation
                    void item.offsetWidth;
                    
                    // Then animate opacity and transform
                    setTimeout(() => {
                        item.classList.remove('animating-in');
                    }, 10);
                }
                
                foundItems = true;
            } else {
                // Smoothly hide the item
                if (!item.classList.contains('hidden')) {
                    // Animate out
                    item.classList.add('animating-out');
                    
                    // After animation completes, hide the item
                    setTimeout(() => {
                        item.classList.add('hidden');
                        item.classList.remove('visible', 'animating-out');
                        item.style.transitionDelay = '0ms';
                    }, 300); // Match the CSS transition duration
                }
            }
        });
        
        // Update active filters display with animation
        updateActiveFilters();
        
        // Show "no results" message if no items found
        let noResults = document.getElementById('no-results');
        if (!foundItems && activeTags.size > 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.id = 'no-results';
                noResults.className = 'no-results-message';
                noResults.innerHTML = 'No projects found with the selected tags. Try different filter options.';
                gallery.appendChild(noResults);
                
                // Apply enter animation to no results message
                noResults.style.opacity = '0';
                noResults.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    noResults.style.opacity = '1';
                    noResults.style.transform = 'translateY(0)';
                }, 10);
            } else if (noResults.style.display === 'none') {
                // Animate the no results message back in
                noResults.style.display = 'flex';
                noResults.style.opacity = '0';
                noResults.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    noResults.style.opacity = '1';
                    noResults.style.transform = 'translateY(0)';
                }, 10);
            }
        } else if (noResults) {
            // Animate the no results message out
            noResults.style.opacity = '0';
            noResults.style.transform = 'translateY(20px)';
            setTimeout(() => {
                noResults.style.display = 'none';
            }, 300);
        }
    }
    
    // Update active filters display
    function updateActiveFilters() {
        if (!activeFilters) return;
        
        // Clear current filters
        const filtersContainer = activeFilters.querySelector(':scope > *:first-child');
        const buttonsToRemove = activeFilters.querySelectorAll('.filter-tag');
        buttonsToRemove.forEach(btn => btn.remove());
        
        // Show or hide the active filters container
        if (activeTags.size > 0) {
            activeFilters.classList.remove('hidden');
            
            // Add new filter tags
            activeTags.forEach(tag => {
                const tagName = document.querySelector(`.tag[data-tag="${tag}"]`).textContent.split(' ')[0]; // Get name without count
                
                const filterTag = document.createElement('div');
                filterTag.className = 'filter-tag';
                filterTag.dataset.tag = tag;
                filterTag.innerHTML = `${tagName} <button aria-label="Remove ${tagName} filter">×</button>`;
                
                // Add remove event
                filterTag.querySelector('button').addEventListener('click', function() {
                    activeTags.delete(tag);
                    document.querySelector(`.tag[data-tag="${tag}"]`).classList.remove('active');
                    filterProjectsByTags();
                });
                
                activeFilters.insertBefore(filterTag, clearFilters);
            });
        } else {
            activeFilters.classList.add('hidden');
        }
    }
    
    // Add click event to tags
    if (tagsList) {
        const tags = tagsList.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.addEventListener('click', function() {
                const tagName = this.getAttribute('data-tag');
                
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    activeTags.delete(tagName);
                } else {
                    this.classList.add('active');
                    activeTags.add(tagName);
                }
                
                filterProjectsByTags();
            });
        });
    }
    
    // Clear all filters
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            activeTags.clear();
            document.querySelectorAll('.tag.active').forEach(tag => {
                tag.classList.remove('active');
            });
            filterProjectsByTags();
        });
    }
    
    // Tag search functionality
    if (tagSearch) {
        tagSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tags = document.querySelectorAll('.tag');
            
            tags.forEach(tag => {
                const tagText = tag.textContent.toLowerCase();
                if (tagText.includes(searchTerm)) {
                    tag.style.display = '';
                } else {
                    tag.style.display = 'none';
                }
            });
        });
    }
    
    // Mobile optimization - center dropdowns on small screens
    function optimizeForMobile() {
        const sortContainer = document.querySelector('.sort-container');
        const mediaQuery = window.matchMedia('(max-width: 480px)');
        
        function handleScreenChange(e) {
            if (e.matches) {
                // Mobile layout
                if (sortContainer) {
                    sortContainer.style.margin = '0 auto';
                }
            } else {
                // Desktop layout
                if (sortContainer) {
                    sortContainer.style.margin = '';
                }
            }
        }
        
        // Initial check
        handleScreenChange(mediaQuery);
        
        // Add listener for changes
        mediaQuery.addEventListener('change', handleScreenChange);
    }
    
    // Initialize mobile optimization
    optimizeForMobile();
    
    // Set initial sort to most recent
    sortProjects('recent');
}); 