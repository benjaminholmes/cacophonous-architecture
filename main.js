//Cacophonous Architecute by Benjamin Holmes
//Built in April 2024
//An 3D interactive musical experience
//Using a Roland Hd-3 electric drum kit the player is able to create and manipulate architectural objects to create a 
//building within three minutes.
//The more chaotic the player plays the drums, the more chaotic their final building will be. However, the player will
//also have to the option to use the drumkit as if it was purely a game controller and create a less chaotic and more
//typical piece of architecture.
//The 3D environment is built using the JavaScipt library three.js, and the electirc drumkit integration is enabled 
//through the Web MIDI API. 
//The Instructions screen and end screen messaged are enabled through HTML, CSS and JavaScript
//The game is also programmed to be played using the keyboard, however this is not the intention for the played
//but rather enabled to allow me as the developer to work on the project without the drumkit connected. 
//The interactive experience has been built to be used in a full-screen content. 
//To start Cacophonous Architecture, open a terminal in it's main directory type npx vite 

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; //import orbit controls which allows mouse camera controls
import CustomObject from './CustomObject.js'; // Import your custom object class

let controls; //camera controls variable
let  dirLight; // directional light variable
const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();
const textureLoader = new THREE.TextureLoader(); //texture loaded three.js variable
const groundTexture = textureLoader.load('textures/pavement.jpg'); //texture for ground mesh
let start = document.getElementById("instructions-div"); //variable to call instruction-div in index.html file
let countdownElement; //variable for timer countdown
let endScreenElement; //variable for end screen div from index.html
let countdownInterval;
let countdownSeconds = 180; //variabe for amount of seconds for countdown timer
let timerExpired = false; //variable to create boolean for whether timer is expired or not

const fullScreen = document.getElementById("mainGame");

// countdownElement variable
countdownElement = document.getElementById('countdown');//variable to call countdown div in index.html file
// endScreenElement variable
endScreenElement = document.getElementById('endscreen');//variable to call endscreen div in index.html file


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up camera position
camera.position.set(150, 150, 0);

