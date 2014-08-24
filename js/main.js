/**
 * Exploration game, about the 4th Elements
 * JS13K - 2014
 *
 * @author: Monsieur Luge
 */

var canvas = document.getElementById("js13k-2014");
var context = canvas.getContext('2d');
var frameRate = 1000/60;
var seed = '-';

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
    drawGrid();

    // Create a cave
    var cave1 = new Cave();

    // Draw the cave
    cave1.draw(context);

    // TODO
    //gameLoop();
}

// START THE GAME !
window.onload = startGame(2014);
