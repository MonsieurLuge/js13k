/**
 * TODO World description
 */
function World() {
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
    this.map = [];
    this.caves = [];

    this.init();
}

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

            context.beginPath();
            context.fillStyle = "#bcbcbc";
            context.rect(8 * i, 8 * j, 8, 8);
            context.fill();
        }
    }
};

/**
 * TODO explore description
 * @return {[type]} [description]
 */
World.prototype.explore = function() {

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
    this.width = 0;
    this.height = 0;

    // Create the starting room
    this.caves[0] = new Cave({
        id: 0,
        type: 'underground',
        width: 4,
        height: 3,
        exits: [
            {
                x: 0,
                y: 0,
                direction: 'top'
            },
            {
                x: 0,
                y: 2,
                direction: 'bottom'
            },
            {
                x: 3,
                y: 1,
                direction: 'right'
            }
        ]
    });

    this.currentCave = 0;

};
