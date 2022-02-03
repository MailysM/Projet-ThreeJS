const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 45,aspect,0.1,100 );
camera.position.z = 9;
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls( camera , renderer.domElement );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: true,
});

function createMap(size,length,pas){
    let totalLength = size*length+(size-1)*pas;
    for (let i = 0; i < totalLength; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.x = i;
        scene.add(cube);
    }
}

createMap(10);



const render = function () {
    requestAnimationFrame( render );
    controls.update();
    renderer.render(scene, camera);
};

render();

