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
    this.exits = [];

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
 * TODO carveExits description
 *
 * @param  {integer} exitLength
 * @return {nothing}
 */
Cave.prototype.carveExits = function(exitLength) {
    var exitCarved = false,
        xPosition = Math.round(Math.seededRandom(0, 1)) * (this.width - 1),
        yPosition = Math.round(Math.seededRandom(0, 1) * (this.height - 1)),
        direction = xPosition === 0 ? 1 : -1,
        yStart = yPosition,
        tries = 0;

    console.log('Try to carve a ' + exitLength + 'px exit'); // TODO remove

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
            context.fillStyle = "darkgrey";
            context.rect(8 * i, 8 * j, 8, 8);
            context.fill();
        }
    }

    return this;
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
 * TODO init description
 *
 * @return {Cave}
 */
Cave.prototype.init = function() {
    // Set the size of the Cave
    this.width = Math.round(Math.seededRandom(1,4)) * 8 + 8;
    this.height = Math.round(Math.seededRandom(1,4)) * 8 + 8;

    // Clear some parameters
    this.map = [];
    this.exits = [];

    // Fill the cave with random data
    this.fill();

    // Generate the cave
    this.generate();

    // And carve some exits
    this.carveExits(1);

    // Finally, return the object
    return this;
}
