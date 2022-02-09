class MiniCube  {
	
	constructor(size,MAX_SPEED,MAX_ROT,couleur) {

	
        this._vitesseX = Math.random()*MAX_SPEED*2 - MAX_SPEED ;
        this._vitesseY = Math.random()*MAX_SPEED*2 - MAX_SPEED ;
        this._vitesseZ = Math.abs(Math.random()*MAX_SPEED*2 - MAX_SPEED);

        this._rotationX = Math.random()*MAX_ROT*2 - MAX_ROT;
        this._rotationZ = Math.random()*MAX_ROT*2 - MAX_ROT;
        const geometry = new THREE.BoxGeometry(size,size,size);
        const material =  new THREE.MeshPhongMaterial({
            color:  couleur ,
            flatShading: true
        });
        this._mesh = new THREE.Mesh(geometry, material);

	}

    move(){

        this._mesh.position.x += this._vitesseX;
        this._mesh.position.y += this._vitesseY;
        this._mesh.position.z += this._vitesseZ;
    
        this._mesh.rotation.x += this._rotationX;
        this._mesh.rotation.z += this._rotationZ;

	}
}

export {MiniCube}
