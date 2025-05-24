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
    const categoryButtons = document.querySelectorAll('.category-button');
    let allProjects = [];
    let activeSkill = null;

    // Initialize category filters
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterSkillsByCategory(category);
        });
    });

    // Function to filter skills by category
    function filterSkillsByCategory(category) {
        const skillIcons = document.querySelectorAll('.skill-icon');
        
        skillIcons.forEach(icon => {
            if (category === 'all' || skillsConfig[icon.dataset.skill].category === category) {
                icon.style.display = 'flex';
            } else {
                icon.style.display = 'none';
            }
        });
    }

    // Function to load projects
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

    // Function to render project cards based on selected skill
    function renderProjectCards(skill) {
        projectCards.innerHTML = '';
        
        const filteredProjects = allProjects.filter(project => {
            return skill.projectTags.some(tag => project.tags.includes(tag));
        });
        
        if (filteredProjects.length === 0) {
            projectCards.innerHTML = '<div class="no-projects">No projects found for this skill</div>';
            return;
        }
        
        filteredProjects.forEach(project => {
            const formattedDate = formatDate(project.date);
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
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
            
            projectCards.appendChild(projectCard);
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

    // Function to handle skill click
    function handleSkillClick(skillIcon) {
        const skill = skillIcon.dataset.skill;
        const skillConfig = skillsConfig[skill];
        
        // Toggle active state
        const wasActive = skillIcon.classList.contains('active');
        
        // Remove active class from all skill icons
        document.querySelectorAll('.skill-icon').forEach(icon => {
            icon.classList.remove('active');
        });
        
        // If the clicked skill wasn't active, set it as active
        if (!wasActive) {
            skillIcon.classList.add('active');
            activeSkill = skillConfig;
            
            // Render projects for this skill
            renderProjectCards(skillConfig);
            
            // Show projects display
            projectsDisplay.classList.add('active');
        } else {
            // Hide projects display
            projectsDisplay.classList.remove('active');
            activeSkill = null;
        }
    }

    // Initialize skills grid
    function initializeSkillsGrid() {
        // Clear existing content
        skillsGrid.innerHTML = '';
        
        // Create skill icons
        Object.keys(skillsConfig).forEach(skill => {
            const skillConfig = skillsConfig[skill];
            
            const skillIcon = document.createElement('div');
            skillIcon.className = 'skill-icon';
            skillIcon.dataset.skill = skill;
            skillIcon.dataset.category = skillConfig.category;
            
            skillIcon.innerHTML = `
                <img src="../assets/images/skills/${skill}icon.png" alt="${skillConfig.name}">
                <span>${skillConfig.name}</span>
            `;
            
            skillIcon.addEventListener('click', function() {
                handleSkillClick(this);
            });
            
            skillsGrid.appendChild(skillIcon);
        });
    }

    // Initialize
    loadProjects();
    initializeSkillsGrid();
    
    // Set 'All' category as active by default
    document.querySelector('.category-button[data-category="all"]').classList.add('active');
}); 