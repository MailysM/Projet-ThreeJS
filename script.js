const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 45,aspect,0.1,100 );
camera.position.z = 9;
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls( camera , renderer.domElement );
// spotlight
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(200, 400, 300);
scene.add(spotLight);
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
    for (let i = 0; i < totalLength; i+=length) {
        for(let j = 0; j < totalLength; j+=length){
            let cube = new THREE.Mesh(geometry, material);
            cube.position.x = i + i*pas;
            cube.position.y = j + j*pas;
            scene.add(cube);
        }
    }
}

createMap(4,1,0.5);



const render = function () {
    requestAnimationFrame( render );
    controls.update();
    renderer.render(scene, camera);
};

render();

