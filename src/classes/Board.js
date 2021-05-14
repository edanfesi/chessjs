import Cell from './Cell';
import Pawn from './Pawn';
import Rock from './Rock';
import King from './King';
import Queen from './Queen';
import Knight from './Knight';
import Bishop from './Bishop';

class Board {
    constructor (width = 700, height = 700, rows = 8, columns = 8, events) {
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.columns = columns;
        this.events = events;

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

        this._lastPos = null;
        this._possibleMoves = [];

        this._playersTurn = 'p1';

        this._endGame = false;
    }

    getColumns() {
        return this.columns;
    }

    getCurrentPlayer() {
        return this._playersTurn;
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

        if (moveX < 0 
            || moveY < 0
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

        if (currentPiece.getColor() !== pieceToMove.getColor() || canJump) {
            currentCell.setPossibleMove(true);

            return true;
        }

        return false;
    }

    getCell(posX, posY) {
        if (posX < 0 
            || posY < 0
            || posX >= this.columns 
            || posY >= this.rows
        ) {
            return null;
        }

        return this.cells[posX][posY];
    }

    addEvent(name, eventFunction) {
        this.canvas.addEventListener(name, (event) => eventFunction(event));
    }

    _selectCell(event) {
        if (!this._endGame) {
            const posX = this.columns - Math.trunc((this.width - event.pageX) / this.CELL_WIDTH) - 1;
            const posY = this.rows - Math.trunc((this.height - event.pageY) / this.CELL_HEIGHT) - 1;

            if (this._isPlayersTurn([posX, posY])) {
                console.log(`Player turn ${this._playersTurn}`)         
                const pieceMovement = this._possibleMoves.filter(move => posX === move[0] && posY === move[1]);
                if (!!pieceMovement.length) {
                    this._endGame = this._movePiece([posX, posY]);

                    if (this._endGame) {
                        this.canvas.dispatchEvent(this.events.GAME_OVER);
                    }

                    this._playersTurn = this._playersTurn === 'p1' ? 'p2' : 'p1';
                } else {
                    this._validatePiece(posX, posY);
                }

                this.render();
            } else {
                console.log('It is not your turn');
            }
        }
    }

    _isPlayersTurn(position) {
        const [postX, postY] = position;
        const isWhiteTurn = this._playersTurn === 'p1'

        if (this._lastPos) {
            const [lastPosX, lastPosY] = this._lastPos;
            const lastCell = this.cells[lastPosX][lastPosY];

            return lastCell.getPiece().getIsWhite() === isWhiteTurn;
        }


        console.log(position)
        const currentCell = this.cells[postX][postY];
        console.log(currentCell.getPiece())

        return currentCell.getPiece().getIsWhite() === isWhiteTurn;
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
        const move = [posX, posY];
        const piece = this.cells[posX][posY].getPiece();

        if (piece) {
            this._cleanPossibleMoves()

            this._lastPos = move; 
            const movements = piece.getPossibleMoves(move, this);
            this._possibleMoves = movements;
        }
    }

    _movePiece(newMove) {
        const [posX, posY] = newMove;
        const [lastPosX, lastPosY] = this._lastPos;

        const lastPiece = this.cells[lastPosX][lastPosY].getPiece();
        const selectedCell = this.cells[posX][posY]
        const selectedPiece = selectedCell.getPiece();

        let isEndGame = false;
        if (selectedPiece) {
            selectedPiece.setKilled(true);

            if (selectedPiece.getName() === 'king') {
                isEndGame = true;
            }
        }

        this.cells[lastPosX][lastPosY].clean()
        this.cells[posX][posY].setPiece(lastPiece)
        lastPiece.moved();

        this._lastPos = null;

        this._cleanPossibleMoves()
        this._possibleMoves = [];

        return isEndGame;
    }

    _cleanPossibleMoves = () => {
        this._possibleMoves.forEach(move => this.cells[move[0]][move[1]].setPossibleMove(false));
    };
}

export default Board;