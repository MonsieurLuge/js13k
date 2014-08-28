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
    this.map = [];
    this.exits = [];
    this.caveId = parameters.id;
    this.type = parameters.type;

    // Position of the first room of the cave
    this.x = parameters.x;
    this.y = parameters.y;

    // Set the size of the Cave
    this.width = parameters.width * 10;
    this.height = parameters.height * 10;

    // Fill the cave with random data
    this.fill();

    // Add the exits
    for (var exitNb = 0; exitNb < parameters.exits.length; exitNb++) {
        this.addExit(parameters.exits[exitNb]);
    }

    // Generate the cave
    this.generate();

    // Finally, return the object
    return this;
};
