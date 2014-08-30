/**
 * TODO World description
 */
function World(seed) {
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
    this.map = [];
    this.caves = [];
    this.currentCave = null;
    this.maxCaveWidth = 4;
    this.maxCaveHeight = 4;
    this.seed = seed;

    this.init();
}

/**
 * TODO caveExists description
 * @return {boolean}
 */
World.prototype.caveExists = function(x, y) {
    // If the coordinates are out of the map boundaries, return false
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
        return false;
    }

    // If there is no data at these coordinates, return false
    if (this.map[x] === undefined) {
        return false;
    }

    if (this.map[x][y] === undefined) {
        return false;
    }

    // If there is a cave Id at these coordinates, return true
    return this.map[x][y] !== undefined;
};

/**
 * TODO createCave description
 */
World.prototype.createCave = function(x, y) {
    console.log('create a cave at ' + x + ',' + y);


};

/**
 * TODO draw description
 * @return {[type]} [description]
 */
World.prototype.draw = function() {
    for (var i = 0; i < this.caves[this.currentCave].width; i++) {
        for (var j = 0; j < this.caves[this.currentCave].height; j++) {
            if (this.caves[this.currentCave].map[i][j] === false) {
                continue;
            }

            if (this.caves[this.currentCave].map[i][j] === 'searched') {
                context.fillStyle = '#6e9e65';
            } else {
                context.fillStyle = "#bcbcbc";
            }

            context.beginPath();
            context.rect(8 * i, 8 * j, 8, 8);
            context.fill();
        }
    }
};

/**
 * TODO explore description
 * @return {[type]} [description]
 */
World.prototype.explore = function(x, y, direction) {
    // If there is no exit in this map cell, return false
    if (false === this.caves[this.currentCave].exitExists(x, y, direction)) {
        return false;
    }

    // Is there is no cave in the next map cell, generate the cave
    if (false === this.caveExists(x + getDirection(direction).x, y + getDirection(direction).y)) {
        this.createCave(x + getDirection(direction).x, y + getDirection(direction).y);
    }

    // Then move to the next cave
    // TODO
};

/**
 * TODO getCaveId description
 * @return {string}
 */
World.prototype.getCaveId = function(x, y) {
    if (true === this.caveExists(x, y)) {
        return  this.map[x][y].id;
    }

    return null;
};

/**
 * TODO init description
 * @return {[type]} [description]
 */
World.prototype.init = function() {
    // Delete all explored caves
    this.caves = [];

    // Init some things
    this.x = 0;
    this.y = 0;
    this.width = 5;
    this.height = 5;
    this.map = [[]];

    // Create the starting room
    var caveId = 0;
    this.caves[0] = new Cave({
        id: caveId,
        // seed: this.seed,
        seed: this.seed,
        type: 'underground',
        x: 0,
        y: 0,
        width: 5,
        height: 5,
        exits: [
            {
                x: 0,
                y: 0,
                direction: 'top',
                linked: true
            },
            {
                x: 4,
                y: 1,
                direction: 'right'
            },
            {
                x: 3,
                y: 4,
                direction: 'bottom',
                linked: true
            }
        ]
    });

    // Store the first cave id
    this.map[0][0] = caveId;

    // Then, store the current cave
    this.currentCave = 0;

};
