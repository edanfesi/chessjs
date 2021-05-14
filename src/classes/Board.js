import Cell from './Cell';
import Pawn from './Pawn';
import Rock from './Rock';
import King from './King';
import Queen from './Queen';
import Knight from './Knight';
import Bishop from './Bishop';

class Board {
    constructor (width = 700, height = 700, rows = 8, columns = 8) {
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.columns = columns;

        this.cells = this._makeCellsData(rows, columns);
        this.CELL_WIDTH = width / columns;
        this.CELL_HEIGHT = height / rows;

        this.canvas = document.createElement('canvas');
        this.canvas.addEventListener('click', (event) => { this._selectCell(event) });

        this.canvasContext = this.canvas.getContext('2d');

        this.canvas.id = 'game-board'
        this.canvas.width = width;
        this.canvas.height = height;

        this._game_board_container = document.getElementById('game-board-container');
        this._game_board = null;
        this._game_board_left = 0;
        this._game_board_top = 0;

        this._possibleMoves = [];
    }

    getColumns() {
        return this.columns;
    }  

    render () {
        this.cells.forEach(((col, idx) => {
            col.forEach((_, idy) => {
                const cellColor = this._getCellColor(idx, idy);
                const textColor = this._getTextColor(idx, idy);

                this._drawCell(idx, idy, cellColor, textColor);
            });
        }));

        this._game_board_container.appendChild(this.canvas);
        this._game_board = document.getElementById('game-board');
        this._game_board_left = this._game_board.offsetLeft + this._game_board.clientLeft;
        this._game_board_top = this._game_board.offsetTop + this._game_board.clientTop;
    }

    set_player (isP1) {
        const playerSide = isP1 ? this.rows - 1 : 0;
        console.log(`player side ${playerSide} ${Math.abs(1 - playerSide)}`);

        // Rock Setup
        this.cells[0][Math.abs(playerSide)].setPiece(new Rock(isP1));
        this.cells[this.columns - 1][Math.abs(playerSide)].setPiece(new Rock(isP1));

        // Knight Setup
        this.cells[1][Math.abs(playerSide)].setPiece(new Knight(isP1));
        this.cells[this.columns - 2][Math.abs(playerSide)].setPiece(new Knight(isP1));

        // Bishop Setup
        this.cells[2][Math.abs(playerSide)].setPiece(new Bishop(isP1));
        this.cells[this.columns - 3][Math.abs(playerSide)].setPiece(new Bishop(isP1));

        // Queen Setup
        this.cells[3][Math.abs(playerSide)].setPiece(new Queen(isP1));
        
        // King Setup
        this.cells[4][Math.abs(playerSide)].setPiece(new King(isP1));

        // Pawns Setup
        for (let col = 0; col < this.columns; col++) {
            this.cells[col][Math.abs(1 - playerSide)].setPiece(new Pawn(isP1));
        }

        this.render();
    }

    isValidMove(origin, move, canJump) {
        const [moveX, moveY] = move;

        if (moveX <= 0 
            || moveY <= 0
            || moveX >= this.columns 
            || moveY >= this.rows
        ) {
            return false;
        }

        const currentCell = this.cells[moveX][moveY];
        const currentPiece = currentCell.getPiece();
        if (currentCell.isAvailable()) {
            currentCell.setPossibleMove(true);
            return true;
        }


        const [originX, originY] = origin;
        const pieceToMove = this.cells[originX][originY].getPiece();

        console.log(`diff colors ${currentPiece.getColor() !== pieceToMove.getColor()}, canJump ${canJump}`)
        if (currentPiece.getColor() !== pieceToMove.getColor() || canJump) {
            currentCell.setPossibleMove(true);

            return true;
        }

        return false;
    }

    getCell(posX, posY) {
        if (posX <= 0 
            || posY <= 0
            || posX >= this.columns 
            || posY >= this.rows
        ) {
            return null;
        }

        return this.cells[posX][posY];
    }

    _selectCell(event) {
        const posX = this.columns - Math.trunc((this.width - event.pageX) / this.CELL_WIDTH) - 1;
        const posY = this.rows - Math.trunc((this.height - event.pageY) / this.CELL_HEIGHT) - 1;

        this._validatePiece(posX, posY);
    }

    _makeCellsData(rows, columns) {
        const cells = []
    
        for (let col = 0; col < columns; col ++) {
            cells[col] = [];
    
            for (let row = 0; row < rows; row++) {
                cells[col][row] = new Cell();
            }
        }
        return cells;
    }

    _drawCell(posX, posY, cellColor, textColor) {
        // Draw Cell
        this.canvasContext.fillStyle = cellColor;
        this.canvasContext.fillRect(
            posX * this.CELL_WIDTH,
            posY * this.CELL_HEIGHT,
            this.CELL_WIDTH,
            this.CELL_HEIGHT,
        );

        // Draw Piece
        const piece = this.cells[posX][posY].getPiece();
        if (piece) {
            this.canvasContext.fillStyle = textColor;
            this.canvasContext.font = '55px Arial';
            this.canvasContext.textAlign = 'center';
            this.canvasContext.textBaseline = 'middle';
            this.canvasContext.fillStyle = piece.getColor();
            this.canvasContext.fillText(
                piece,
                (posX * this.CELL_WIDTH) + (this.CELL_WIDTH / 2),
                (posY * this.CELL_HEIGHT) + (this.CELL_HEIGHT / 2)
            );
        }

        // Draw Cell position
        this.canvasContext.fillStyle = textColor;
        this.canvasContext.textBaseline = 'top';
        this.canvasContext.textAlign = 'start';
        this.canvasContext.font = '10px Arial';
        this.canvasContext.fillText(`(${posX}, ${posY})`, (posX * this.CELL_WIDTH) + 10, (posY * this.CELL_HEIGHT) + 10);
    }

    _getCellColor(col, row) {
        const cell = this.cells[col][row];

        if (cell.isPossibleMove()) {
            return "green";
        }

        return (col + row) % 2 ? "white" : "black";
    }

    _getTextColor(col, row) {
        return !((col + row) % 2) ? "#c8d6e5" : "#222f3e";
    }

    _validatePiece = (posX, posY) => {
        this._cleanPossibleMove()

        const piece = this.cells[posX][posY].getPiece();
        console.log(`piece`, piece);

        if (piece) {
            const movements = piece.getPossibleMoves([posX, posY], this);
            this._possibleMoves = movements;

            this.render();
            console.log(`movements: ${movements}`);
        }
    }

    _cleanPossibleMove = () => {
        this._possibleMoves.forEach(move => this.cells[move[0]][move[1]].setPossibleMove(false));
    };
}

export default Board;