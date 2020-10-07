/*
For sound extension,  I downloaded my sound mp3 on https://www.zapsplat.com/sound-effect-category/game-sounds/.

 */


var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var collectables;
var canyon;
var clouds;
var mountains;

var game_score;
var flagpole;
var lives;

var jumpSound;
var collectItemSound;
var successSound;

var enemies;

function preload()
{
    soundFormats('mp3','wav');

    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);

    collectItemSound = loadSound('assets/eatItem_1.mp3');
    collectItemSound.setVolume(0.1);

    successSound = loadSound('assets/cartoon_success.mp3')
    successSound.setVolume(0.1, 2, 0 );
}


function setup()
{
	createCanvas(1024, 576);

    floorPos_y = height * 3/4;
    lives = 3;
    startGame();

}

function draw()
{
    background(100, 155, 255); // fill the sky blue
    noStroke();
    fill(0,155,0);
    rect(0, floorPos_y, width, height/4); // draw some green ground

    ///////////////////////////////////////
    push();
    translate(scrollPos, 0)

    ///////////////////////////////////////

    //***** Option: if you want the game character not going backward(left) where there is nothing*****
    // if( gameChar_world_x < 0)
    // {
    //     isLeft = false;
    // }

    if(game_score > 1)
    {
        drawSun();
    }


    // Draw mountains.
    drawMountains();

    // Draw clouds.
    drawClouds();

    // Draw trees.
    drawTrees();

    // drawSun()


    // Draw canyons.
    for ( var i = 0; i < canyon.length; i++){
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    }
    // Draw collectable items.
    for ( var i = 0; i < collectables.length; i++){
        //checkCollectable(collectables[i]);
        if (collectables[i].isFound == false){
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }



    renderFlagpole();
    ///////////////////////////////////////////

    pop();
    // go back to the original background
    ///////////////////////////////////////////

    //Draw game_score.
    fill(255);
    noStroke();
    textFont('monospace', 24);
    text("score:" + game_score, 20, 25);

    //Draw life heart shape
    fill(255);
    noStroke();
    textFont('monospace', 24);
    text("life: ", 20, 55);

    for (var i = 0; i < lives; i++)
    {
        heartShape(110 + i * 28, 38, 20);
    }

    // When life is 0, Game over and press Space to restart
    textFont('monospace', 24)
    if(lives < 1)
    {
        textFont('monospace', 32);
        text("GAME OVER", width/2 - 40, height/2);
        textFont('monospace', 24);
        text("\nPress [space] to play again.", width/2 - 150, height/2);
        return;
    }

    checkFlagpole();

    if (flagpole.isReached == true)
    {
        checkFlagpole();
        fill('white');
        textFont('monospace', 32);
        text("Level complete", width/2 - 100, height/2);
        text("\nPress [space] to play again.", width/2 - 210, height/2);
    }



    // Player will die when falling into the canyon
    checkPlayerDie()

    //When the player reaches the flag, "Leve complete" will show up
    textFont('monospace', 48);

    // Draw game character.
    drawGameChar();

    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos ;



}

// ---------------------
// Key control functions
// ---------------------
function keyPressed(){

    console.log("press" + keyCode);
    console.log("press" + key);
    if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = true;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = true;
    }
    else if(keyCode == 32)
    {
        console.log("space");
        isPlummeting = true;
        jumpSound.play();

    }

    // press Space to play again when live is 0
    if ( lives == 0 && keyCode == 32)
    {
        lives = 3
        startGame();
    }

    // press Space to play again after completion
    if (flagpole.isReached == true && keyCode == 32)
    {
        startGame();
    }

    // cannot control character after completion
    if(flagpole.isReached == true)
    {
        isLeft = false;
        isRight = false;
        isPlummeting = false;
    }

}

