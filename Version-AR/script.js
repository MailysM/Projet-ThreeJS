import {ARButton} from "../modules/ARButton.js"

import {Cube} from "../modules/Cube.js"
import {MiniCube} from "../modules/MiniCube.js"

let container;
let controller;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

let mapPositionne = false;


//Déclaration des constantes
 const loader = new THREE.FontLoader();
////////            Constantes          ///////
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
 const cubes = [[],[],[],[]];

//MiniCubes pour la fin
 const miniCubes = [];

 let INTERSECTED;
 const scene = new THREE.Scene();

 const aspect = window.innerWidth / window.innerHeight;
 const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );


 const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
 const controls = new THREE.MapControls( camera , renderer.domElement );

// spotlights
 const spotLight1 = new THREE.SpotLight(0xffffff);
 const spotLight2 = new THREE.SpotLight(0xffffff);


 const raycaster = new THREE.Raycaster();
 const pointer = new THREE.Vector2();

//DomEvents
 const domEvents	= new THREEx.DomEvents(camera, renderer.domElement);

//Booleens pour la fin de partie
 const tester = true;

//Group de tous les objets de la scene
 const holder = new THREE.Group();


init();
animate();

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
            holder.add(object);
            cubes[i].push(new Cube(height,width,object, object.id));
            domEvents.addEventListener(object, 'click', function(){selectCube(cubes[i][j],cubes)}, false)
            
        }
    }
    let rectangle = new THREE.Mesh(geometryRect,materialPlateau);
    rectangle.position.x = pas - pas/3;
    rectangle.position.y = pas + Math.floor(totalLength/2);;
    rectangle.position.z = -0.5;
    rectangle.name = "rectangle";
    holder.add(rectangle);

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
      holder.remove(cube._mesh);
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
    holder.add(miniCube._mesh);
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

//Fonctions pour le rendu

 function init_demineur(){
  //scene.background = new THREE.Color( 0xcccccc );


  camera.position.set( 10, 10, 8 );


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


  spotLight1.position.set(200, 100, 100);
  holder.add(spotLight1);

  spotLight2.position.set(-200, -100, 100);
  holder.add(spotLight2);

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //Initialisation
  document.addEventListener( 'mousemove', onPointerMove );
}

 const render_demineur = function () {
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


//Fonction pas à moi

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    light.position.set( 0.5, 1, 0.25 );
    holder.add( light );

    //

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );

    //

    document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );

    //

    const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );

    function onSelect() {

        if ( reticle.visible ) {

            holder.position.setFromMatrixPosition(reticle.matrix);
            holder.visible = true;
            reticle.visible = false;

        }

    }

    //Positionne bien le plateau


    controller = renderer.xr.getController( 0 );
    controller.addEventListener( 'select', onSelect );
    scene.add( controller );

    reticle = new THREE.Mesh(
        new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
        new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add( reticle );

    //

    window.addEventListener( 'resize', onWindowResize );

    holder.visible = false;

    createMap();
    setBombsMap();

    scene.add(holder);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    renderer.setAnimationLoop( render );

}

function render( timestamp, frame ) {

    if ( frame ) {

        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if ( hitTestSourceRequested === false ) {

            session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {

                session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {

                    hitTestSource = source;

                } );

            } );

            session.addEventListener( 'end', function () {

                hitTestSourceRequested = false;
                hitTestSource = null;

            } );

            hitTestSourceRequested = true;

        }

        if ( hitTestSource) {

            const hitTestResults = frame.getHitTestResults( hitTestSource );

            if ( hitTestResults.length ) {

                const hit = hitTestResults[ 0 ];

                reticle.visible = true;
                reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );
                mapPositionne = true;

            } else {

                reticle.visible = false;

            }

        }

    }

    renderer.render( scene, camera );

}