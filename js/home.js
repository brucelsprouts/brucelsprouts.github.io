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