function keyReleased(){
    console.log("release" + keyCode);
    console.log("release" + key);

    if(keyCode == 37)
    {
        console.log("left arrow" );
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow" );
        isRight = false;
    }
    else if(keyCode == 32)
    {
        console.log("space");
        isPlummeting = false;
    }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
    if (lives == 0){
        return;
    }

    //the game character
    if(isLeft && isFalling)
    {
        // add your jumping-left code
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 52, 25);

        //Body
        fill(0, 0, 0);
        rect(gameChar_x - 7.5, gameChar_y - 40, 15, 30);

        //Legs
        fill(200, 150, 150);
        rect(gameChar_x - 20, gameChar_y - 18, 15, 10);
        rect(gameChar_x - 1, gameChar_y - 15, 10, 15);

        //Hat
        fill(255, 255, 0);
        rect(gameChar_x - 18, gameChar_y - 60, 35, 2);
        rect(gameChar_x - 10, gameChar_y - 70, 20, 10);

        //Arms
        fill(200, 150, 150);
        rect(gameChar_x - 23, gameChar_y - 40, 16, 7);
        rect(gameChar_x , gameChar_y - 40, 7, 20);

    }
    else if(isRight && isFalling)
    {
        // add your jumping-right code
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 52, 25);

        //Body
        fill(0, 0, 0);
        rect(gameChar_x - 7.5, gameChar_y - 40, 15, 30);

        //Legs
        fill(200, 150, 150);
        rect(gameChar_x - 10, gameChar_y - 16, 10, 15);
        rect(gameChar_x + 3, gameChar_y - 15, 15, 10);

        //Hat
        fill(255, 255, 0);
        rect(gameChar_x - 18, gameChar_y - 60, 35, 2);
        rect(gameChar_x - 10, gameChar_y - 70, 20, 10);

        //Arms
        fill(200, 150, 150);
        rect(gameChar_x - 7, gameChar_y - 40, 7, 20);
        rect(gameChar_x + 4 , gameChar_y - 40, 16, 7);

    }
    else if(isLeft)
    {
        // add your walking left code
        //Add your code here ...
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 52, 25);

        //Body
        fill(0, 0, 0);
        rect(gameChar_x - 7.5, gameChar_y - 40, 15, 30);

        //Legs
        fill(200, 150, 150);
        rect(gameChar_x - 15, gameChar_y - 10, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 10, 10, 10);

        //Hat
        fill(255, 255, 0);
        rect(gameChar_x - 18, gameChar_y - 60, 35, 2);
        rect(gameChar_x - 10, gameChar_y - 70, 20, 10);

        //Arms
        fill(200, 150, 150);
        rect(gameChar_x - 23, gameChar_y - 40, 16, 7);
        rect(gameChar_x , gameChar_y - 40, 7, 20);
    }
    else if(isRight)
    {
        // add your walking right code
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 52, 25);

        //Body
        fill(0, 0, 0);
        rect(gameChar_x - 7.5, gameChar_y - 40, 15, 30);

        //Legs
        fill(200, 150, 150);
        rect(gameChar_x - 15, gameChar_y - 10, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 10, 10, 10);

        //Hat
        fill(255, 255, 0);
        rect(gameChar_x - 18, gameChar_y - 60, 35, 2);
        rect(gameChar_x - 10, gameChar_y - 70, 20, 10);

        //Arms
        fill(200, 150, 150);
        rect(gameChar_x + 5, gameChar_y - 40, 16, 7);
        rect(gameChar_x - 7, gameChar_y - 40, 7, 20);


    }
    else if(isFalling || isPlummeting)
    {
        // add your jumping facing forwards code

        //Head
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 52, 25);

        //Body
        fill(0, 0, 0);
        rect(gameChar_x - 13, gameChar_y - 40, 26, 25);

        //Legs
        fill(200, 150, 150);
        rect(gameChar_x - 20, gameChar_y - 20, 15, 10);
        rect(gameChar_x + 5, gameChar_y - 20, 15, 10);

        //Hat
        fill(255, 255, 0);
        rect(gameChar_x - 18, gameChar_y - 66, 35, 2);
        rect(gameChar_x - 10, gameChar_y - 76, 20, 10);

        //Arms
        fill(200, 150, 150);
        rect(gameChar_x - 24, gameChar_y - 40, 16, 7);
        rect(gameChar_x + 9, gameChar_y - 40, 16, 7);

    }
    else
    {
        // add your standing front facing code
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 52, 25);

        //Body
        fill(0, 0, 0);
        rect(gameChar_x - 13, gameChar_y - 40, 26, 30);

        //Legs
        fill(200, 150, 150);
        rect(gameChar_x - 15, gameChar_y - 10, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 10, 10, 10);

        //Hat
        fill(255, 255, 0);
        rect(gameChar_x - 18, gameChar_y - 60, 35, 2);
        rect(gameChar_x - 10, gameChar_y - 70, 20, 10);

        //Arms
        fill(200, 150, 150);
        rect(gameChar_x - 16, gameChar_y - 40, 5, 18);
        rect(gameChar_x + 11, gameChar_y - 40, 5, 18);
    }


    //Jumping
    if ( gameChar_y == floorPos_y && isPlummeting == true )
    {
        gameChar_y -= 120;
        //isPlummeting == true;
    }
    //Gravity
    if ( gameChar_y < floorPos_y)
    {
        // for(var i = 0; i < platforms.length; i++)
        //     {
        //         platforms[i].checkContact(gameChar_world_x, gameChar_y);
        //     }
        gameChar_y += 10;
        isFalling = true;
    }

    else{
        isFalling = false;
    }

    // Logic to make the game character move or the background scroll.
    if(isLeft)
    {
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 10;
        }
        else
        {
            scrollPos += 10;
        }
    }

    if(isRight)
    {
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 10;
        }
        else
        {
            scrollPos -= 10; // negative for moving against the background
        }
    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)
    {
        fill(255);
        ellipse(clouds[i].x_pos + 200, clouds[i].y_pos + 50, clouds[i].radius * 1.1);

        ellipse(clouds[i].x_pos - 20 + 200 , clouds[i].y_pos - 1 + 50, clouds[i].radius, clouds[i].radius - 10);

        ellipse(clouds[i].x_pos + 20 + 200, clouds[i].y_pos+ 2 + 50, clouds[i].radius, clouds[i].radius - 10);
    }
}



