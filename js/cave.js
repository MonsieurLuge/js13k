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

    if (direction.to === 'top' || direction.to === 'bottom') {
        xStart = parameters.x * 10 + 4;
        yStart = parameters.y * 10 + 9 * (direction.y + 1) / 2;
    } else {
        xStart = parameters.x * 10 + 9 * (direction.x + 1) / 2;
        yStart = parameters.y * 10 + 4;
    }

    // Carve the exit
    for (var length = 0; length < Math.ceil(10 / 2); length++) {
        if (direction.to === 'top' || direction.to === 'bottom') {
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

Cave.applyCaveWalls = function() {
    //TODO
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
        console.log('Cave creation failure. Tries = ', tries);

        return this;
    }

    // Init the seed
    setSeed(this.seed);

    // Clear the map content
    this.clear();

    // Fill the cave with random data
    this.fill();

    // Add the exits
    for (var n = 0; n < exits.length; n++) {
        this.addExit(exits[n]);
    }

    // Generate the cave
    this.map = cellularAutomaton(this.map, {generations: 3, chanceToStartAlive: 0.38, cellsToDie: 5, cellsToLive: 4});

    // If the cave is not correctly generated, try again with the next seed
    if (false === this.isValid()) {
        this.seed++;

        this.createCave(++tries, exits);
    } else {
        console.log('Cave creation complete. Tries = ', tries);
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
    var chanceToStartAlive = 0.38;

    for (var i = 0; i < this.width; i++) {
        this.map[i] = [];

        for (var j = 0; j < this.height; j++) {
            switch(this.type) {
                case 'ground':
                    if (j === this.height) {
                        // Draw a border
                        this.map[i][j] = true;
                    } else {
                        this.map[i][j] = (j >= this.height * 0.8) || (Math.seededRandom(0, 1) <= (chanceToStartAlive * j / this.height));
                    }

                    break;
                case 'underground':
                    if (i === 0 || i === this.width - 1 || j === 0 || j === this.height - 1) {
                        // Draw a border
                        this.map[i][j] = true;
                    } else {
                        // Or create random content
                        this.map[i][j] = (Math.seededRandom(0, 1) < chanceToStartAlive);
                    }
            }
        }
    }

    return this;
};

/**
 * Returns the exit at these coordinates
 * @param  {integer} x
 * @param  {integer} y
 * @return {Object}     The exit, or null
 */
Cave.prototype.getExit = function(x, y) {
    // If the coordinates are not on the border of the map, return nothing
    if (x > 0 && x < this.width - 2 && y > 0 && y < this.height - 2) {
        return null;
    }

    var exits = this.getExits(Math.floor(x / 10), Math.floor(y / 10));

    if (exits.length === 0) {
        return null;
    }

    var direction = '';

    if (x === 0) {
        direction = 'left';
    } else if (x === this.width - 1) {
        direction = 'right';
    } else if (y === 0) {
        direction = 'top';
    } else {
        direction = 'bottom';
    }

    // Check if the exit found is correctly defined
    for (var exit = 0; exit < exits.length; exit++) {
        if (exits[exit].direction === direction) {
            return exits[exit];
        }
    }

    return null;
};

/**
 * Returns the exits at these room coordinates
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
 * Check if the cave is valid.
 * Some exits must be linked. If not, the cave creation must be redone
 *
 * @return {Boolean}
 */
Cave.prototype.isValid = function() {
    // If there is less than 2 exits, the cave is always valid
    if (this.exits.length < 2) {
        return true;
    }

    var self = this;
    var clonedMap = this.map.slice(0);
    var exitsLinked = 0;
    var exitsFound = [];

    var searchForExits = {
        // Check for an exit, store it, and increase linked count
        exitFound: function(x, y) {
            var exit = self.getExit(x, y);

            if (exit === null) {
                return false;
            }

            // Check if the exit reached is already found
            for (var n = 0; n < exitsFound.length; n++) {
                if (exit.x === exitsFound[n].x && exit.y === exitsFound[n].y && exit.direction === exitsFound[n].direction) {
                    // If yes, return
                    return false;
                }
            }

            // Store the exit found
            exitsFound.push(exit);

            // Increase linked exits count
            for (var n = 0; n < self.exits.length; n++) {
                if (exit.x === self.exits[n].x && exit.y === self.exits[n].y && exit.direction === self.exits[n].direction) {
                    if (true === self.exits[n].linked) {
                        exitsLinked++;
                    }

                    break;
                }
            }

            return true;
        },
        // Parse the coordinates and their neighbours
        search: function(x, y) {
            // If the coordinates are out of bound, stop searching
            if (x < 0 || x >= self.width || y < 0 || y >= self.height) {
                return;
            }

            // If the coordinates have been searched, or if there is a wall, stop searching
            if (clonedMap[x][y] === 'searched' || clonedMap[x][y] === true) {
                return;
            }

            // Is there an exit at these coordinates ?
            this.exitFound(x, y);

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
        // Count the number of linked exits
        validate: function() {
            var linkedGoal = 0;

            // Count the number of exits which must be linked
            for (var n = 0; n < self.exits.length; n++) {
                if (true === self.exits[n].linked) {
                    linkedGoal++;
                }
            }

            return linkedGoal === exitsLinked;
        }
    };

    // Start to search for the exits
    if (this.exits[0].direction === 'top' || this.exits[0].direction === 'bottom') {
        searchForExits.search(this.exits[0].x * 10 + 4, (getDirection(this.exits[0].direction).y + 1) / 2 * 9);
    } else {
        searchForExits.search((getDirection(this.exits[0].direction).x + 1) / 2 * 9, this.exits[0].y * 10 + 4);
    }

    return searchForExits.validate();
};
