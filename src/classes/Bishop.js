import Piece from './Piece';

class Bishop extends Piece {
    constructor (isWhite = true, killed = false) {
        super(isWhite, killed);

        this.sprite = isWhite ? '♗' : '♝';
    }

    getPossibleMoves(position, board) {
        const possibleDirections = [
            [-1, -1], // Up left
            [+1, -1], // Up right
            [-1, +1], // Down right
            [+1, +1], // Down left
        ]

        return possibleDirections.reduce((acc, dir) => 
            acc + this._getPossibleMovesFromDirection(position, [dir[0], dir[1]], board)
        , []);
    }
}

export default Bishop;