// Function to draw mountains objects.
function drawMountains()
{
    for (var i = 0; i < mountains.length; i++)
    {
        fill(139, 69, 19);
        triangle(mountains[i].x_pos, mountains[i].y_pos, mountains[i].x_pos + 470 + mountains[i].size, mountains[i].y_pos, (mountains[i].x_pos + mountains[i].x_pos + 470 + mountains[i].size) / 2, mountains[i].y_pos - 352 - mountains[i].size);
        triangle( mountains[i].x_pos - 130, mountains[i].y_pos, mountains[i].x_pos + 220 + mountains[i].size, mountains[i].y_pos, (mountains[i].x_pos - 130 + mountains[i].x_pos + 220 + mountains[i].size) /2, mountains[i].y_pos - 232 - mountains[i].size);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    {
        fill(160, 82, 45);
        rect(trees_x[i], height/2 + 4, 40, 140);
        fill(107, 142, 35);
        ellipse(trees_x[i] + 20, height/2, 150);
    }
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------
// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    fill(100, 155, 255)
    rect(t_canyon.x_pos, 432, t_canyon.width, height);

    fill(0, 105, 148);
    rect(t_canyon.x_pos , 432 + 95, t_canyon.width, height);
}
// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if ((gameChar_world_x > t_canyon.x_pos && gameChar_world_x < (t_canyon.x_pos+t_canyon.width)) && gameChar_y >= floorPos_y)
    {
        isPlummeting = true; // Animation
        gameChar_y += 5; //Falling down canyon

        isLeft = false; //Can't move after falling
        isRight = false;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{

    fill(222, 184, 135);
    triangle(t_collectable.x_pos, t_collectable.y_pos,
        t_collectable.x_pos + t_collectable.size, t_collectable.y_pos, (t_collectable.x_pos + t_collectable.x_pos + t_collectable.size)/ 2  , t_collectable.y_pos + t_collectable.size);

    fill(255, 250, 205);
    ellipse((t_collectable.x_pos + t_collectable.x_pos +
        t_collectable.size)/ 2 , t_collectable.y_pos, t_collectable.size * 1);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 60)
    {
        t_collectable.isFound = true;
        game_score += 1;
        collectItemSound.play();
    }
}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(100);
    line(flagpole.x_pos, floorPos_y - 3, flagpole.x_pos, floorPos_y - 250);

    fill("red");
    noStroke();

    // When the character reaches the flag, the flag will fall.
    if(flagpole.isReached == true)
    {
        rect(flagpole.x_pos, (floorPos_y  - 200) + 150, 50, 50);
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y  - 250 , 50, 50);
    }
    pop();

}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15)
    {
        flagpole.isReached = true;
        successSound.play();
    }
}

