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

export {Cube}