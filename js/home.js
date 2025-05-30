document.addEventListener('DOMContentLoaded', () => {
    window.onload = function() {
        window.scrollTo(0, 0); // Ensure the page starts at the top
    };
    
    const container = document.getElementById('dim-container');

    function updateContainerWidth() {
        if (window.innerWidth < 750) {
            container.style.width = '70%';
        } else {
            container.style.width = '100%';
        }
    }

    // Initial width setting
    updateContainerWidth();

    // Update width on window resize
    window.addEventListener('resize', updateContainerWidth);

    container.style.height = '400px'; // Set specific height

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera with a fixed FOV
    const camera = new THREE.PerspectiveCamera(15, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5; // Move the camera closer

    // Create a renderer with alpha set to true
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    container.appendChild(renderer.domElement);

    // Initialize OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.05; // Damping factor
    controls.screenSpacePanning = false; // Disable panning
    controls.enableZoom = false; // Disable zoom
    controls.enableRotate = true; // Enable rotation
    controls.enablePan = false; // Disable panning

    // Add a directional light coming from the front
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.01);
    frontLight.position.set(0, 0, 1).normalize();
    scene.add(frontLight);

    // Add a directional light coming from the back
    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(0, 0, -1).normalize();
    scene.add(backLight);

    // Add a directional light coming from the top
    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(0, 1, 0).normalize();
    scene.add(topLight);

    // Add a directional light coming from the bottom
    const bottomLight = new THREE.DirectionalLight(0xffffff, 1);
    bottomLight.position.set(0, -1, 0).normalize();
    scene.add(bottomLight);

    // Add a directional light coming from the left
    const leftLight = new THREE.DirectionalLight(0xffffff, 1);
    leftLight.position.set(-1, 0, 0).normalize();
    scene.add(leftLight);

    // Add a directional light coming from the right
    const rightLight = new THREE.DirectionalLight(0xffffff, 1);
    rightLight.position.set(1, 0, 0).normalize();
    scene.add(rightLight);

    // Add an ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Variable to store the 3D object
    let object3D;

    // Load the 3D model
    const loader = new THREE.GLTFLoader();
    loader.load('../assets/other/b.glb', (gltf) => {
        object3D = gltf.scene;
        scene.add(object3D);
        animate();
    }, undefined, (error) => {
        console.error(error);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Update controls
        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }); 

    // Rotate the object based on scroll position
    window.addEventListener('scroll', () => {
        if (object3D) {
            const scrollY = window.scrollY;
            object3D.rotation.y = scrollY * 0.01; // Adjust the rotation speed as needed
        }
    });

    function updateBackgroundPosition(e) {
        const backgroundImage = document.getElementById('background-image');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate the new position
        const offsetX = (mouseX / windowWidth - 0.5) * -40; // Adjust the multiplier for desired effect
        const offsetY = (mouseY / windowHeight - 0.5) * -40; // Adjust the multiplier for desired effect

        // Apply the new position
        backgroundImage.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;
    }

    document.addEventListener('mousemove', updateBackgroundPosition);
    document.addEventListener('drag', updateBackgroundPosition);

    // Animate elements when they come into view
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize animation for blog cards
        const blogCards = document.querySelectorAll('.blog-card');
        
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        // Function to handle scroll animation
        function handleScrollAnimation() {
            blogCards.forEach(card => {
                if (isInViewport(card) && !card.classList.contains('animated')) {
                    card.classList.add('fade-in-up', 'animated');
                }
            });
        }
        
        // Run on scroll
        window.addEventListener('scroll', handleScrollAnimation);
        
        // Run on page load
        handleScrollAnimation();
        
        // Type writer effect for subtitle highlights
        const highlights = document.querySelectorAll('.highlight');
        let currentHighlight = 0;
        
        function cycleHighlights() {
            highlights.forEach(highlight => {
                highlight.style.opacity = 0;
            });
            
            highlights[currentHighlight].style.opacity = 1;
            currentHighlight = (currentHighlight + 1) % highlights.length;
        }
        
        // Set initial state
        highlights.forEach(highlight => {
            highlight.style.opacity = 0;
            highlight.style.transition = 'opacity 0.5s ease-in-out';
        });
        
        // Set first highlight visible
        if (highlights.length > 0) {
            highlights[0].style.opacity = 1;
            // Only set interval if there are multiple highlights
            if (highlights.length > 1) {
                setInterval(cycleHighlights, 3000);
            }
        }
    });
});