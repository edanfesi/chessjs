class Box {
    constructor (x, y, piece) {
        this.x = x;
        this.y = y;
        this.piece = piece;
    }

    getPiece() {
        return this.piece || {};
    }

    setPiece(piece) {
        this.piece = piece;
    }
}