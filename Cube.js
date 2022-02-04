class Cube {
    constructor(height, width,i,j, mesh) {
		this._height = height;
		this._width = width;
		this._i = i;
		this._j = j;
        this._hasBomb = false;
        this._mesh = mesh;
        this._numberNeighboorBomb = 0;
	}

    getBombe(){return this._hasBomb;}

    setBombe(hasBombe){
        this._hasBomb = hasBomb;
    }

}

module.exports = Cube