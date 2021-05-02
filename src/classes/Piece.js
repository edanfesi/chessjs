class Piece {
    constructor (x = 0, y = 0, killed = false, isWhite = true) {
        this.posX = x;
        this.posY = y;
        this.killed = killed;
        this.isWhite = isWhite;
    }

    setX(posX) {
        this.posX = posX
    }

    getX() {
        return this.posX;
    }

    setY(posY) {
        this.posY = posY;
    }

    getY() {
        return this.posY;
    }

    isKilled() {
        return this.killed;
    }

    setKilled(killed) {
        this.killed = killed;
    }

    isWhite() {
        return this.isWhite;
    }

    setIsWhite(isWhite) {
        this.isWhite = isWhite;
    }
}