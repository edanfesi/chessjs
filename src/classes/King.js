import Piece from './Piece';

class King extends Piece {
    constructor (isWhite = true, killed = false) {
        super(isWhite, killed);

        this.sprite = isWhite ? '♔' : '♚';
    }

    getPossibleMoves(position, board) {
        const [posX, posY] = position;

        const possibleDirections = [
            [posX, posY - 1],     // Up
            [posX, posY + 1],     // Down
            [posX + 1, posY],     // Right
            [posX - 1, posY],     // Left
            [posX - 1, posY - 1], // Up left
            [posX + 1, posY - 1], // Up right
            [posX - 1, posY + 1], // Down right
            [posX + 1, posY + 1], // Down left
        ]

        return possibleMoves.filter(move => board.isValidMove(position, [move[0], move[1]], false));
    }
}

export default King;