class Game {
    static EASY_MODE = 1500;
    static MEDIUM_MODE = 1000;
    static HARD_MODE = 50;
    
    static HALF_OF_FIELD = 50;

    static _id = 1;

    _mode = Game.EASY_MODE;
    _finish = false;
    _cells = [];

    _currentCell;
    _prevCell;

    _user;
    _compuer;

    _table;
    _timer;

    init() {                
        this._user = new Player(document.querySelector('.user_score'), 'User ' + Game._id);
        this._compuer = new Computer(document.querySelector('.computer_score'), 'Computer ' + Game._id);

        this._table = document.createElement('table');
        document.querySelector('.container').appendChild(this._table);
        for (let i = 0; i < 10; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 10; j++) {
                var col = document.createElement("td");                
                col.className = 'cell';
                col.addEventListener('click', (e) => {
                    if (this._currentCell != undefined && this._currentCell.view == e.target) {                        
                        this._currentCell.fill('green');
                        this._currentCell.picked = true;
                        this._user.picked();
                    }
                });
                row.appendChild(col);
                this._cells.push(new Cell(col));
            }
            this._table.appendChild(row);
        }
    }

    start() {
        if (this._prevCell != undefined && !this._prevCell.picked) {
            this._prevCell.fill('red');
            this._compuer.picked();
        }

        this._currentCell = this.getRandomCell();
        this._currentCell.fill('blue');

        this._prevCell = this._currentCell;                                
        
        this._timer = setTimeout(() => {
            if (this._finish) {                
                if (this._prevCell != undefined && !this._prevCell.picked) {
                    this._prevCell.fill('red');
                    this._compuer.picked();                    
                }
                this.displayWinner();
            } else {
                this.start();
            }
        }, this._mode);

        this._finish = this._cells.length == Game.HALF_OF_FIELD;
    }

    getRandomCell() {
        let index = Math.floor(Math.random() * this._cells.length);
        let cell = this._cells[index];
        this._cells.splice(index, 1);
        return cell;
    }

    displayWinner() {
        document.querySelector('.winner').innerHTML = this._user.score > this._compuer.score ? 'Winner: ' + this._user.name : 'Winner: ' + this._compuer.name;
    }

    reset() {
        clearTimeout(this._timer);
        this._prevCell = undefined;        
        document.querySelector('.container').removeChild(this._table);
        document.querySelector('.winner').innerHTML = 'Winner: ';
        this._user.score = 0;
        this._compuer.score = 0;
        Game._id++;
        this._cells = [];        
        this.init();
    }

    set mode(value) {
        this._mode = value;
    }
}

class Cell {
    _view;
    _picked = false;

    constructor(view) {
        this._view = view;
    }

    fill(color) {
        this._view.style.backgroundColor = color;
    }

    get view() {
        return this._view;
    }

    get picked() {
        return this._picked;
    }

    set picked(value) {
        this._picked = value;
    }
}

class Player {
    _view;
    _name;
    _score = 0;

    constructor(view, name) {
        this._view = view;
        this._name = name;
    }

    picked() {        
        this._score++;        
        this.updateView();
    }

    updateView() {
        this._view.innerHTML = 'User score: ' + this._score;
    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
        this.updateView();
    }

    get name() {
        return this._name;
    }
}

class Computer extends Player {

    updateView() {
        this._view.innerHTML = 'Computer score: ' + this._score;
    }
}

let game = new Game();
game.init();

document.querySelector('#easy_mode').addEventListener('click', () => {    
    game.reset();
    game.mode = Game.EASY_MODE;
    game.start();
});

document.querySelector('#medium_mode').addEventListener('click', () => {    
    game.reset();
    game.mode = Game.MEDIUM_MODE;
    game.start();
});

document.querySelector('#hard_mode').addEventListener('click', () => {    
    game.reset();
    game.mode = Game.HARD_MODE;
    game.start();
});