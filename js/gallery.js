// Project search function
function simpleSearch() {
    let input = document.getElementById('myInput');
    let filter = input.value.toUpperCase();
    let gallery = document.querySelector('.scrollable-gallery');
    let items = gallery.getElementsByClassName('responsive');
    let noResults = document.getElementById('no-results');
    let foundItems = false;
    
    for (let i = 0; i < items.length; i++) {
        let nameAttr = items[i].getAttribute('data-name') || '';
        let desc = items[i].querySelector('.desc p.description') || '';
        let descText = desc ? desc.textContent || desc.innerText : '';
        
        if (nameAttr.toUpperCase().indexOf(filter) > -1 || descText.toUpperCase().indexOf(filter) > -1) {
            items[i].classList.remove('hidden');
            items[i].classList.add('visible');
            foundItems = true;
        } else {
            items[i].classList.add('hidden');
            items[i].classList.remove('visible');
        }
    }
    
    // Show "no results" message if no items found
    if (!foundItems && filter !== '') {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'no-results';
            noResults.className = 'no-results-message';
            noResults.innerHTML = 'No projects found matching "<span></span>". Try a different search term.';
            gallery.appendChild(noResults);
        }
        noResults.querySelector('span').textContent = filter;
        noResults.style.display = 'block';
    } else if (noResults) {
        noResults.style.display = 'none';
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
    
    // Filter projects by tags
    function filterProjectsByTags() {
        const gallery = document.querySelector('.scrollable-gallery');
        const items = gallery.querySelectorAll('.responsive');
        let foundItems = false;
        
        items.forEach(item => {
            const itemTags = (item.getAttribute('data-tags') || '').split(',');
            
            if (activeTags.size === 0 || Array.from(activeTags).every(tag => itemTags.includes(tag))) {
                item.classList.remove('hidden');
                item.classList.add('visible');
                foundItems = true;
            } else {
                item.classList.add('hidden');
                item.classList.remove('visible');
            }
        });
        
        // Update active filters display
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
            }
            noResults.style.display = 'block';
        } else if (noResults) {
            noResults.style.display = 'none';
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