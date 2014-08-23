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
    for (var i = 0; i < canvas.width / 64; i++) {
        context.beginPath();
        context.strokeStyle = "#353535";
        context.moveTo(64 * i, 0);
        context.lineTo(64 * i, canvas.height);
        context.stroke();
    }

    for (var j = 0; j < canvas.height / 64; j++) {
        context.beginPath();
        context.strokeStyle = "#353535";
        context.moveTo(0, 64 * j);
        context.lineTo(canvas.width, 64 * j);
        context.stroke();
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
        borders: 0
    };

    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            var neighbourX = cellX + i;
            var neighbourY = cellY + j;

            if (i === 0 && j === 0) {
                continue;
            }

            if (neighbourX < 0 || neighbourX >= data.length || neighbourY < 0 || neighbourY >= data[0].length) {
                result.borders++;

                continue;
            }

            if (data[neighbourX][neighbourY] === true) {
                result.aliveCells++;
            } else {
                result.deadCells++;
            }
        }
    }

    return result;
}

/**
 * TODO setSeed description
 *
 * @param {integer} seed
 */
function setSeed(seed) {
    if (seed === parseInt(seed)) {
        Math.seed = seed;
    } else {
        Math.seed = Math.round(Math.random() * 32000);
    }
}
