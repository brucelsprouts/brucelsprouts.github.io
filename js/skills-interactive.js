document.addEventListener('DOMContentLoaded', function() {
    // Configuration of skills with their categories and associated projects
    const skillsConfig = {
        // Programming Languages
        'html': { 
            category: 'programming', 
            projectTags: ['html'],
            name: 'HTML5'
        },
        'css': { 
            category: 'programming', 
            projectTags: ['css'],
            name: 'CSS'
        },
        'javascript': { 
            category: 'programming', 
            projectTags: ['javascript'],
            name: 'JavaScript'
        },
        'java': { 
            category: 'programming', 
            projectTags: ['java'],
            name: 'Java'
        },
        'python': { 
            category: 'programming', 
            projectTags: ['python'],
            name: 'Python'
        },
        
        // Frameworks & Libraries
        'react': { 
            category: 'framework', 
            projectTags: ['react'],
            name: 'React'
        },
        'node': { 
            category: 'framework', 
            projectTags: ['node'],
            name: 'Node.js'
        },
        'tensorflow': { 
            category: 'framework', 
            projectTags: ['tensorflow'],
            name: 'TensorFlow'
        },
        
        // Design Tools
        'photoshop': { 
            category: 'design', 
            projectTags: ['photoshop'],
            name: 'Photoshop'
        },
        'aftereffects': { 
            category: 'design', 
            projectTags: ['aftereffects'],
            name: 'After Effects'
        },
        
        // Other Tools & Technologies
        'git': { 
            category: 'tool', 
            projectTags: ['git'],
            name: 'Git'
        },
        'responsive': { 
            category: 'web', 
            projectTags: ['responsive'],
            name: 'Responsive'
        },
        'ai': { 
            category: 'tech', 
            projectTags: ['ai'],
            name: 'AI/ML'
        },
        'game-dev': { 
            category: 'tech', 
            projectTags: ['game-dev'],
            name: 'Game Dev'
        },
        'database': { 
            category: 'tech', 
            projectTags: ['database'],
            name: 'Database'
        }
    };

    // DOM elements
    const skillsGrid = document.querySelector('.skills-grid');
    const projectsDisplay = document.querySelector('.projects-display');
    const projectCards = document.querySelector('.project-cards');
    const categoryButtons = document.querySelectorAll('.skill-tag-filter');
    let allProjects = [];
    let activeSkill = null;

    // Initialize category filters with animation
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.classList.add('category-click');
            setTimeout(() => {
                this.classList.remove('category-click');
            }, 300);
            
            // Remove active class from all buttons with animation
            categoryButtons.forEach(btn => {
                if (btn.classList.contains('active')) {
                    btn.classList.add('deactivating');
                    setTimeout(() => {
                        btn.classList.remove('active', 'deactivating');
                    }, 300);
                }
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterSkillsByCategory(category);
        });
    });

    // Function to filter skills by category with animations
    function filterSkillsByCategory(category) {
        const skillIcons = document.querySelectorAll('.skill-item');
        
        // Apply staggered animations
        skillIcons.forEach((icon, index) => {
            const isVisible = category === 'all' || skillsConfig[icon.dataset.skill].category === category;
            const delay = Math.min(index * 30, 300); // Cap at 300ms
            
            // Set transition delay for staggered effect
            icon.style.transitionDelay = `${delay}ms`;
            
            if (isVisible) {
                // Skill should be visible
                if (icon.style.display === 'none') {
                    // Prepare for fade in
                    icon.classList.add('skill-animating-in');
                    icon.style.display = 'flex';
                    
                    // Force reflow
                    void icon.offsetWidth;
                    
                    // Remove animation class to trigger transition
                    setTimeout(() => {
                        icon.classList.remove('skill-animating-in');
                    }, 10);
                }
            } else {
                // Skill should be hidden
                if (icon.style.display !== 'none') {
                    // Animate out
                    icon.classList.add('skill-animating-out');
                    
                    // After animation, hide the element
                    setTimeout(() => {
                        icon.style.display = 'none';
                        icon.classList.remove('skill-animating-out');
                        icon.style.transitionDelay = '0ms';
                    }, 300);
                }
            }
        });
    }

    // Function to load projects with enhanced animations
    function loadProjects() {
        // Fetch projects from DOM
        const projectElements = document.querySelectorAll('.responsive');
        
        projectElements.forEach(project => {
            const tags = project.dataset.tags ? project.dataset.tags.split(',') : [];
            const title = project.dataset.name || 'Untitled Project';
            const date = project.dataset.date || '';
            
            // Get the image source
            let imageSrc = '';
            const imgElement = project.querySelector('img');
            if (imgElement) {
                imageSrc = imgElement.src;
            }
            
            // Get the description
            let description = '';
            const descElement = project.querySelector('.description');
            if (descElement) {
                description = descElement.textContent;
            }
            
            // Get the link
            let link = '';
            const linkElement = project.querySelector('a');
            if (linkElement) {
                link = linkElement.href;
            }
            
            allProjects.push({
                title,
                date,
                tags,
                imageSrc,
                description,
                link
            });
        });
    }

    // Function to render project cards with animations
    function renderProjectCards(skill) {
        // Clear with fade out if there are existing cards
        if (projectCards.children.length > 0) {
            // Fade out existing cards
            Array.from(projectCards.children).forEach(card => {
                card.classList.add('card-fade-out');
            });
            
            // After animation, clear and add new cards
            setTimeout(() => {
                projectCards.innerHTML = '';
                renderNewCards(skill);
            }, 300);
        } else {
            // If no existing cards, just render new ones
            renderNewCards(skill);
        }
    }
    
    // Helper function to render new cards with animations
    function renderNewCards(skill) {
        const filteredProjects = allProjects.filter(project => {
            return skill.projectTags.some(tag => project.tags.includes(tag));
        });
        
        if (filteredProjects.length === 0) {
            const noProjects = document.createElement('div');
            noProjects.className = 'no-projects';
            noProjects.innerHTML = 'No projects found for this skill';
            
            // Animate the message in
            noProjects.style.opacity = '0';
            noProjects.style.transform = 'translateY(20px)';
            projectCards.appendChild(noProjects);
            
            // Force reflow
            void noProjects.offsetWidth;
            
            // Animate in
            setTimeout(() => {
                noProjects.style.opacity = '1';
                noProjects.style.transform = 'translateY(0)';
            }, 10);
            
            return;
        }
        
        // Add cards with staggered animation
        filteredProjects.forEach((project, index) => {
            const formattedDate = formatDate(project.date);
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card card-fade-in';
            
            projectCard.innerHTML = `
                <a href="${project.link}" aria-label="View ${project.title} project">
                    <img src="${project.imageSrc}" alt="${project.title}" class="project-image">
                </a>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-date">${formattedDate}</p>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            // Set delay for staggered animation
            const delay = Math.min(index * 100, 500); // Longer delay for project cards
            projectCard.style.transitionDelay = `${delay}ms`;
            
            projectCards.appendChild(projectCard);
            
            // Force reflow
            void projectCard.offsetWidth;
            
            // Remove animation class to trigger transition
            setTimeout(() => {
                projectCard.classList.remove('card-fade-in');
            }, 10);
        });
    }

    // Format date from YYYY-MM-DD to Month Year
    function formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    }

    // Function to handle skill click with animations
    function handleSkillClick(skillIcon) {
        const skill = skillIcon.dataset.skill;
        const skillConfig = skillsConfig[skill];
        
        // Add click animation
        skillIcon.classList.add('skill-click');
        setTimeout(() => {
            skillIcon.classList.remove('skill-click');
        }, 300);
        
        // Toggle active state
        const wasActive = skillIcon.classList.contains('active');
        
        // Remove active class from all skill icons with animation
        document.querySelectorAll('.skill-item').forEach(icon => {
            if (icon !== skillIcon && icon.classList.contains('active')) {
                icon.classList.add('deactivating');
                setTimeout(() => {
                    icon.classList.remove('active', 'deactivating');
                }, 300);
            }
        });
        
        // If the clicked skill wasn't active, set it as active
        if (!wasActive) {
            skillIcon.classList.add('active');
            activeSkill = skillConfig;
            
            // First make the container visible but with height 0
            projectsDisplay.style.opacity = '0';
            projectsDisplay.style.maxHeight = '0';
            projectsDisplay.classList.add('active');
            
            // Render projects for this skill
            renderProjectCards(skillConfig);
            
            // Then animate the container expanding
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Using requestAnimationFrame twice ensures browser has time to process
                    projectsDisplay.classList.add('activating');
                    projectsDisplay.style.opacity = '1';
                    projectsDisplay.style.maxHeight = '1500px';
                    
                    // After initial activation, remove the animation class
                    setTimeout(() => {
                        projectsDisplay.classList.remove('activating');
                        projectsDisplay.style.maxHeight = '';
                        projectsDisplay.style.opacity = '';
                    }, 500);
                });
            });
        } else {
            // Hide projects display with animation
            projectsDisplay.classList.add('deactivating');
            projectsDisplay.style.opacity = '0';
            projectsDisplay.style.maxHeight = '0';
            
            setTimeout(() => {
                projectsDisplay.classList.remove('active', 'deactivating');
                projectsDisplay.style.opacity = '';
                projectsDisplay.style.maxHeight = '';
                activeSkill = null;
            }, 500);
        }
    }

    // Initialize skills grid with animations
    function initializeSkillsGrid() {
        // Clear existing content
        skillsGrid.innerHTML = '';
        
        // Create skill icons with staggered animation
        Object.keys(skillsConfig).forEach((skill, index) => {
            const skillConfig = skillsConfig[skill];
            
            const skillIcon = document.createElement('div');
            skillIcon.className = 'skill-item skill-fade-in';
            skillIcon.dataset.skill = skill;
            skillIcon.dataset.category = skillConfig.category;
            
            skillIcon.innerHTML = `
                <img src="../assets/images/skills/${skill}icon.png" alt="${skillConfig.name}">
                <span>${skillConfig.name}</span>
            `;
            
            // Set delay for staggered animation
            const delay = Math.min(index * 50, 500);
            skillIcon.style.transitionDelay = `${delay}ms`;
            
            skillIcon.addEventListener('click', function() {
                handleSkillClick(this);
            });
            
            skillsGrid.appendChild(skillIcon);
            
            // Force reflow to ensure animation triggers
            void skillIcon.offsetWidth;
            
            // Remove animation class to trigger transition
            setTimeout(() => {
                skillIcon.classList.remove('skill-fade-in');
            }, 10);
        });
    }

    // Initialize
    loadProjects();
    initializeSkillsGrid();
    
    // Set 'All' category as active by default with a slight delay for visual appeal
    setTimeout(() => {
        document.querySelector('.skill-tag-filter[data-category="all"]').classList.add('active');
    }, 300);
}); 