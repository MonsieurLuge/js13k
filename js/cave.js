/**
 * TODO Cave description
 *
 * @return {Cave}
 */
function Cave(parameters) {
    this.id = null;
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.type = null;
    this.seed = null;
    this.map = [];
    this.exits = [];

    // Cave generator settings
    this.caveGenerator = {
        chanceToStartAlive: 0.38,
        loops: 3,
        cellsToDie: 5,
        cellsToLive: 4
    };

    // Init the Cave
    this.init(parameters);

    // And return the object
    return this;
}

/**
 * TODO addExit description
 * @param {Object} parameters
 */
Cave.prototype.addExit = function(parameters) {
    var direction = getDirection(parameters.direction);
    var xStart = 0;
    var yStart = 0;

    if (direction.x === 0) {
        xStart = parameters.x * 10 + 4;
        yStart = parameters.y * 10 + 9 * (direction.y + 1) / 2;
    } else {
        xStart = parameters.x * 10 + 9 * (direction.x + 1) / 2;
        yStart = parameters.y * 10 + 4;
    }

    for (var length = 0; length < Math.ceil(10 / 2); length++) {
        if (direction.x === 0) {
            // Carve to top or bottom
            this.map[xStart][yStart - length * direction.y] = false;
            this.map[xStart + 1][yStart - length * direction.y] = false;
        } else {
            // Carve to left or right
            this.map[xStart - length * direction.x][yStart] = false;
            this.map[xStart - length * direction.x][yStart + 1] = false;
        }
    }

    // Store the exit informations
    this.exits.push(parameters);
};

/**
 * TODO clear description
 * @return {[type]} [description]
 */
Cave.prototype.clear = function() {
    this.map = [];
    this.exits = [];
};

/**
 * TODO createCave description
 * @return {[type]} [description]
 */
Cave.prototype.createCave = function(tries, exits) {
    // If the maximum of tries is reached, stop the creation and keep the last cave
    if (tries >= 20) {
        'Abandon de la génération. On garde la dernière version de la cave.'

        return this;
    }

    // Init the seed
    setSeed(this.seed);
    console.log('Création d\'une cave (seed = ' + this.seed + ').');

    // Clear the map content
    this.clear();

    // Fill the cave with random data
    this.fill();

    // Add the exits
    for (var exitNb = 0; exitNb < exits.length; exitNb++) {
        this.addExit(exits[exitNb]);
    }

    // Generate the cave
    this.generate();

    // If the cave is not correctly generated, try again with the next seed
    if (false === this.isValid()) {
        console.log('Fin de la vérification. La cave n\'est pas valide.');

        this.seed++;

        this.createCave(++tries, exits);
    } else {
        console.log('Fin de la vérification. La cave est valide.');
    }

    return this;
};

/**
 * Tells if an exit exits at these coordinates, to this direction
 *
 * @return {boolean}
 */
Cave.prototype.exitExists = function(x, y, direction) {
    for (var exitNb = 0; exitNb < this.exits.length; exitNb++) {
        if (this.exits[exitNb].x === x && this.exits[exitNb].y === y && this.exits[exitNb].direction === direction) {
            return true;
        }
    }

    return false;
};

/**
 * TODO fill description
 *
 * @return {Cave}
 */
Cave.prototype.fill = function() {
    for (var i = 0; i < this.width; i++) {
        this.map[i] = [];

        for (var j = 0; j < this.height; j++) {
            switch(this.type) {
                case 'ground':
                    if (j === this.height) {
                        // Draw a border
                        this.map[i][j] = true;
                    } else {
                        this.map[i][j] = (j >= this.height * 0.8) || (Math.seededRandom(0, 1) <= (this.caveGenerator.chanceToStartAlive * j / this.height));
                    }

                    break;
                case 'underground':
                    if (i === 0 || i === this.width - 1 || j === 0 || j === this.height - 1) {
                        // Draw a border
                        this.map[i][j] = true;
                    } else {
                        // Or create random content
                        this.map[i][j] = (Math.seededRandom(0, 1) < this.caveGenerator.chanceToStartAlive);
                    }
            }
        }
    }

    return this;
};

/**
 * TODO generate description
 *
 * @return {Cave}
 */