function checkPlayerDie()
{
    fill(255);
    textFont('monospace', 48);
    if (gameChar_y >= height)
    {
        lives -= 1;

        if ( lives > 0)
        {
            startGame();
        }
        else{
            return lives = 0;
        }
    }
}

function startGame()
{
    gameChar_x = width/2 - 300;
    gameChar_y = floorPos_y;


    // Variable to control the background scrolling.
    scrollPos = 100;

    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Initialise arrays of scenery objects.
    collectables = [{x_pos: -90, y_pos: 330, size: 30, isFound: false},
        {x_pos: 500, y_pos: 400, size: 30, isFound: false},
        {x_pos: 1000, y_pos: 330, size: 30, isFound: false},
        {x_pos: 1320, y_pos: 350, size: 30, isFound: false},
        {x_pos: 2000, y_pos: 400, size: 30, isFound: false},
        {x_pos: 2500, y_pos: 330, size: 30, isFound: false},
        {x_pos: 2800, y_pos: 400, size: 30, isFound: false},];

    for( var i = 0; i < 3; i++)
    {
        collectables.push({x_pos: random(0, 3000), y_pos: random(400, 320), size: 30, isFound: false});
    }

    trees_x = [100, 300, 1000, 1500, 2000, 3400];

    clouds = [{x_pos: 50, y_pos: 85,radius: 75},
        {x_pos: 300, y_pos: 45,radius: 75},
        {x_pos: 500, y_pos: 70,radius: 75},
        {x_pos: 700, y_pos: 40,radius: 75},
        {x_pos: 1000, y_pos: 70,radius: 75},
        {x_pos: 1300, y_pos: 90,radius: 75},
        {x_pos: 1500, y_pos: 70,radius: 75},
        {x_pos: 1800, y_pos: 30,radius: 75}];

    mountains = [{x_pos: 610, y_pos: floorPos_y, size: 0},
        {x_pos: 1700, y_pos: floorPos_y, size: -50},
        {x_pos: 2700, y_pos: floorPos_y, size: -50}];

    canyon = [
        {x_pos: -220, width:150},
        {x_pos: 200, width: 65},
        {x_pos: 1300, width: 65},
        {x_pos: 2300, width: 65}];

    game_score = 0;

    flagpole = {x_pos: 3200,
        isReached: false};


}

function heartShape(x, y, size)
{
    fill("firebrick");
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}


function Enemy(x, y, range)
{
    this.x = x ;
    this.y = y ;
    this.range = range ;

    this.currentX = x;
    this.inc = 1;

    this.update = function()
    {

        this.currentX += this.inc;

        if (this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        else if (this.currentX < this.x)
            {
                this.inc = 1;
            }

    }

    this.draw = function()
    {
        this.update();
        fill(255, 0, 0)
        ellipse(this.currentX, this.y, 20, 20);
    }

    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)

        if(d < 10)
            {
                return true;
            }
        return false;
    }
}


function drawSun(){
    var r = random(-500 , 500);
    push();
    translate(gameChar_world_x - 50, 0);
    fill("orange")
    for (var i = 0; i < 16; i ++) {
        rect(0, 25, random(15,20), random(70,100));
        rotate(PI/8);
    }

    fill("orange")
    ellipse(0, 0, 150, 150);
    pop();

}





