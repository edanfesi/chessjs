class Piece {
    constructor (isWhite = true, killed = false, sprite = '') {
        this.killed = killed;
        this.isWhite = isWhite;
        this.sprite = sprite;
        this.color = isWhite ? "#dcdde1" : "#353b48";
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

    getColor() {
        return this.color;
    }

    getPossibleMoves(position, _) {
        const [posX, posY] = position;
        console.log(`Possible moves from pos (${posX}, ${posY}): []`);
    }

    _getPossibleMovesFromDirection(position, direction, board) {
        const [posX, posY] = position;
        const [dirX, dirY] = direction;

        let moves = [];
        for (let x = 0; x < board.getColumns(); x++) {
            const move = [posX + (x * dirX), posY + (x * dirY)]
            if (!board.isValidMove(position, move, false)) {
                break;
            }

            moves += [move];
        }

        return moves;
    }

    toString() {
        return this.sprite;
    }
}

export default Piece;