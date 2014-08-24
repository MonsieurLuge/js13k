/**
 * TODO Cave description
 *
 * @return {Cave}
 */
function Cave() {
    // Some parameters
    this.width = null;
    this.height = null;
    this.map = [];
    this.entrances = [];

    // Generator settings
    // TODO move this to a json setting file
    this.generator = {
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
 * TODO carveEntrance description
 */
Cave.prototype.carveEntrance = function(x, y, direction) {
    console.log('Try to carve an entrance at ' + x + ',' + y + ' from ' + direction.from); // TODO remove

    // If there is already an entrance, change coordinates
    if (this.entranceExists(x, y, direction.direction).length > 0) {

    }
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
        x = Math.round(Math.seededRandom(0, this.width / 9 - 1));
        y = this.height * direction.y;
    } else {
        // From right or left
        x = this.width * direction.x;
        y = Math.round(Math.seededRandom(0, this.height / 9 - 1));
    }

    this.carveEntrance(x, y, direction);

    do {
        for (var searching = 1; searching <= exitLength; searching++) {
            if (this.map[xPosition + searching * direction][yPosition] === false) {
                console.log('carving a ' + searching + 'px exit at x=' + xPosition + ' and y=' + yPosition); // TODO remove

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

Cave.prototype.entranceExists(x, y, direction) {
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
                this.map[i][j] = (Math.seededRandom(0, 1) < this.generator.chanceToStartAlive);
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
    this.width = Math.round(Math.seededRandom(1,4)) * 9 + 9;
    this.height = Math.round(Math.seededRandom(1,4)) * 9 + 9;
    window.document.getElementById('cave-infos').innerHTML = 'width=' + this.width + ' height=' + this.height; // TODO remove

    // Clear some parameters
    this.map = [];
    this.exits = [];

    // Fill the cave with random data
    this.fill();

    // Generate the cave
    this.generate();

    // And carve some exits
    //this.carveExits(1);

    // Finally, return the object
    return this;
}
