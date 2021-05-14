import Piece from './Piece';

class Knight extends Piece {
    constructor (isWhite = true, killed = false) {
        const sprite = isWhite ? '♘' : '♞';

        super(isWhite, killed, sprite);
    }

    getPossibleMoves(position, board) {
        const [posX, posY] = position;
        const possibleMoves = [
            [posX - 1, posY - 2], // Up left
            [posX + 1, posY - 2], // Up right
            [posX + 2, posY - 1], // Right up
            [posX + 2, posY + 1], // Right down
            [posX + 1, posY + 2], // Down right
            [posX - 1, posY + 2], // Down left
            [posX - 2, posY + 1], // Left down
            [posX - 2, posY - 1], // Left up
        ]

        return possibleMoves.filter(move => board.isValidMove(position, [move[0], move[1]], false));
    }
}

export default Knight;