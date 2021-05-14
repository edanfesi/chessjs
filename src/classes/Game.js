import Board from './Board';

class Game {
    constructor(){
        const events = {
            GAME_OVER: new Event('game_over'), 
        }

        this.board = new Board(700, 700, 8, 8, events);
        this.board.addEvent('game_over', (event) => this.gameOver(event));

        this.p1 = null;
        this.p2 = null;
    }

    start() {
        this.board.render();
        this._add_player('Edward');
        this._add_player('Leomaris');
    }

    _add_player(player) {
        if (this.p1 && this.p2) {
            return false;
        }

        let isP1 = false;

        if (!this.p1) {
            this.p1 = player;
            isP1 = true;
        } else if (!this.p2) {
            this.p2 = player;
        }

        this.board.set_player(isP1);

        return true;
    }

    gameOver(_) {
        alert(`Winner: ${this.board.getCurrentPlayer()}`);
    }
}

export default Game;