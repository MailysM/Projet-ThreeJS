import {Cube} from "./modules/Cube.js"
import {MiniCube} from "./modules/MiniCube.js"


///Functions
function createMap(){
    let totalLength = size*length+(size-1)*pas;
    for (let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++){
            const material = new THREE.MeshLambertMaterial({
                color: palette[Math.floor(Math.random()*palette.length)]   ,
                
            });
            const object = new THREE.Mesh(geometry, material);
            object.position.x =  i + i*pas - Math.floor(totalLength/2);
            object.position.y =  j + j*pas;
            object.name = "cube";
            scene.add(object);
            cubes[i].push(new Cube(height,width,object, object.id));
            domEvents.addEventListener(object, 'click', function(){selectCube(cubes[i][j],cubes)}, false)
            
        }
    }
    let rectangle = new THREE.Mesh(geometryRect,materialPlateau);
    rectangle.position.x = pas - pas/3;
    rectangle.position.y = pas + Math.floor(totalLength/2);;
    rectangle.position.z = -0.5;
    rectangle.name = "rectangle";
    scene.add(rectangle);

}

function setBombsMap(){
    const totalNumberBombs = Math.floor(size*size/8) + 1;
    let compteur = 0;
    while(compteur < totalNumberBombs){
        console.log(compteur)
        let randomI = getRandomInt(0,size-1);
        let randomJ = getRandomInt(0,size-1);
        
        if(cubes[randomI][randomJ]._hasBomb==false){
            cubes[randomI][randomJ].setBomb(true);
            setNeighboorBomb(randomI,randomJ);
            compteur++;
        } 
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

function setNeighboorBomb(i,j){

    if(i>0){
        cubes[i-1][j].addBombNeighboor();
        if(j>0){
            cubes[i-1][j-1].addBombNeighboor();
          cubes[i][j-1].addBombNeighboor();
        }
        if(j<size-1){
            cubes[i-1][j+1].addBombNeighboor();
            cubes[i][j+1].addBombNeighboor();
        }
    }

    if(i<size-1){
        cubes[i+1][j].addBombNeighboor();
        if(j>0){
            cubes[i+1][j-1].addBombNeighboor();
        }
        if(j<size-1){
            cubes[i+1][j+1].addBombNeighboor();
        }
    }

}


function getCubeById(id,cubes){
    for(let i = 0; i<size ; i++){
        for(let j = 0 ; j<size ; j++){
            if(cubes[i][j].getId()== id) return cubes[i][j];
        }
    }
    return false;
}

function onPointerMove( event ) {
    event.preventDefault();
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function selectCube( cube,cubes ) {
    if(cube._hasBomb){
      createMiniCubes(cube);
      cube._mesh.geometry.dispose();
      cube._mesh.material.dispose();
      scene.remove(cube._mesh);
      if(!document.getElementById("alert")){
        $("body").append(popup_alert);
      }

      $(document.getElementById("alert")).removeClass("alert-fin").addClass("alert-entree");
      $('#bouton-retry').on('click', function() {
        location.reload();
        
      });
    }
    else{
        let textGeo;
        let textNumber = cube._numberNeighboorBomb.toString();
        loader.load( './ressources/font/droid_sans_mono_regular.typeface.json', function ( font ) {

            textGeo = new THREE.TextGeometry( textNumber, {
                font: font,
                size: 1,
                height: 0.1,
                
            } );
            textGeo.computeBoundingBox();
            cube._mesh.geometry.dispose();
            cube._mesh.geometry = textGeo;
            cube._mesh.name = "text";

        } );
    }
}

function createMiniCubes(cube){
  for (var i = 0; i < numberMiniCubes; i++) {
    const miniCube = new MiniCube(sizeMiniCube,maxSpeed,maxRotation,palette[Math.floor(Math.random()*palette.length)]);
    miniCube._mesh.position.x = cube._mesh.position.x;
    miniCube._mesh.position.y = cube._mesh.position.y;
    miniCube._mesh.position.z = cube._mesh.position.z;
    miniCubes.push(miniCube);
    scene.add(miniCube._mesh);
  }
}

function clearScene(){
  for (let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++){
      cubes[i][j]._mesh.geometry.dispose();
      cubes[i][j]._mesh.geometry = new THREE.BoxGeometry();
      cubes[i][j]._mesh.name = "text";
      cubes[i][j]._hasBomb = false;
    }
  }
}

function testGagner(test = true){
  for (let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++){
      if(cubes[i][j]._mesh.name == "cube" && cubes[i][j]._hasBomb== false && test){return false}
    }
  }
  console.log(true);
  return true;
}

//Déclaration des constantes
const loader = new THREE.FontLoader();
//Constantes
//Variables Jeux
const size = 4;
const sizeMiniCube = .2;
const length = 1;
const pas = .5;
const height = 1;
const width = 1;
const numberMiniCubes = 50;
const maxSpeed = 0.5;
const maxRotation = .1;
//Elements HTML poour la fin

const popup_alert = '<div id="alert" >\
<div id = "alert-contenu" ></div>\
Vous avez perdu \
<button id = "bouton-retry">Rejouer</button>\
</div>';

const popup_alert_gagner = '<div id="alert" >\
<div id = "alert-contenu" ></div>\
Vous avez gagnez \
<button id = "bouton-retry">Rejouer</button>\
</div>';
//cube
const geometry = new THREE.BoxGeometry();
//plateau
const sizePlateau = size*length+(size-1)*pas+2*pas;
const materialPlateau = new THREE.MeshStandardMaterial({
    color: 0xf1d00a ,
    flatShading: true
});
const geometryRect = new THREE.BoxGeometry(sizePlateau,sizePlateau,0.1);
//Palettes couleur
const palette = [0xb0c4de,0xb0e0e6,0xadd8e6,0x87ceeb,0x87cefa,0x00bfff,0x1e90ff,0x6495ed,0x4682b4]
//Cubes
let cubes = [[],[],[],[]];

//MiniCubes pour la fin
const miniCubes = [];

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

// controls.mouseButtons = {
// 	LEFT: null,
// 	MIDDLE: THREE.MOUSE.DOLLY,
// 	RIGHT: null
// }
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true;

controls.minPolarAngle = 2.35;
controls.maxPolarAngle = 2.35;
controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = 0;

// spotlights
const spotLight1 = new THREE.SpotLight(0xffffff);
spotLight1.position.set(200, 100, 100);
scene.add(spotLight1);
const spotLight2 = new THREE.SpotLight(0xffffff);
spotLight2.position.set(-200, -100, 100);
scene.add(spotLight2);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

//DomEvents
var domEvents	= new THREEx.DomEvents(camera, renderer.domElement)

let tester = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const render = function () {
  requestAnimationFrame( render );

  //Animate Minicubes if they are any
  miniCubes.forEach(miniCube => {
    miniCube.move();
  });

  // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );


    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;

            if(INTERSECTED.name == 'cube'){
              INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
              INTERSECTED.material.emissive.setHex( 0xff0000 );
            } else{
               INTERSECTED = null;
            }
            
            

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

    }

    //Test pour savoir si le jeu est gagné
    if(testGagner(tester) ){
      tester = false;
      if(!document.getElementById("alert")){
        $("body").append(popup_alert_gagner);
      }

      $(document.getElementById("alert")).removeClass("alert-fin").addClass("alert-entree");
      $('#bouton-retry').on('click', function() {
        location.reload();
      });
    }
    controls.update();

    renderer.render(scene, camera);
};

//Initialisation
document.addEventListener( 'mousemove', onPointerMove );

createMap();
setBombsMap();

render();









