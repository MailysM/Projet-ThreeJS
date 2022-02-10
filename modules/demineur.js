import {Cube} from "../modules/Cube.js"
import {MiniCube} from "../modules/MiniCube.js"

//plateau Material

const materialPlateau = new THREE.MeshStandardMaterial({
    color: 0xf1d00a ,
    flatShading: true
});

//Palettes couleur
const palette = [0xb0c4de,0xb0e0e6,0xadd8e6,0x87ceeb,0x87cefa,0x00bfff,0x1e90ff,0x6495ed,0x4682b4]

//Loader Font
const loader = new THREE.FontLoader();

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

 const numberMiniCubes = 50;
 const maxSpeed = 0.5;
 const maxRotation = .1;

 let IdCubeSelected;

export function setIdCubeSelected(id){IdCubeSelected = id}

///Functions
export function createMap(size,length,height,width,pas,cubes,holder,domEvents,miniCubes,sizeMiniCube,scene){
    let totalLength = size*length+(size-1)*pas;
    for (let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++){
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshLambertMaterial({
                color: palette[Math.floor(Math.random()*palette.length)]   ,
                
            });
            const object = new THREE.Mesh(geometry, material);
            object.position.x =  i + i*pas - Math.floor(totalLength/2);
            object.position.y =  j + j*pas;
            object.name = "cube";
            holder.add(object);
            cubes[i].push(new Cube(height,width,object, object.id));
            domEvents.addEventListener(object, 'click', function(){selectCube(cubes[i][j],miniCubes,sizeMiniCube,scene)}, false)
            
        }
    }
    const sizePlateau = size*length+(size-1)*pas+2*pas;
    const geometryRect = new THREE.BoxGeometry(sizePlateau,sizePlateau,0.1);
    let rectangle = new THREE.Mesh(geometryRect,materialPlateau);
    rectangle.position.x = pas - pas/3;
    rectangle.position.y = pas + Math.floor(totalLength/2);;
    rectangle.position.z = -0.5;
    rectangle.name = "rectangle";
    holder.add(rectangle);

}

export  function setBombsMap(size,cubes){
    const totalNumberBombs = Math.floor(size*size/8) + 1;
    let compteur = 0;
    while(compteur < totalNumberBombs){
        let randomI = getRandomInt(0,size-1);
        let randomJ = getRandomInt(0,size-1);
        
        if(cubes[randomI][randomJ]._hasBomb==false){
            cubes[randomI][randomJ].setBomb(true);
            setNeighboorBomb(randomI,randomJ,cubes);
            compteur++;
        } 
    }
}

export  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

export  function setNeighboorBomb(i,j,cubes){

    if(i>0){
        cubes[i-1][j].addBombNeighboor();
        if(j>0){
            cubes[i-1][j-1].addBombNeighboor();
          cubes[i][j-1].addBombNeighboor();
        }
        if(j<cubes.length-1){
            cubes[i-1][j+1].addBombNeighboor();
            cubes[i][j+1].addBombNeighboor();
        }
    }

    if(i<cubes.length-1){
        cubes[i+1][j].addBombNeighboor();
        if(j>0){
            cubes[i+1][j-1].addBombNeighboor();
        }
        if(j<cubes.length-1){
            cubes[i+1][j+1].addBombNeighboor();
        }
    }

}


export function getCubeById(id,cubes){
    for(let i = 0; i<size ; i++){
        for(let j = 0 ; j<size ; j++){
            if(cubes[i][j].getId()== id) return cubes[i][j];
        }
    }
    return false;
}


export  function selectCube( cube ,miniCubes,sizeMiniCube,scene) {
    if(cube._hasBomb){
      createMiniCubes(cube,miniCubes,sizeMiniCube,scene);
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

export  function createMiniCubes(cube,miniCubes,sizeMiniCube,scene){
  for (var i = 0; i < numberMiniCubes; i++) {
    const miniCube = new MiniCube(sizeMiniCube,maxSpeed,maxRotation,palette[Math.floor(Math.random()*palette.length)]);
    miniCube._mesh.position.x = cube._mesh.position.x;
    miniCube._mesh.position.y = cube._mesh.position.y;
    miniCube._mesh.position.z = cube._mesh.position.z;
    miniCubes.push(miniCube);
    scene.add(miniCube._mesh);
    console.log("ok")
  }
}

export  function testGagner(cubes){
  for (let i = 0; i < cubes.length; i++) {
    for(let j = 0; j < cubes.length; j++){
      if(cubes[i][j]._mesh.name == "cube" && cubes[i][j]._hasBomb== false){return false}
    }
  }

  return true;
}