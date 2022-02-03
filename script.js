const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 70,aspect,0.1, 100 );

camera.position.z = 9;
camera.rotation.set(0.5,0,0);

const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls( camera , renderer.domElement );
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = false;

controls.keys = {
	LEFT: 'ArrowLeft', //left arrow
	UP: 'ArrowUp', // up arrow
	RIGHT: 'ArrowRight', // right arrow
	BOTTOM: 'ArrowDown' // down arrow
}

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
const material = new THREE.MeshLambertMaterial({
    color: 0x00afaf,
    side: THREE.DoubleSide
});

function createMap(size,length,pas){
    let totalLength = size*length+(size-1)*pas;
    for (let i = 0; i < size; i+=length) {
        for(let j = 0; j < size; j+=length){
            let cube = new THREE.Mesh(geometry, material);
            cube.position.x = i + i*pas;
            cube.position.y = j + j*pas;
            scene.add(cube);
        }
    }
    camera.position.x = Math.floor(totalLength/2);
    camera.position.y = Math.floor(totalLength/2);
}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;



}

///Main

createMap(4,1,0.5);

document.addEventListener( 'pointermove', onPointerMove );

const render = function () {
    requestAnimationFrame( render );

    // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

    for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set( 0xff0000 );

	}
    controls.update();

    renderer.render(scene, camera);
};

render();



