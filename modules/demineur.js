import {Cube} from "../modules/Cube.js"
import {MiniCube} from "../modules/MiniCube.js"

//plateau Material

const materialPlateau = new THREE.MeshStandardMaterial({
    color: 0xf1d00a ,
    flatShading: true
});

const materialTransparent = new THREE.MeshStandardMaterial({
    color: 0xf1d00a ,
    flatShading: true,
    transparent:true,
    opacity:0.0
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
 const MaxNumberMiniCubes = numberMiniCubes*3;
 let maxSpeed = 0.5;
 let maxRotation = .1;

 let IdCubeSelected;

 export function setSpeedMiniCubes(newSpeed,newRotation){
     maxSpeed = newSpeed;
     maxRotation = newRotation;
 }

export function setIdCubeSelected(id){IdCubeSelected = id}

///Functions
export function createMap(size,height,width,pas,cubes,holder,domEvents,miniCubes,sizeMiniCube,scene){
    let totalLength = size*width+(size-1)*pas;
    for (let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++){
            const geometry = new THREE.BoxGeometry(width,height,width);
            const material = new THREE.MeshLambertMaterial({
                color: palette[Math.floor(Math.random()*palette.length)]   ,
                
            });
            const object = new THREE.Mesh(geometry, material);
            object.position.x =  i*width + i*pas ;
            object.position.y =  j*width + j*pas;
            object.position.z = 0
            object.name = "cube";
            holder.add(object);
            cubes[i].push(new Cube(height,width,object, object.id));
            domEvents.addEventListener(object, 'click', function(){selectCube(cubes[i][j],miniCubes,sizeMiniCube,scene)}, false)
            
        }
    }
    const sizePlateau = size*width+(size-1)*pas+2*pas;
    const heightPlateau = height/10
    const geometryRect = new THREE.BoxGeometry(sizePlateau,sizePlateau,heightPlateau);
    let rectangle = new THREE.Mesh(geometryRect,materialPlateau);
    rectangle.position.x = pas + Math.floor(totalLength/2);
    rectangle.position.y = pas + Math.floor(totalLength/2);
    rectangle.position.z = -heightPlateau*10;
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
    for(let i = 0; i<cubes.length ; i++){
        for(let j = 0 ; j<cubes.length ; j++){
            if(cubes[i][j].getId()== id) return cubes[i][j];
        }
    }
    return false;
}
export function getIJByID(id,cubes){
    for(let i = 0; i<cubes.length ; i++){
        for(let j = 0 ; j<cubes.length; j++){
            if(cubes[i][j].getId()== id) return i,j;
        }
    }
    return false;
}


export  function selectCube( cube ,miniCubes,sizeMiniCube,scene) {
    if(cube._hasBomb){
      createMiniCubes(cube,miniCubes,sizeMiniCube,scene);
      cube._mesh.material.dispose();
      cube._mesh.material = materialTransparent;
      //scene.remove(cube._mesh);
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
        let textWidth = cube._width;
        let textHeight = cube._height/10
        loader.load( './ressources/font/droid_sans_mono_regular.typeface.json', function ( font ) {

            textGeo = new THREE.TextGeometry( textNumber, {
                font: font,
                size: textWidth,
                height: textHeight,
                
            } );
            textGeo.computeBoundingBox();
            cube._mesh.geometry.dispose();
            cube._mesh.geometry = textGeo;
            cube._mesh.name = "text";

        } );
    }
}

export  function createMiniCubes(cube,miniCubes,sizeMiniCube,scene){
    if(miniCubes.length > MaxNumberMiniCubes){
        miniCubes.splice(miniCubes[0],numberMiniCubes);
        for(let i = 0; i<numberMiniCubes ; i++){
            miniCubes[i]._mesh.material.dispose();
            miniCubes[i]._mesh.material = materialTransparent;
        }
        
    }
    for (let i = 0; i < numberMiniCubes; i++) {
        const miniCube = new MiniCube(sizeMiniCube,maxSpeed,maxRotation,palette[Math.floor(Math.random()*palette.length)]);
        miniCube._mesh.position.x = cube._mesh.position.x;
        miniCube._mesh.position.y = cube._mesh.position.y;
        miniCube._mesh.position.z = cube._mesh.position.z;
        miniCubes.push(miniCube);
        scene.add(miniCube._mesh);
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