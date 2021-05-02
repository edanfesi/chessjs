class Board {
    constructor (width = 8, height = 8) {
        this.width = width;
        this.height = height;
        this.boxes = makeBoard(width, height);
    }

    getSpot(x, y) {
        if (x > this.width || y > this.height) {
            alert("Index out of bound");
        }

        return this.boxes[x][y];
    }

    showBoard() {
        for (let i = 0; i < this.width; i++) {
            let row = ""
            for (let j = 0; j < this.height; j++) {
                row += this.boxes[i][j];
            }
            console.log(row);

        }
    }

    resetBoard() {
        this.boxes = makeBoard(this.with, this.height);
    }
}

function makeBoard(width, height) {
    const boxes = []
    for (let i=0; i<width; i++) {
        boxes[i] = [];

        for (let j=0; j<height; j++) {
            if ((i === 0 && i === j)
                || (i == 0 && j === height - 1)
                || (i === width - 1 && i == j)
                || (i === width - 1 && j === 0)) {
                boxes[i][j] = ' T ';
            } else if ((i === 0 && j ===  1) 
                || (i === 0 && j == height - 2) 
                || (i == width - 1 && j === 1)
                || (i == width - 1 && j === height - 2)) {
                boxes[i][j] = ' H ';
            } else if ((i === 0 && j === 2)
                || (i === 0 && j == height - 3)
                || (i == width - 1 && j === 2)
                || (i === width - 1 && j === height - 3)) {
                boxes[i][j] = ' A ';
            } else if (j === 3 && (i == 0 || i === width - 1)) {
                boxes[i][j] = ' Q ';
            } else if (j === 4 && (i == 0 || i === width - 1)) {
                boxes[i][j] = ' K ';
            } else if ((i == 1) || (i === height - 2)) {
                boxes[i][j] = ' P ';
            } else {
                boxes[i][j] = " . ";
            }
        }
    }

    return boxes;
}

export default Board;