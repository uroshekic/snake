var snake = new Object();

snake.load = function () {
	this.pos = [[2, 1], [1, 1]]; // this.pos[0] is the position of snake's head
	this.len = 2; // Size of our snake at beginning - TODO
	this.gameOver = false;

	// Add custom maps

	// # - maps, X - invisible wall, ' ' - empty space
	this.mapSize = [15, 10];
	this.map = {};
	for (i = 0; i < this.mapSize[0]; i++) {
		this.map[i] = {};
		for (j = 0; j < this.mapSize[1]; j++) {
			if (i === 0 || j === 0 || i === (this.mapSize[0] - 1) || j === (this.mapSize[1] - 1)) {
				this.map[i][j] = '#';
			} else {
				this.map[i][j] = ' ';
			}
		}
	}

	// Generate food (randomly)
	this.food = this.generateFood();
	this.score = 0;

	this.lastDirection = 'r';
	this.directionHistory = [this.lastDirection];
};

snake.newPos = function (direction) {
	if (direction === 'l') {
		return [this.pos[0][0] - 1, this.pos[0][1]];
	} else if (direction === 'r') {
		return [this.pos[0][0] + 1, this.pos[0][1]];
	} else if (direction === 'u') {
		return [this.pos[0][0], this.pos[0][1] - 1];
	} else if (direction === 'd') {
		return [this.pos[0][0], this.pos[0][1] + 1];
	} 
};

snake.move = function (direction) {
	// Update directionHistory
	// Delete some of directionHistory

	if ((direction === 'l' && this.lastDirection === 'r') || (direction === 'r' && this.lastDirection === 'l') || (direction === 'd' && this.lastDirection === 'u') || (direction === 'u' && this.lastDirection === 'd')) {
		direction = this.lastDirection;
	}

	var n = this.newPos(direction);

	if (0 >= n[0] < this.mapSize[0] && 0 >= n[1] < this.mapSize[1] && this.map[n[0]][n[1]] !== '#' && !this.posMatches(n)) {
		var tail = this.pos[this.pos.length - 1] // Just in case our snake gets hungry
		this.pos.reverse();
		this.pos.shift();
		this.pos.push(n);
		this.pos.reverse();

		this.lastDirection = direction;
	
		if (this.pos[0][0] === this.food[0] && this.pos[0][1] === this.food[1]) { // OM NOM NOM NOM!
			this.score++;
			this.pos.push(tail);
			this.food = this.generateFood();
		}

		return true;
	} else {
		this.gameOver = false;
		return false;
	}

};

snake.posMatches = function (n) {
	for (z = 0; z < this.pos.length; z++) {
		if (this.pos[z][0] === n[0] && this.pos[z][1] === n[1]) {
			return true;
		}
	}
	return false;
};

snake.generateFood = function () {
	do {
		var x = Math.floor(Math.random()*this.mapSize[0]);
		var y = Math.floor(Math.random()*this.mapSize[1]);
	} while (this.map[x][y] === '#' || this.map[x][y] === 'X' || this.posMatches([x, y])); // 
	return [x, y];
};

// GUI
snake.display = function () {
	s = '';
	for (j = 0; j < this.mapSize[1]; j++) {
		for (i = 0; i < this.mapSize[0]; i++) {
			if (this.pos[0][0] === i && this.pos[0][1] === j) {
				s += '@';
			} else
			if (this.posMatches([i, j])) {
				s += '*';
			} else if (i === this.food[0] && j === this.food[1]) {
				s += 'o';
			} else {
				s += this.map[i][j];
			}
		}
		s += '\n';
	}
	s += 'Score: ' + this.score;
	return s;
};

snake.update = function () {
	document.getElementById("snake").innerHTML=this.display();
};

snake.load();

var direction = 'r';
snake.keyPressed = function (e) {
	switch (e.keyCode) {
		case 37:
			direction = 'l';
			break;
		case 38:
			direction = 'u';
			break;
		case 39:
			direction = 'r';
			break;
		case 40:
			direction = 'd';
			break;
	}
};
var timeout;

var loop = function () { 
	if (snake.move(direction)) {
		snake.update();
		window.setTimeout(loop, 600  - Math.min(snake.score*75, 475));
	} else {
		document.write('Game over! Score: ' + snake.score);
	}
}

snake.update();
loop();