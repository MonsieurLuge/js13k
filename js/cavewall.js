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
    var chanceToStartAlive = 0.2;
    var iStart, iEnd, jStart, jEnd;

    //Fill the map with some noise
    for (var i = 0; i < this.width; i++) {
        generatedMap[i] = [];

        for (var j = 0; j < this.height; j++) {
            generatedMap[i][j] = (Math.seededRandom(0, 1) < chanceToStartAlive);
            // generatedMap[i][j] = false;
        }
    }

    // Draw the borders
    if (this.idToBinaryString().charAt(1) === '1') {
        iStart = this.idToBinaryString().charAt(0) === '1' ? 0 : 2;
        iEnd = this.idToBinaryString().charAt(2) === '1' ? 6 : 8;
        // Top
        for (var i = iStart; i < iEnd; i++) {
            generatedMap[i][0] = true;
            generatedMap[i][1] = true;
        }
    } else {
        iStart = this.idToBinaryString().charAt(0) === '0' ? 0 : 2;
        iEnd = this.idToBinaryString().charAt(2) === '0' ? 6 : 8;
        for (var i = iStart; i < iEnd; i++) {
            generatedMap[i][0] = false;
        }
    }

    if (this.idToBinaryString().charAt(3) === '1') {
        jStart = this.idToBinaryString().charAt(2) === '1' ? 0 : 2;
        jEnd = this.idToBinaryString().charAt(4) === '1' ? 6 : 8;
        // Right
        for (var j = jStart; j < jEnd; j++) {
            generatedMap[this.width - 1][j] = true;
            generatedMap[this.width - 2][j] = true;
        }
    } else {
        jStart = this.idToBinaryString().charAt(2) === '0' ? 0 : 2;
        jEnd = this.idToBinaryString().charAt(4) === '0' ? 6 : 8;
        for (var j = jStart; j < jEnd; j++) {
            generatedMap[this.width - 1][j] = false;
        }
    }

    if (this.idToBinaryString().charAt(5) === '1') {
        iStart = this.idToBinaryString().charAt(6) === '1' ? 0 : 2;
        iEnd = this.idToBinaryString().charAt(4) === '1' ? 6 : 8;
        // Bottom
        for (var i = iStart; i < iEnd; i++) {
            generatedMap[i][this.height - 1] = true;
            generatedMap[i][this.height - 2] = true;
        }
    } else {
        iStart = this.idToBinaryString().charAt(6) === '0' ? 0 : 2;
        iEnd = this.idToBinaryString().charAt(4) === '0' ? 6 : 8;
        for (var i = iStart; i < iEnd; i++) {
            generatedMap[i][this.height - 1] = false;
        }
    }

    if (this.idToBinaryString().charAt(7) === '1') {
        jStart = this.idToBinaryString().charAt(0) === '1' ? 0 : 2;
        jEnd = this.idToBinaryString().charAt(6) === '1' ? 6 : 8;
        // Left
        for (var j = jStart; j < jEnd; j++) {
            generatedMap[0][j] = true;
            generatedMap[1][j] = true;
        }
    } else {
        jStart = this.idToBinaryString().charAt(0) === '0' ? 0 : 2;
        jEnd = this.idToBinaryString().charAt(6) === '0' ? 6 : 8;
        for (var j = jStart; j < jEnd; j++) {
            generatedMap[0][j] = false;
        }
    }

    // Run the cellular automaton
    this.map = cellularAutomaton(generatedMap, {generations: 7, cellsToDie: 5, cellsToLive: 4, bordersMatters: true});
    // this.map = generatedMap.slice(0);
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
