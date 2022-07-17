import * as THREE from '../Workshop/node_modules/three/src/Three.js';
let pointer, raycaster, isLeftDown = false, isRightDown = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
// const controls = new OrbitControls();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Mouse clicker
pointer = new THREE.Vector2();
raycaster = new THREE.Raycaster();
const objects = [];
let popup = document.getElementById("popup");

const geometry = new THREE.BoxGeometry(4, 2, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

// Listeners
document.addEventListener('pointerdown', onPointerDown);
document.addEventListener('keydown', onDocumentKeyDown);
document.addEventListener('keyup', onDocumentKeyUp);

function showPopup() {
    popup.style.display = "block";
}

function onPointerDown(event) {

    showPopup();

    pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(objects, false);
    if (intersects.length > 0) {
        const intersect = intersects[0];
        // delete cube
        if (isShiftDown) {
            if (intersect.object !== plane) {
                scene.remove(intersect.object);
                objects.splice(objects.indexOf(intersect.object), 1);
            }
            // create cube
        } else {
            const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
            voxel.position.copy(intersect.point).add(intersect.face.normal);
            voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

            scene.add(voxel);
            objects.push(voxel);
        }
        render();
    }

}

function onDocumentKeyDown(event) {

    switch (event.key) {
        case "ArrowLeft": isLeftDown = true; break;
        case "ArrowRight": isRightDown = true; break;
    }
}

function onDocumentKeyUp(event) {
    switch (event.key) {
        case "ArrowLeft": isLeftDown = false; break;
        case "ArrowRight": isRightDown = false; break;
    }
}



function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // controls

    if (isRightDown) cube.rotation.y += 0.01;
    if (isLeftDown) cube.rotation.y -= 0.01;
    // cube.rotation.y += 0.01;

}
animate();