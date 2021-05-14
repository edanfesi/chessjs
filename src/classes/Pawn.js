import Piece from './Piece';

class Pawn extends Piece {
    constructor (isWhite = true, killed = false) {
        super(isWhite, killed);

        this.sprite = isWhite ? '♙' : '♟︎';
        this.playerSide = isWhite ? -1 : 1;
        this.isFirstMove = true;
    }

    getPossibleMoves(position, board) {
        const [posX, posY] = position;
        let moves = [];

        // Normal movement
        for (let y = 1; y <= (this.isFirstMove ? 2 : 1); y++) {
            const move = [posX, posY + (this.playerSide * y)];
            if (board.isValidMove(position, [move[0], move[1]], false)) {
                moves = moves.concat([move]);
            }
        }

        // Attack Movement
        const currentPiece = board.getCell(posX, posY).getPiece();
        for (let x = 0; x < 2; x++) {
            const move = [posX + (x ? 1 : -1), posY + this.playerSide];
            const spectedCell = board.getCell(move[0], move[1]);

            if (spectedCell) {
                const piece = spectedCell.getPiece();
                if (piece && piece.getColor() != currentPiece.getColor()) {
                    moves = moves.concat([move]);
                }
            }
        }

        return moves;
    }
}

export default Pawn;