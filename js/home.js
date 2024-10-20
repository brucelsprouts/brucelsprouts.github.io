document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('3d-container');
    container.style.width = '400px'; // Set specific width
    container.style.height = '400px'; // Set specific height

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera with a larger FOV and move it further away
    const camera = new THREE.PerspectiveCamera(10, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5; // Move the camera closer

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add a directional light coming from head-on and make it brighter
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1); // Increased intensity to 2
directionalLight.position.set(0, 0, 1).normalize(); // Light coming from head-on
scene.add(directionalLight);

// Add an ambient light for overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Add a directional light coming from the bottom
const bottomLight = new THREE.DirectionalLight(0xffffff, 0.5); // Adjust intensity as needed
bottomLight.position.set(0, -1, 0).normalize(); // Light coming from the bottom
scene.add(bottomLight);


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
        if (object3D) {
            // Rotate the object based on scroll position
            const scrollY = window.scrollY;
            object3D.rotation.y = scrollY * 0.01; // Adjust the rotation speed as needed
        }
        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});