import {ARButton} from "../modules/ARButton.js"


import * as DEMINEUR from "../modules/demineur.js"

let container;
let controller;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;
let mapOK = false;

let INTERSECTED;

//Constantes
//Variables Jeux
 const size = 4;
 const sizeMiniCube = .02;
 const pas = .05;
 const height = 0.1;
 const width = 0.1;
 const maxSpeed = 0.05;
 const maxRotation = .1;
//Cubes
let cubes ;

//MiniCubes pour la fin
const miniCubes = [];

let cubeSelected =null; 

const scene = new THREE.Scene();

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 70,aspect,0.1, 100 );

//RayCaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );

//Group de tous les objets de la scene
const holder = new THREE.Group();

//DOM EVent
const domEvents = new THREEx.DomEvents(camera, renderer.domElement);


function onPointerTouch( event ) {
    if(cubeSelected!=null){
        DEMINEUR.selectCube(cubeSelected,miniCubes,sizeMiniCube,holder)
    }
    
  
  }

  function onSelect() {

    if ( reticle.visible ) {
        
        holder.position.setFromMatrixPosition(reticle.matrix);
        holder.rotation.x = -Math.PI/2;
        holder.visible = true;
        reticle.visible = false;
        mapOK = true;
        

        this.addEventListener('select',onPointerTouch,false)
        this.removeEventListener('select', onSelect);
        //addEventListenerCubes();

    }

}



//Fonction pas à moi

function init() {

    DEMINEUR.setSpeedMiniCubes(maxSpeed,maxRotation);
    

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

    //ARButton
    document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );
    

    

    //Positionne bien le plateau

    controller = renderer.xr.getController( 0 );
    controller.addEventListener( 'select', onSelect);
    container.addEventListener( 'touchstart', onPointerTouch );
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

    cubes = DEMINEUR.createMap(size,height,width,pas,cubes,holder,domEvents,miniCubes,sizeMiniCube,scene);
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
        //Animate Minicubes if they are any
        miniCubes.forEach(miniCube => {
            miniCube.move();
        });

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
        if(!mapOK){
            if ( hitTestSource) {

                const hitTestResults = frame.getHitTestResults( hitTestSource );
    
                if ( hitTestResults.length ) {
    
                    const hit = hitTestResults[ 0 ];
    
                    reticle.visible = true;
                    reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );
                    
                
                } else {
                    holder.visible = false;
                    reticle.visible = false;
    
                }
    
            }

            
        }

        
        // // update the picking ray with the camera and pointer position
        raycaster.setFromCamera( pointer, camera );

        // calculate objects intersecting the picking ray
         const intersects = raycaster.intersectObjects( scene.children );
        if ( intersects.length > 0 ) {

             if ( INTERSECTED != intersects[ 0 ].object ) {
    
                 if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    
                 INTERSECTED = intersects[ 0 ].object;
    
                 if(INTERSECTED.name == 'cube'){
                    cubeSelected = DEMINEUR.getCubeById(INTERSECTED.id,cubes)
                    
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

    }

    renderer.render( scene, camera );

}

init();
animate();