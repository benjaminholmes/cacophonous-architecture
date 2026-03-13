import * as THREE from 'three';

//file for the Custom Object class that creates the architectural objects

//variables to load object textures
const meshLoader = new THREE.TextureLoader();
const brickTexture = meshLoader.load( 'textures/brickwork.jpg' );
const pipeTexture = meshLoader.load( 'textures/pipe-texture.jpg' );
const floorTexture = meshLoader.load( 'textures/oak-floor.Jpg' );
const windowTexture = meshLoader.load( 'textures/window-texture.jpg' );
const woodTexture = meshLoader.load( 'textures/wood.jpg' );
const barkTexture = meshLoader.load( 'textures/bark-texture.jpg' );
const leavesTexture = meshLoader.load( 'textures/leaves.jpg' );

export default class CustomObject extends THREE.Object3D {

    constructor(x, y, z, type) {
        super();

        this.position.set(x, y, z); // initial position

        // conditional statement that creates different objects based on the type
        if (type === 'brick') {
            this.createBrick();
        }else if (type === 'pipe') {
            this.createPipe();
        } else if (type === 'window') {
            this.createWindow();
        }else if (type === 'tree') {
            this.createTree();
        }else if (type === 'wall') {
            this.createWall();
        }else if (type === 'arch') {
            this.createArch();
        }else if (type === 'longwall') {
            this.createLongWall();
        }else if (type === 'floor') {
            this.createFloor();
        } else {
            console.error('Invalid object type:', type);
        }
    }

    // Function to create a brick
    createBrick() {
        const brickGeometry = new THREE.BoxGeometry(8, 4, 4); // Create a brick geometry
        const brickMaterial = new THREE.MeshBasicMaterial({map: brickTexture, transparent: true, opacity: 1}); // Create a material
        const brickMesh = new THREE.Mesh(brickGeometry, brickMaterial); // Create a mesh
        
        this.add(brickMesh); // Add the brick to this custom object
    }


    // Function to create a pipe
    createPipe() {
        const pipeGeometry = new THREE.CylinderGeometry(1, 1, 20); // Create a pipe geometry
        const pipeMaterial = new THREE.MeshBasicMaterial({map: pipeTexture, transparent: true, opacity: 1}); // Create a material
        const pipeMesh = new THREE.Mesh(pipeGeometry, pipeMaterial); // Create a mesh
        this.add(pipeMesh); // Add the pipe to this custom object
    }

    // Function to create a long wall
    createLongWall() {
        const longwallGeometry = new THREE.BoxGeometry(2, 2, 20); // Create a long wall geometry
        const longwallMaterial = new THREE.MeshBasicMaterial({map: brickTexture, transparent: true, opacity: 1}); // Create a material
        const longwallMesh = new THREE.Mesh(longwallGeometry, longwallMaterial); // Create a mesh
        this.add(longwallMesh); // Add the long wall to this custom object
    }


    createWindow() {
        
        // Create geometry for the window
        const windowGeometry = new THREE.BoxGeometry(10, 10, 1);
        const windowMaterial = new THREE.MeshBasicMaterial({map: windowTexture, transparent: true, opacity: 1});
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        
        this.add(windowMesh);
    }

    createTree() {
        const trunkHeight = 5; // Height of the trunk
        const trunkRadius = 1; // Radius of the trunk
        const crownHeight = 5; // Height of the crown
        const crownRadius = 4; // Radius of the crown
    
        const trunkMaterial = new THREE.MeshBasicMaterial({ map: barkTexture, transparent: true, opacity: 1 }); // Brown color for the trunk
        const crownMaterial = new THREE.MeshBasicMaterial({ map: leavesTexture, transparent: true, opacity: 1  }); // Green color for the crown
    
        // Create geometry for the trunk
        const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 16);
    
        // Create a mesh for the trunk
        const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    
        // Position the trunk
        trunkMesh.position.set(0, trunkHeight / 2, 0);
    
        // Add the trunk to the tree
        this.add(trunkMesh);
    
        // Create geometry for the crown (cone shape)
        const crownGeometry = new THREE.SphereGeometry(crownRadius, crownHeight, 16);
    
        // Create a mesh for the crown
        const crownMesh = new THREE.Mesh(crownGeometry, crownMaterial);
    
        // Position the crown on top of the trunk
        crownMesh.position.set(0, trunkHeight + crownHeight / 2, 0);
    
        // Add the crown to the tree
        this.add(crownMesh);
    }

     // Function to create a wall
     createWall() {
        const wallGeometry = new THREE.BoxGeometry(15, 15, 2); // Create a wall geometry
        const wallMaterial =  new THREE.MeshBasicMaterial({map: brickTexture, transparent: true, opacity: 1}); // Create a material

        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial); // Create a mesh
        this.add(wallMesh); // Add the wall to this custom object
    }

    // Function to create a floor
    createFloor() {
        const floorGeometry = new THREE.BoxGeometry(15, 1, 15); // Create a floor geometry
        const floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, transparent: true, opacity: 1}); // Create a material
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial); // Create a mesh
        this.add(floorMesh); // Add the wall to this custom object
    }


     // Function to create a arch

    createArch() {
        const pillar1 = this.createPillarMesh(-3, 0, 0);
        const pillar2 = this.createPillarMesh(0, 12, 0);
        const pillar3 = this.createPillarMesh(3, 0, 0);

        // Adjust rotation and position of the middle pillar
        pillar1.rotateZ(Math.PI / 2); // Rotate the middle pillar by 90 degrees around the Z-axis
        pillar1.position.y = 7.5; // Adjust the Y position of the middle pillar
        pillar3.rotateZ(Math.PI / 2); // Rotate the middle pillar by 90 degrees around the Z-axis
        pillar3.position.y = 7.5; // Adjust the Y position of the middle pillr

        this.add(pillar1);
        this.add(pillar2);
        this.add(pillar3);
    }

    
    createPillarMesh(x, y, z) {
        const pillarGeometry = new THREE.BoxGeometry(8, 2, 2); 
        const pillarMaterial = new THREE.MeshBasicMaterial({map: woodTexture, transparent: true, opacity: 1}); 
        const pillarMesh = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillarMesh.position.set(x, y, z);
        return pillarMesh;
    }
}
