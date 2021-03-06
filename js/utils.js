/**
 * TODO seededRandom description
 *
 * @param  {integer} min
 * @param  {integer} max
 * @return {float}
 */
Math.seededRandom = function(min, max) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;

    return min + rnd * (max - min);
};

/**
 * Use a cellular automaton to create caves
 * @param  {Array} map          The map to use
 * @param  {Object} parameters  {generations, cellsToDie, cellsToLive}
 * @return {Array}              The map after some generations
 */
function cellularAutomaton(map, parameters) {
    for (var generation = 1; generation <= parameters.generations; generation++) {
        var clonedMap = map.slice(0);

        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[0].length; j++) {
                var neighbours = neighbourCells(clonedMap, i, j);

                if (clonedMap[i][j] === true) {
                    if (true === parameters.bordersMatters && (neighbours.deadCells > parameters.cellsToDie || neighbours.aliveCells <= 1)) {
                        map[i][j] = false;
                    } else  if (neighbours.deadCells > parameters.cellsToDie) {
                        map[i][j] = false;
                    }
                } else {
                    if (true === parameters.bordersMatters && (neighbours.aliveCells > parameters.cellsToLive || neighbours.deadCells <= 1)) {
                        map[i][j] = true;
                    } else if (neighbours.aliveCells > parameters.cellsToLive) {
                        map[i][j] = true;
                    }
                }
            }
        }
    }

    return map;
}

/**
 * Clears the canvas
 *
 * @return {nothing}
 */
function clearScreen() {
    canvas.width = canvas.width;
}

/**
 * Draw a grid on the canvas, for test purpose only
 * TODO remove
 *
 * @return {nothing}
 */
function drawGrid() {
    var roomSize = 20;

    context.strokeStyle = "#414141";
    context.lineWidth = 2;

    for (var i = 0; i < canvas.width / 8 * roomSize; i++) {
        context.beginPath();
        context.moveTo(8 * roomSize * i, 0);
        context.lineTo(8 * roomSize * i, canvas.height);
        context.stroke();
    }

    for (var j = 0; j < canvas.height / 8 * roomSize; j++) {
        context.beginPath();
        context.moveTo(0, 8 * roomSize * j);
        context.lineTo(canvas.width, 8 * roomSize * j);
        context.stroke();
    }
}

/**
 * TODO getDirection description
 *
 * @param  {integer} directionId
 * @return {object}
 */
function getDirection(directionId) {
    switch (directionId) {
        case 1:
        case 'top':
            return {x: 0, y: -1, direction: 1, to: 'top'};
        case 2:
        case 'right':
            return {x: 1, y: 0, direction: 2, to: 'right'};
        case 3:
        case 'bottom':
            return {x: 0, y: 1, direction: 3, to: 'bottom'};
        case 4:
        case 'left':
            return {x: -1, y: 0, direction: 4, to: 'left'};
        default:
            return {x: 0, y: 0, from: 'nowhere'};
    }
}

/**
 * TODO neighbourCells description
 *
 * @param  {array} data
 * @param  {integer} cellX
 * @param  {integer} cellY
 * @return {object}
 */
function neighbourCells(data, cellX, cellY) {
    var result = {
        deadCells: 0,
        aliveCells: 0,
        borders: 0,
        neighbours: [],
    };

    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            var neighbourX = cellX + i;
            var neighbourY = cellY + j;

            if (i === 0 && j === 0) {
                result.neighbours[i + 1 + 3 * (j + 1)] = false;

                continue;
            }

            if (neighbourX < 0 || neighbourX >= data.length || neighbourY < 0 || neighbourY >= data[0].length) {
                result.borders++;
                result.neighbours[i + 1 + 3 * (j + 1)] = true;

                continue;
            }

            if (data[neighbourX][neighbourY] === true) {
                result.aliveCells++;
                result.neighbours[i + 1 + 3 * (j + 1)] = true;
            } else {
                result.deadCells++;
                result.neighbours[i + 1 + 3 * (j + 1)] = false;
            }
        }
    }

    return result;
}

/**
 * TODO setSeed description
 *
 * @param {integer} seed
 * @return {integer} seed
 */
function setSeed(seed) {
    if (seed === parseInt(seed)) {
        Math.seed = seed;
    } else {
        Math.seed = Math.round(Math.random() * 32000);
    }

    return Math.seed;
}
