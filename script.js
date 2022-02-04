//Import modules
const Cube = require('./Cube')

//Variables Jeux
const size = 4;
const length = 1;
const pas = 0.5;

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc );;

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 70,aspect,0.1, 100 );
camera.position.set( 10, 10, 8 );

const renderer = new THREE.WebGLRenderer();
const controls = new THREE.MapControls( camera , renderer.domElement );
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;


controls.keys = {
	LEFT: 'ArrowLeft', //left arrow
	UP: 'ArrowUp', // up arrow
	RIGHT: 'ArrowRight', // right arrow
	BOTTOM: 'ArrowDown' // down arrow
}
controls.listenToKeyEvents(window);

controls.mouseButtons = {
	LEFT: null,
	MIDDLE: THREE.MOUSE.DOLLY,
	RIGHT: null
}
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true;

controls.minPolarAngle = 2.35;
controls.maxPolarAngle = 2.35;
controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = 0;

// spotlight
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(200, 400, 300);
scene.add(spotLight);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({
    color:  0xFFC300  ,
    side: THREE.DoubleSide
});

//plateau
const sizePlateau = size*length+(size-1)*pas+2*pas;
const materialPlateau = new THREE.MeshLambertMaterial({
    color:  0x581845 ,
    flatShading: true
});
const geometryRect = new THREE.BoxGeometry(sizePlateau,sizePlateau,0.1);


let cubes = [];

function createMap(size,length,pas){
    let totalLength = size*length+(size-1)*pas;
    for (let i = 0; i < size; i+=length) {
        for(let j = 0; j < size; j+=length){
            cubes[i,j] = new THREE.Mesh(geometry, material);
            cubes[i,j].position.x =  i + i*pas - Math.floor(totalLength/2);
            cubes[i,j].position.y = j + j*pas;
            // cubes[i,j].addEventListener( 'mouseover', onPointerMove );
            scene.add(cubes[i,j]);
        }
    }
    let rectangle = new THREE.Mesh(geometryRect,materialPlateau);
    rectangle.position.x = pas -pas/3;
    rectangle.position.y = pas + Math.floor(totalLength/2);
    rectangle.position.z = -0.5;
    scene.add(rectangle);

}

function setBombs

// function onPointerMove( event ) {

// 	// calculate pointer position in normalized device coordinates
// 	// (-1 to +1) for both components
//     console.log("ok");
// 	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;



// }

///Main

createMap(size,length,pas);

function animate() {

    requestAnimationFrame( animate );

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();

}

const render = function () {
    requestAnimationFrame( render );

    // // update the picking ray with the camera and pointer position
	// raycaster.setFromCamera( pointer, camera );

	// // calculate objects intersecting the picking ray
	// const intersects = raycaster.intersectObjects( scene.children );

    // for ( let i = 0; i < intersects.length; i ++ ) {

	// 	intersects[ i ].object.material.color.set( 0xff0000 );

	// }
    controls.update();

    renderer.render(scene, camera);
};

render();



