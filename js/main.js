/**
 * Exploration game, about the 4th Elements
 * JS13K - 2014
 *
 * @author: Monsieur Luge
 */

var canvas = document.getElementById("js13k");
var context = canvas.getContext('2d');
var frameRate = 1000/60;

var seeker = {
    id: 'seeker',
    x: 4,
    y: 3,
    width: 0,
    height: 0,
    oxygen: 100,
    create: function() {
        //TODO
    }
};

var cave = {
    seed: 92,
    width: 30,
    height: 60,
    map: [],
    generator: {
        chanceToStartAlive: 0.38,
        loops: 3,
        cellsToDie: 5,
        cellsToLive: 4
    },
    clear: function() {
        Math.seed = this.seed;

        this.map = [];
        this.exits = [];
        this.width = Math.round(Math.seededRandom(1,4)) * 8 + 8;
        this.height = Math.round(Math.seededRandom(1,4)) * 8 + 8;

        return this;
    },
    exits: [],
    fill: function() {
        for (var i = 0; i < this.width; i++) {
            this.map[i] = [];

            // fill the map
            for (var j = 0; j < this.height; j++) {
                if (i === 0 || i === this.width - 1 || j === 0 || j === this.height - 1) {
                    this.map[i][j] = true;
                } else {
                    this.map[i][j] = (Math.seededRandom(0, 1) < this.generator.chanceToStartAlive);
                }
            }
        }

        return this;
    },
    carveExits: function(exitLength) {
        var exitCarved = false,
            xPosition = Math.round(Math.seededRandom(0, 1)) * (this.width - 1),
            yPosition = Math.round(Math.seededRandom(0, 1) * (this.height - 1)),
            direction = xPosition === 0 ? 1 : -1,
            yStart = yPosition,
            tries = 0;

        console.log('Try to carve a ' + exitLength + 'px exit');

        do {
            for (var searching = 1; searching <= exitLength; searching++) {
                if (this.map[xPosition + searching * direction][yPosition] === false) {
                    console.log('carving a ' + searching + 'px exit at x=' + xPosition + ' and y=' + yPosition);

                    for (var carving = 0; carving < searching; carving++) {
                        this.map[xPosition + carving * direction][yPosition] = false;
                    }

                    exitCarved = true;

                    this.exits[this.exits.length] = {
                        x: xPosition,
                        y: yPosition
                    };

                    break;
                }
            }

            yPosition++;
            tries++;

            if (yPosition >= this.height) {
                yPosition = 0;
            }
        } while (exitCarved === false && yPosition !== yStart && tries <= this.height);

        // If no exit was carved, try with a bigger tunnel
        if (exitCarved === false && exitLength < 5) {
            this.carveExits(++exitLength);
        }

        // Add a new exit ?
        if (exitCarved === true && Math.seededRandom(0, 1) < (1 / this.exits.length)) {
            this.carveExits(1);
        }
    },
    generate: function(stepByStep) {
        for (var generation = 1; generation <= this.generator.loops; generation++) {
            var clonedMap = this.map.slice(0);

            for (var i = 0; i < this.width; i++) {
                for (var j = 0; j < this.height; j++) {
                    var neighbours = neighbourCells(clonedMap, i, j);

                    if (clonedMap[i][j] === true) {
                        if (neighbours.deadCells > this.generator.cellsToDie) {
                            this.map[i][j] = false;
                        }
                    } else {
                        if (neighbours.aliveCells > this.generator.cellsToLive) {
                            this.map[i][j] = true;
                        }
                    }
                }
            }

            if (stepByStep === true) {
                return this;
            }
        }

        return this;
    },
    draw: function() {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.map[i][j] === false) {
                    continue;
                }

                context.beginPath();
                context.fillStyle = "darkgrey";
                context.rect(8 * i, 8 * j, 8, 8);
                context.fill();
            }
        }
    }
};

// -----------------------------------------------------------------------------

Math.seededRandom = function(min, max) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;

    return min + rnd * (max - min);
};

function neighbourCells(data, cellX, cellY) {
    var result = {
        deadCells: 0,
        aliveCells: 0,
        borders: 0
    };

    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            var neighbourX = cellX + i;
            var neighbourY = cellY + j;

            if (i === 0 && j === 0) {
                continue;
            }

            if (neighbourX < 0 || neighbourX >= data.length || neighbourY < 0 || neighbourY >= data[0].length) {
                result.borders++;

                continue;
            }

            if (data[neighbourX][neighbourY] === true) {
                result.aliveCells++;
            } else {
                result.deadCells++;
            }
        }
    }

    return result;
}

function clearScreen() {
    canvas.width = canvas.width;
}

function drawGrid() {
    for (var i = 0; i < canvas.width / 64; i++) {
        context.beginPath();
        context.strokeStyle = "#353535";
        context.moveTo(64 * i, 0);
        context.lineTo(64 * i, canvas.height);
        context.stroke();
    }
    for (var j = 0; j < canvas.height / 64; j++) {
        context.beginPath();
        context.strokeStyle = "#353535";
        context.moveTo(0, 64 * j);
        context.lineTo(canvas.width, 64 * j);
        context.stroke();
    }
}

function gameLoop() {
    clearScreen();

    cave.draw();

    setTimeout(gameLoop, frameRate);
}

function startGame(seed) {
    clearScreen();
    drawGrid();

    if (seed === parseInt(seed)) {
        cave.seed = seed;
    }

    cave.clear();
    cave.fill();
    cave.generate();
    cave.carveExits(1);
    cave.draw();

    //gameLoop();
}

window.onload = startGame;
