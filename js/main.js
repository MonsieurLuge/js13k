/**
 * Exploration game, about the 4th Elements
 * JS13K - 2014
 *
 * @author: Monsieur Luge
 */

var canvas = document.getElementById("js13k-2014");
var context = canvas.getContext('2d');
var frameRate = 1000/60;
var seed = null;
var world = null;

/**
 * TODO gameLoop description
 *
 * @return {[type]}
 */
function gameLoop() {
    clearScreen();

    setTimeout(gameLoop, frameRate);
}

/**
 * TODO startGame description
 *
 * @param  {integer} seed
 * @return {nothing}
 */
function startGame(seed) {
    // Set the seed for this game
    seed = setSeed(seed);
    window.document.getElementById('game-seed').innerHTML = seed; // TODO remove

    // For test purpose
    clearScreen();
    //drawGrid();

    // Create the world
    world = new World(seed);

    // Create a cave
    //world.explore();

    // Draw the world
    world.draw();

    // Draw the cave walls
    // TODO remove, for test purpose
    //world.drawCaveWalls();

    // TODO
    //gameLoop();
}

// START THE GAME !
window.onload = startGame(4);
