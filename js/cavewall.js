/**
 * TODO CaveWall description
 *
 * @return {CaveWall}
 */
 function CaveWall(id) {
    this.width = 8;
    this.height = 8;
    this.id = id;
    this.map = [];

    return this;
}

/**
 * TODO generate description
 */
CaveWall.prototype.generate = function() {
    var generatedMap = [];
    var chanceToStartAlive = 0.25;

    // Fill the map with some noise
    for (var i = 0; i < this.width; i++) {
        generatedMap[i] = [];

        for (var j = 0; j < this.height; j++) {
            generatedMap[i][j] = (Math.seededRandom(0, 1) < chanceToStartAlive);
        }
    }

    // Draw the borders
    // TODO

    // Run the cellular automaton
    this.map = cellularAutomaton(generatedMap, {generations: 7, cellsToDie: 5, cellsToLive: 4, bordersMatters: true});
};

/**
 * TODO idToBinaryString description
 *
 * @return {String}
 */
CaveWall.prototype.idToBinaryString = function() {
    var binaryString = '';

    var idToString = Number(this.id).toString(2);

    for (var n = 0; n < 8; n++) {
        if (idToString.charAt(n) !== '') {
            binaryString += idToString.charAt(n);
        } else {
            binaryString += '0';
        }
    }

    return binaryString;
};
