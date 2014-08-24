/**
 * TODO Cave description
 *
 * @return {Cave}
 */
function Cave(caveId) {
    // Some parameters
    this.width = null;
    this.height = null;
    this.roomSize = null;
    this.id = caveId;
    this.map = [];
    this.entrances = [];

    // Cave generator settings
    this.caveGenerator = {
        chanceToStartAlive: 0.38,
        loops: 3,
        cellsToDie: 5,
        cellsToLive: 4
    };

    // Init the Cave
    this.init();

    // And return the object
    return this;
}

/**
 * [addEntrance description]
 * @param {[type]} x         [description]
 * @param {[type]} y         [description]
 * @param {[type]} direction [description]
 */
Cave.prototype.addEntrance = function(x, y, directionId) {
    var direction = getDirection(directionId);

    for (var length = 0; length < 4; length++) {
        if (direction.x === null) {
            this.map[this.roomSize * x + 4][this.roomSize * y + length] = false;
            this.map[this.roomSize * x + 5][this.roomSize * y + length] = false;
        } else {
            this.map[this.roomSize * x + length][this.roomSize * y + 4] = false;
            this.map[this.roomSize * x + length][this.roomSize * y + 5] = false;
        }
    }
}

/**
 * Try to carve an entrance
 *
 * @param  {integer} x
 * @param  {integer} y
 * @param  {object} direction
 * @param  {integer} tries
 * @return {boolean}
 */
Cave.prototype.carveEntrance = function(x, y, direction, tries) {
    tries++;

    console.log('Try to carve an entrance at ' + x + ',' + y + ' from ' + direction.from + ' (tries = ' + tries + ')'); // TODO remove

    // If there is already an entrance, change the coordinates
    if (this.entranceExists(x, y, direction.direction).length > 0) {
        // if the maximum of authorized tries are reached, stop the loop
        if (tries >= (this.width + this.length) / 4.5) {
            return false;
        }

        // Continue to try to carve an entrance
        var nextCoordinates = this.nextEntranceCoordinates(x, y, direction);

        return this.carveEntrance(nextCoordinates.x, nextCoordinates.y, nextCoordinates.direction, tries);
    }

    // Try to carve the entrance
    for (searchingLength = 1; searchingLength < 4; searchingLength++) {
        if (direction.x === null) {
            var searchX = (x * 9 + 4);
            var searchY = (y * 9 + 4) + direction.y * (4 - searchingLength);
        } else {
            var searchX = (x * 9 + 4) + direction.x * (4 - searchingLength);
            var searchY = (y * 9 + 4);
        }

        // If we found a hole, carve the entrance
        if (this.map[searchX][searchY] === false) {
            for (var carving = 0; carving < searchingLength; carving++) {
                if (direction.x === null) {
                    var carveX = (x * 9 + 4);
                    var carveY = (y * 9 + 4) + direction.y * (4 - carving);
                } else {
                    var carveX = (x * 9 + 4) + direction.x * (4 - carving);
                    var carveY = (y * 9 + 4);
                }

                this.map[carveX][carveY] = false;
            }

            // Store the entrance position
            this.entrances.push({x: x, y: y, direction: direction});

            return true;
        }
    }

    return false;
};

/**
 * TODO carveEntrances description
 *
 * @return {nothing}
 */
Cave.prototype.carveEntrances = function() {
    var direction = getDirection(Math.round(Math.seededRandom(1, 4))),
        x = 0,
        y = 0,
        tries = 0;

    // Entrance position and direction
    if (direction.x === null) {
        // From top or bottom
        x = Math.round(Math.seededRandom(0, this.width / this.roomSize - 1));
        y = this.height * direction.y;
    } else {
        // From right or left
        x = this.width * direction.x;
        y = Math.round(Math.seededRandom(0, this.height / this.roomSize - 1));
    }

    // Try to carve an entrance
    this.carveEntrance(x, y, direction, 0);
}

/**
 * TODO draw description
 *
 * @param  {context} context
 * @return {Cave}
 */
Cave.prototype.draw = function(context) {
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            if (this.map[i][j] === false) {
                continue;
            }

            context.beginPath();
            context.fillStyle = "#bcbcbc";
            context.rect(8 * i, 8 * j, 8, 8);
            context.fill();
        }
    }

    return this;
}

/**
 * Tells if an entrance already exists
 *
 * @param  {integer} x
 * @param  {integer} y
 * @param  {object} direction
 * @return {boolean}
 */
Cave.prototype.entranceExists = function(x, y, direction) {
    var entrances = this.getEntrances(x, y);

    if (entrances.length === 0) {
        return false;
    }

    for (entrance = 0; entrance < entrances.length; entrance++) {
        if (entrances[entrance].direction === direction) {
            return true;
        }
    }

    return false;
}

/**
 * TODO fill description
 *
 * @return {Cave}
 */
Cave.prototype.fill = function() {
    for (var i = 0; i < this.width; i++) {
        this.map[i] = [];

        for (var j = 0; j < this.height; j++) {
            if (i === 0 || i === this.width - 1 || j === 0 || j === this.height - 1) {
                // Draw a border
                this.map[i][j] = true;
            } else {
                // Or create random content
                this.map[i][j] = (Math.seededRandom(0, 1) < this.caveGenerator.chanceToStartAlive);
            }
        }
    }

    return this;
}

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
}

/**
 * Returns the entrances at these coordinates
 *
 * @param  {integer} x
 * @param  {integer} y
 * @return {array} [{x, y, direction}, ...]
 */
Cave.prototype.getEntrances = function(x, y) {
    var entrances = [];

    for (var entrance = 0; entrance < this.entrances.length; entrance++) {
        if (this.entrances[entrance].x === x && this.entrances[entrance].y === y) {
            entrances.push({x: x, y: y, direction: this.entrances[entrance].direction});
        }
    }

    return entrances;
}

/**
 * TODO init description
 *
 * @return {Cave}
 */
Cave.prototype.init = function() {
    // Set the size of the Cave
    this.roomSize = 10;
    this.width = Math.round(Math.seededRandom(1,4)) * this.roomSize;
    this.height = Math.round(Math.seededRandom(1,4)) * this.roomSize;

    // Clear some parameters
    this.map = [];
    this.exits = [];

    // Fill the cave with random data
    this.fill();

    // TODO remove
    this.addEntrance(1, 0, 1);
    this.addEntrance(0, 0, 4);

    // Generate the cave
    this.generate();

    // And carve some exits
    //this.carveEntrances();

    // Finally, return the object
    return this;
}
