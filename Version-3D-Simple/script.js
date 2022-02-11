
import * as DEMINEUR from "../modules/demineur.js"


//Constantes
//Variables Jeux
const size = 10;
const sizeMiniCube = .2;
const pas = .5;
const height = 1;
const width = 1;
//Cubes
let cubes ;

//MiniCubes pour la fin
const miniCubes = [];



 let INTERSECTED;
 const scene = new THREE.Scene();

 const aspect = window.innerWidth / window.innerHeight;
 const camera = new THREE.PerspectiveCamera( 70,aspect,0.1, 100 );


 const renderer = new THREE.WebGLRenderer();
 const controls = new THREE.MapControls( camera , renderer.domElement );

// spotlights
 const spotLight1 = new THREE.SpotLight(0xffffff);
 const spotLight2 = new THREE.SpotLight(0xffffff);


 const raycaster = new THREE.Raycaster();
 const pointer = new THREE.Vector2();


//Group de tous les objets de la scene
 const holder = new THREE.Group();

 //DOM EVent
 const domEvents	= new THREEx.DomEvents(camera, renderer.domElement);


 //HTML pour victoire
 const popup_alert_gagner = '<div id="alert" >\
 <div id = "alert-contenu" ></div>\
 Vous avez gagnez \
 <button id = "bouton-retry">Rejouer</button>\
 </div>';


//Fonctions pour le rendu

 function init(){
  scene.background = new THREE.Color( 0xcccccc );


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


  spotLight1.position.set(200, 100, 100);
  holder.add(spotLight1);

  spotLight2.position.set(-200, -100, 100);
  holder.add(spotLight2);

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //Initialisation
  document.addEventListener( 'mousemove', onPointerMove );

  cubes = DEMINEUR.createMap(size,height,width,pas,cubes,holder,domEvents,miniCubes,sizeMiniCube,scene);
  
  DEMINEUR.setBombsMap(size,cubes);

  scene.add(holder);

}



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
              DEMINEUR.setIdCubeSelected(INTERSECTED.id);
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
    if(DEMINEUR.testGagner(cubes) ){
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

function onPointerMove( event ) {
  event.preventDefault();
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

init();
render();