Cave.prototype.generate = function() {
    for (var generation = 1; generation <= this.caveGenerator.loops; generation++) {
        var clonedMap = this.map.slice(0);

        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                var neighbours = neighbourCells(clonedMap, i, j);

                if (clonedMap[i][j] === true) {
                    if (neighbours.deadCells > this.caveGenerator.cellsToDie) {
                        this.map[i][j] = false;
                    }
                } else {
                    if (neighbours.aliveCells > this.caveGenerator.cellsToLive) {
                        this.map[i][j] = true;
                    }
                }
            }
        }
    }

    return this;
};

/**
 * Returns the exits at these coordinates
 *
 * @param  {integer} x
 * @param  {integer} y
 * @return {array} [{x, y, direction}, ...]
 */
Cave.prototype.getExits = function(x, y) {
    var exits = [];

    for (var exit = 0; exit < this.exits.length; exit++) {
        if (this.exits[exit].x === x && this.exits[exit].y === y) {
            exits.push({x: x, y: y, direction: this.exits[exit].direction});
        }
    }

    return exits;
};

/**
 * TODO init description
 *
 * @return {Cave}
 */
Cave.prototype.init = function(parameters) {
    // Init some stuff
    this.caveId = parameters.id;
    this.type = parameters.type;
    this.seed = parameters.seed;

    // Coordinates of the first room of the cave
    this.x = parameters.x;
    this.y = parameters.y;

    // Set the size of the Cave
    this.width = parameters.width * 10;
    this.height = parameters.height * 10;

    // Create the cave
    this.createCave(1, parameters.exits);

    // Finally, return the object
    return this;
};

/**
 * TODO isValid description
 * @return {Boolean} [description]
 */
Cave.prototype.isValid = function() {
    if (this.exits.length < 2) {
        return true;
    }

    var clonedMap = this.map.slice(0);
    var xStart = null;
    var yStart = null;
    var caveWidth = this.width;
    var caveHeight = this.height;
    var caveExits = this.exits.slice(0);
    var exitsLinked = 1;
    var exitsFound = []

    var searchForExits = {
        search: function(x, y) {
            // If the coordinates are out of bound, stop
            if (x < 0 || x >= caveWidth || y < 0 || y >= caveHeight) {
                return;
            }

            // If the coordinates have been searched, or if there is a wall, stop
            if (clonedMap[x][y] === 'searched' || clonedMap[x][y] === true) {
                return;
            }

            // If a border is reached, get the exit informations
            if (x === 0 || x === caveWidth - 1) {
                // Left or right border
                for (var nbExit = 1; nbExit < caveExits.length; nbExit++) {
                    if (caveExits[nbExit].y === Math.floor(y / 10) && (caveExits[nbExit].direction === 'left' || caveExits[nbExit].direction === 'right') && exitsFound.indexOf(nbExit) === -1) {
                        exitsFound.push(nbExit);

                        if (true === caveExits[nbExit].linked) {
                            exitsLinked++;
                        }
                    }
                }
            } else if (y === 0 || y === caveHeight - 1) {
                // Top or bottom border
                for (var nbExit = 1; nbExit < caveExits.length; nbExit++) {
                    if (caveExits[nbExit].x === Math.floor(x / 10) && (caveExits[nbExit].direction === 'top' || caveExits[nbExit].direction === 'bottom') && exitsFound.indexOf(nbExit) === -1) {
                        exitsFound.push(nbExit);

                        if (true === caveExits[nbExit].linked) {
                            exitsLinked++;
                        }
                    }
                }
            }

            // Search complete
            clonedMap[x][y] = 'searched';

            // Search the neighbours
            for (var i = -1 ; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    // Search only the neighbours
                    if (i !== 0 || j !== 0) {
                        this.search(x + i, y + j);
                    }
                }
            }
        },
        validate: function() {
            var linkedGoal = 0;
            var linked = 0;

            // Count the number of exits which must be linked
            for (nbExit = 0; nbExit < caveExits.length; nbExit++) {
                if (true === caveExits[nbExit].linked) {
                    linkedGoal++;
                }
            }

            return linkedGoal === exitsLinked;
        }
    };

    if (this.exits[0].direction === 'top' || this.exits[0].direction === 'bottom') {
        xStart = 4;
        yStart = (getDirection(this.exits[0].direction).y + 1) / 2 * 9;
    } else {
        xStart = (getDirection(this.exits[0].direction).x + 1) / 2 * 9;
        yStart = 4;
    }

    searchForExits.search(xStart, yStart);

    return searchForExits.validate();
};
