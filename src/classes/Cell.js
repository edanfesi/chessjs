class Cell {
    constructor (piece) {
        this.possibleMove = false;
        this.piece = piece;
    }

    getPiece() {
        return this.piece;
    }

    setPiece(piece) {
        this.piece = piece;
    }

    isAvailable() {
        return !this.piece;
    }

    setPossibleMove(isPossible) {
        this.possibleMove = isPossible;
    }

    isPossibleMove() {
        return this.possibleMove;
    }

    clean() {
        this.piece = null;
    }

    toString() {
        return this.piece;
    }
}

export default Cell;