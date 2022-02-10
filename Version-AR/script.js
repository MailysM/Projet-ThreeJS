import {ARButton} from "../modules/ARButton.js"


import * as DEMINEUR from "../modules/demineur.js"

let container;
let controller;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

let mapPositionne = false;


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
//Cubes
const cubes = [[],[],[],[]];

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



//Fonctions pour le rendu

 function init_1(){
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

 const render_01 = function () {
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
            holder.rotation.x = -Math.PI/2;
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

    DEMINEUR.createMap(size,length,height,width,pas,cubes,holder,domEvents,miniCubes,sizeMiniCube,scene);
    DEMINEUR.setBombsMap(size,cubes);
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
                holder.position.setFromMatrixPosition(reticle.matrix);
                holder.rotation.x = -Math.PI/2;
                holder.visible = true;
                mapPositionne = true;

            } else {
                holder.visible = false;
                reticle.visible = false;

            }

        }

    }

    renderer.render( scene, camera );

}

init();
animate();