// Add a plane grid made of squares
const groundGeo = new THREE.PlaneGeometry( 150, 150).rotateX(-Math.PI * 0.5);
const groundMat = new THREE.MeshBasicMaterial({
    map: groundTexture, transparent: true, opacity: 0.8
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

//add grid helper
const gridHelper = new THREE.GridHelper(150, 50, 0xffffff, 0xffffff);
gridHelper.position.y = 0; // Adjust the y-coordinate of the grid
scene.add(gridHelper);

//add background texture
// scene.background = textureLoader.load( 'textures/bg.jpg' );

// Camera user interaction controls
controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//directional light
dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.position.set( - 1, 200, 1 );
dirLight.position.multiplyScalar( 20 );
scene.add( dirLight );

// Function to start the countdown timer
function startCountdown() {
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Function to update the countdown timer every second
function updateCountdown() {
    countdownSeconds--;

    // If the countdown reaches 0, stop the timer
    if (countdownSeconds <= 0) {
        clearInterval(countdownInterval);
        countdownElement.style.display = 'none';
        endScreenElement.style.display = 'block';
        timerExpired = true; // Set timerExpired to true when the timer runs out
        return;
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(countdownSeconds / 60);
    const seconds = countdownSeconds % 60;

    // Display the updated time in the countdown element
    countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


// Variable to keep track of the last created object
let lastCreatedObject = null;

// Function to generate random x and z positions within the grid
function getRandomPosition() {
    const gridSize = 150;
    const minPosition = -gridSize / 2;
    const maxPosition = gridSize / 2;
    const x = Math.random() * (maxPosition - minPosition) + minPosition;
    const z = Math.random() * (maxPosition - minPosition) + minPosition;
    return { x, z };
}

//keyboard controls for dev testing
// Event listener for keydown event

document.addEventListener('keydown', (event) => {
    if (lastCreatedObject) {
        const moveDistance = 1; // Adjust this value as needed
        const rotationAngle = Math.PI / 2; // Angle for rotation (90 degrees)

        const gridSize = 150;
        const halfGridSize = gridSize / 2;

        let newX = lastCreatedObject.position.x;
        let newZ = lastCreatedObject.position.z;

        switch (event.code) {
            case 'ArrowLeft':
                newZ = Math.min(halfGridSize, newZ + moveDistance);
                let crash1 = new Audio('audio/crash1.wav');
                crash1.play();
                break;
            case 'ArrowRight':
                newZ = Math.max(-halfGridSize, newZ - moveDistance);let crash2 = new Audio('audio/crash2.wav');
                crash2.play();
                break;
            case 'ArrowUp':
                newX = Math.max(-halfGridSize, newX - moveDistance);let ride1 = new Audio('audio/ride1.wav');
                ride1.play();
                break;
            case 'ArrowDown':
                newX = Math.min(halfGridSize, newX + moveDistance);let ride2 = new Audio('audio/ride2.wav');
                ride2.play();
                break;
            case 'KeyA':
                lastCreatedObject.rotateY(rotationAngle); // Rotate the object by 90 degrees
                let kick = new Audio('audio/kick.wav');
                kick.play();
                break;
        }

        lastCreatedObject.position.set(newX, lastCreatedObject.position.y, newZ);
    }
});

//keyboard controls for dev testing and to enable the start menu to be shown and hidden
//conditional statement for keyboard object creation
document.addEventListener('keydown', (event) => {
    // Check if the timer has expired
    if (timerExpired) return;

    if (event.key === 's' || event.key === 'S') {
        const { x, z } = getRandomPosition();
        const brickObject = new CustomObject(x, 200, z, 'brick'); 
        scene.add(brickObject); 
        lastCreatedObject = brickObject; // Update the last created object
        animateObject(brickObject); // Start the falling animation
        let snare = new Audio('audio/snare.wav');
        snare.play();
        return false;
    } else if (event.key === 'v' || event.key === 'V') {
        const { x, z } = getRandomPosition();
        const pipeObject = new CustomObject(x, 200, z, 'pipe'); 
        scene.add(pipeObject); 
        lastCreatedObject = pipeObject; // Update the last created object
        animateObject(pipeObject); // Start the falling animation
        let hihat = new Audio('audio/hihat.wav');
        hihat.play();
    } else if (event.key === 'd' || event.key === 'D') {
        const { x, z } = getRandomPosition();
        const windowObject = new CustomObject(x, 200, z, 'window'); 
        scene.add(windowObject); 
        lastCreatedObject = windowObject; // Update the last created object
        animateObject(windowObject); // Start the falling animation
        let floortom = new Audio('audio/floortom.wav');
        floortom.play();
    } else if (event.key === 'f' || event.key === 'F') {
        const { x, z } = getRandomPosition();
        const treeObject = new CustomObject(x, 200, z, 'tree'); 
        scene.add(treeObject); 
        lastCreatedObject = treeObject; // Update the last created object
        animateObject(treeObject); // Start the falling animation
        let tom1 = new Audio('audio/tom1.wav');
        tom1.play();
    } else if (event.key === 'x' || event.key === 'X') {
        const { x, z } = getRandomPosition();
        const wallObject = new CustomObject(x, 200, z, 'wall'); 
        scene.add(wallObject); 
        lastCreatedObject = wallObject; // Update the last created object
        animateObject(wallObject); // Start the falling animation
        let tom2 = new Audio('audio/tom2.wav');
        tom2.play();
    }else if (event.key === 'g' || event.key === 'G') {
        const { x, z } = getRandomPosition();
        const archObject = new CustomObject(x, 200, z, 'arch'); 
        scene.add(archObject); 
        lastCreatedObject = archObject; // Update the last created object
        animateObject(archObject); // Start the falling animation
        let tom3 = new Audio('audio/tom3.wav');
        tom3.play();
    }else if (event.key === 'c' || event.key === 'C') {
        const { x, z } = getRandomPosition();
        const longwallObject = new CustomObject(x, 200, z, 'longwall'); 
        scene.add(longwallObject); 
        lastCreatedObject = longwallObject; // Update the last created object
        animateObject(longwallObject); // Start the falling animation
        let hihat1 = new Audio('audio/hihat1.wav');
        hihat1.play();
    }else if (event.key === 'z' || event.key === 'Z') {
        const { x, z } = getRandomPosition();
        const floorObject = new CustomObject(x, 200, z, 'floor'); 
        scene.add(floorObject); 
        lastCreatedObject = floorObject; // Update the last created object
        animateObject(floorObject); // Start the falling animation
        let hihatpedal = new Audio('audio/hihatpedal.wav');
        hihatpedal.play();
    }else if(event.key === ' '){
        start.style.display =  "none";
        countdownElement.style.display = 'block'; // Show the countdown timer
        startCountdown(); // Start the countdown timer
        fullScreen.requestFullscreen(); 
    }
});

//Refresh the page 
//Allows app to be reloaded which is explained to the user after the timer has elapsed
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Refresh the page
        location.reload();
    }
});

// MIDI Event listener and JavaScipt Promise for MIDI messages & drum controls
navigator.requestMIDIAccess().then(function(midiAccess) {
    // Get the list of MIDI input devices

    // Define movement constraints
    const moveDistance = 1; // Adjust this value as needed
    const gridSize = 150;
    const halfGridSize = gridSize / 2;

    let inputs = midiAccess.inputs.values();
    
    // Function to handle MIDI messages with debounce
    function handleMIDIMessageWithDebounce(event) {
        
        const rotationAngle = Math.PI / 2; // Angle for rotation (90 degrees)
        // Check if the timer has expired
        if (timerExpired) return;
        
        if (handleMIDIMessageWithDebounce.timer) return; // Ignore if timer is active
        
        // Log MIDI message to console
        console.log("MIDI Message:", event.data);

        // the pad number is in data byte 1
        let padNumber = event.data[1];
        console.log("Pad Number:", padNumber);

        // condition statement to call corresponding function based on the MIDI pad number
        if (padNumber == 45) {
            const { x, z } = getRandomPosition();
            const brickObject = new CustomObject(x, 200, z, 'brick'); 
            scene.add(brickObject); 
            lastCreatedObject = brickObject; // Update the last created object
            animateObject(brickObject); // Start the falling animation
        }else if (padNumber == 26) {
            const { x, z } = getRandomPosition();
            const pipeObject = new CustomObject(x, 200, z, 'pipe'); 
            scene.add(pipeObject); 
            lastCreatedObject = pipeObject; // Update the last created object
            animateObject(pipeObject); // Start the falling animation
        }else if (padNumber == 22) { //the pipe is repeated over 2 padNumbers as this padnumber is switched on the same pad when the hi-hat pedal is held down
            const { x, z } = getRandomPosition();
            const pipeObject = new CustomObject(x, 200, z, 'pipe'); 
            scene.add(pipeObject); 
            lastCreatedObject = pipeObject; // Update the last created object
            animateObject(pipeObject); // Start the falling animation
        }else if (padNumber == 46) {
            const { x, z } = getRandomPosition();
            const longwallObject = new CustomObject(x, 200, z, 'longwall'); 
            scene.add(longwallObject); 
            lastCreatedObject = longwallObject; // Update the last created object
            animateObject(longwallObject); // Start the falling animation
        }else if (padNumber == 42) { //the long wall is repeated over 2 padNumbers as this padnumber is switched on the same pad when the hi-har pedal is held down
            const { x, z } = getRandomPosition();
            const longwallObject = new CustomObject(x, 200, z, 'longwall'); 
            scene.add(longwallObject); 
            lastCreatedObject = longwallObject; // Update the last created object
            animateObject(longwallObject); // Start the falling animation
        } else if (padNumber == 43) {
            const { x, z } = getRandomPosition();
            const windowObject = new CustomObject(x, 200, z, 'window'); 
            scene.add(windowObject); 
            lastCreatedObject = windowObject; // Update the last created object
            animateObject(windowObject); // Start the falling animation
        }else if (padNumber == 44) {
            const { x, z } = getRandomPosition();
            const treeObject = new CustomObject(x, 200, z, 'tree'); 
            scene.add(treeObject); 
            lastCreatedObject = treeObject; // Update the last created object
            animateObject(treeObject); // Start the falling animation
        }else if (padNumber == 38) {
            const { x, z } = getRandomPosition();
            const wallObject = new CustomObject(x, 200, z, 'wall'); 
            scene.add(wallObject); 
            lastCreatedObject = wallObject; // Update the last created object
            animateObject(wallObject); // Start the falling animation
        }else if (padNumber == 48) {
            const { x, z } = getRandomPosition();
            const archObject = new CustomObject(x, 200, z, 'arch'); 
            scene.add(archObject); 
            lastCreatedObject = archObject; // Update the last created object
            animateObject(archObject); // Start the falling animation
        }else if (padNumber == 40) {
            const { x, z } = getRandomPosition();
            const floorObject = new CustomObject(x, 200, z, 'floor'); 
            scene.add(floorObject); 
            lastCreatedObject = floorObject; // Update the last created object
            animateObject(floorObject); // Start the falling animation
        }else if (padNumber == 36) {
            lastCreatedObject.rotateY(rotationAngle); // Rotate the object by 90 degrees
        } else if (padNumber == 49) { 
        // Move left if within grid boundaries
        if (lastCreatedObject.position.x > -halfGridSize)
            lastCreatedObject.position.x -= moveDistance;
        } else if (padNumber == 55) {
            // Move up if within grid boundaries
            if (lastCreatedObject.position.z < halfGridSize)
                lastCreatedObject.position.z += moveDistance;
        } else if (padNumber == 51) {
            // Move right if within grid boundaries
            if (lastCreatedObject.position.x < halfGridSize)
                lastCreatedObject.position.x += moveDistance;
        } else if (padNumber == 53) {
            // Move down if within grid boundaries
            if (lastCreatedObject.position.z > -halfGridSize)
                lastCreatedObject.position.z -= moveDistance;
        }
        
        
        // Set timer to debounce further events
        handleMIDIMessageWithDebounce.timer = setTimeout(() => {
            handleMIDIMessageWithDebounce.timer = null;
        }, 100); // Adjust debounce time as needed
    }

    // Iterate over each input device
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        // Listen for MIDI messages with debounce
        input.value.onmidimessage = handleMIDIMessageWithDebounce;
    }
});

// Function to check for collisions and handle stacking
//I asked chatGPT to create a function to check falling objects collision and this function was generated
function checkCollisionsAndStack(object) {
    const objectBoundingBox = new THREE.Box3().setFromObject(object);

    // Check for collisions with existing objects
    scene.children.forEach(child => {
        if (child !== object && child instanceof CustomObject) {
            const childBoundingBox = new THREE.Box3().setFromObject(child);
            if (objectBoundingBox.intersectsBox(childBoundingBox)) {
                // Collision detected
                const intersection = objectBoundingBox.intersect(childBoundingBox);
                const offsetY = intersection.max.y - intersection.min.y;
                object.position.y += offsetY; // Move the object vertically to stack on top
            }
        }
    });
}

// Function to animate object falling
//I asked chatGPT to create a function to animate the objects falling from their starting point to the ground mesh and
//this function was generated 
function animateObject(object) {
    const gridBottom = 0; // Bottom of the grid where objects should stop falling

    function animate() {
        const objectBoundingBox = new THREE.Box3().setFromObject(object);
        const objectBottomY = objectBoundingBox.min.y;

        if (objectBottomY > gridBottom) {
            object.position.y -= 0.35; // Decrease y position (falling animation)
            checkCollisionsAndStack(object); // Check for collisions and handle stacking
            requestAnimationFrame(animate);
        }
    }
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();