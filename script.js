const loader = new THREE.FontLoader();

////Class Cube
class Cube {
    constructor(height, width, mesh, id) {
		this._height = height;
		this._width = width;
        this._hasBomb = false;
        this._mesh = mesh;
        this._numberNeighboorBomb = 0;
        this._id = id;
	}

    setBomb(hasBomb){
        this._hasBomb = hasBomb;
    }

    getMesh(){return this._mesh;}

    addBombNeighboor(){this._numberNeighboorBomb++;}

    getId(){return this._id;}

}
function createMap(size,length,pas){
    let totalLength = size*length+(size-1)*pas;
    for (let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++){
            const material = new THREE.MeshPhongMaterial({
                color:  0xFFC300  ,
                side: THREE.DoubleSide
            });
            const object = new THREE.Mesh(geometry, material);
            object.position.x =  i + i*pas - Math.floor(totalLength/2);
            object.position.y = j + j*pas;
            scene.add(object);
            cubes[i].push(new Cube(height,width,object, object.id));
            domEvents.addEventListener(object, 'click', function(){selectCube(cubes[i][j])}, false)
            
        }
    }
    let rectangle = new THREE.Mesh(geometryRect,materialPlateau);
    rectangle.position.x = pas -pas/3;
    rectangle.position.y = pas + Math.floor(totalLength/2);
    rectangle.position.z = -0.5;
    rectangle.name = "rectangle";
    scene.add(rectangle);

}

function setBombsMap(size, arrayCubes){
    const totalNumberBombs = Math.floor(size*size/8) + 1;
    let compteur = 0;
    while(compteur < totalNumberBombs){
        console.log(compteur)
        let randomI = getRandomInt(0,size-1);
        let randomJ = getRandomInt(0,size-1);
        
        if(arrayCubes[randomI][randomJ]._hasBomb==false){
            arrayCubes[randomI][randomJ].setBomb(true);
            setNeighboorBomb(randomI,randomJ,arrayCubes);
            compteur++;
        } 
    }
}


function onPointerMove( event ) {
    event.preventDefault();
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;



}

function selectCube( cube ) {
    if(cube._hasBomb){alert("perdu")}
    else{
        let textGeo;
        let textNumber = cube._numberNeighboorBomb.toString();
        console.log(textNumber);
        loader.load( './ressources/font/droid_sans_mono_regular.typeface.json', function ( font ) {

            textGeo = new THREE.TextGeometry( textNumber, {
                font: font,
                size: 1,
                height: 0.1,
                // curveSegments: 12,
                // bevelEnabled: true,
                // bevelThickness: 10,
                // bevelSize: 8,
                // bevelOffset: 0,
                // bevelSegments: 5
            } );
            textGeo.computeBoundingBox();
            //const textMesh = new THREE.Mesh( textGeo, materialDigit );
            cube._mesh.geometry.dispose();
            cube._mesh.geometry = textGeo;

        } );
        
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

Array.matrix = function(numrows, numcols, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}

function setNeighboorBomb(i,j,arrayCubes){

    if(i>0){
        arrayCubes[i-1][j].addBombNeighboor();
        if(j>0){
            arrayCubes[i-1][j-1].addBombNeighboor();
            arrayCubes[i][j-1].addBombNeighboor();
        }
        if(j<size-1){
            arrayCubes[i-1][j+1].addBombNeighboor();
            arrayCubes[i][j+1].addBombNeighboor();
        }
    }

    if(i<size-1){
        arrayCubes[i+1][j].addBombNeighboor();
        if(j>0){
            arrayCubes[i+1][j-1].addBombNeighboor();
        }
        if(j<size-1){
            arrayCubes[i+1][j+1].addBombNeighboor();
        }
    }

}

function getCubeById(id){
    for(let i = 0; i<size ; i++){
        for(let j = 0 ; j<size ; j++){
            if(cubes[i][j].getId()== id) return cubes[i][j];
        }
    }
    return false;
}



//Import modules
//import {Cube} from "./Cube.js"

//Variables Jeux
const size = 4;
const length = 1;
const pas = 0.5;
const height = 1;
const width = 1;

let INTERSECTED;
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

//DomEvents
var domEvents	= new THREEx.DomEvents(camera, renderer.domElement)


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//cube
const geometry = new THREE.BoxGeometry();

//plateau
const sizePlateau = size*length+(size-1)*pas+2*pas;
const materialPlateau = new THREE.MeshLambertMaterial({
    color:  0x581845 ,
    flatShading: true
});
const geometryRect = new THREE.BoxGeometry(sizePlateau,sizePlateau,0.1);

//Cubes
const cubes = [[],[],[],[]];


const render = function () {
    requestAnimationFrame( render );

    // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );


    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;

            if(INTERSECTED.name == 'rectangle'){
                INTERSECTED = null;
            } else{
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex( 0xff0000 );
            }
            
            

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

    }
    controls.update();

    renderer.render(scene, camera);
};

//Initialisation
document.addEventListener( 'mousemove', onPointerMove );

createMap(size,length,pas);
setBombsMap(size,cubes);

console.log(cubes);
render();






