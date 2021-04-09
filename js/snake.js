// getting the canvas from the html
const canvas = document.querySelector("#snake");
const ctx = canvas.getContext('2d');
let scoreText = document.querySelector("#scoreText");
const okButton = document.querySelector("#ok");
const resumeButton = document.querySelector("#resumeBtn");
const pauseButton = document.querySelector("#pauseBtn");
const restartButton = document.querySelector("#restart");
let isPlaying = true;

//score
let score = 0;

// box unit
const box = 32;

// snake direction control
let snakeDirection;

// load background image
const backgroundImage = new Image();
backgroundImage.src = "./img/ground.png";

// load food image
const foodImage = new Image();
foodImage.src = "./img/food.png";

// load audio files
let left = new Audio();
let up = new Audio();
let right = new Audio();
let down = new Audio();
let eat = new Audio();
let die = new Audio();

// audio files sources
left.src = "./audio/left.mp3";
up.src = "./audio/up.mp3";
right.src = "./audio/right.mp3";
down.src = "./audio/down.mp3";
eat.src = "./audio/eat.ogg";
die.src = "./audio/dead.mp3";

// create snake
let snake = [];
snake[0] = {
    snakeX: 9 * box,
    snakeY: 10 * box
};
// generates random food position
function randomFoodPostion() {
    let x, y;

    function check(x, y, snakeArray) {
        for (let i = 0; i < snakeArray.length; i++) {
            if (x === snakeArray[i].snakeX && y === snakeArray[i].snakeY) {
                return true;
            }
        }
        return false;
    }
    do {
        x = Math.floor(Math.random() * 17 + 1) * box;
        y = Math.floor(Math.random() * 15 + 3) * box;
    } while (check(x, y, snake) === true);
    return { x, y };
}

let food = {
    foodX: randomFoodPostion().x,
    foodY: randomFoodPostion().y
};

// pause
function pause() {
    isPlaying = false;
    resumeButton.removeAttribute("style");
    pauseButton.setAttribute("style", "border:2px solid red");
    left.play();
}

// resume
function resume() {
    draw();
    isPlaying = true;
    pauseButton.removeAttribute("style");
    resumeButton.setAttribute("style", "border:2px solid green");
    right.play();
}

// input direction
function inputDirection(e) {
    if (e.keyCode == 37 && snakeDirection != "Right") {
        snakeDirection = "Left";
        left.play();
    } else if (e.keyCode == 38 && snakeDirection != "Down") {
        snakeDirection = "Up";
        up.play();
    } else if (e.keyCode == 39 && snakeDirection != "Left") {
        snakeDirection = "Right";
        right.play();
    } else if (e.keyCode == 40 && snakeDirection != "Up") {
        snakeDirection = "Down";
        down.play();
    } else if (e.keyCode == 32) {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    }
}

// check collision with in the body 
function collisionWithInBody(head, snakeArray) {
    for (let i = 0; i < snakeArray.length; i++) {
        if (head.snakeX == snakeArray[i].snakeX && head.snakeY == snakeArray[i].snakeY) {
            return true;
        }
    }
    return false;
}

// drawing the each components
function draw() {
    if (isPlaying) {

        // drawing background image
        ctx.drawImage(backgroundImage, 0, 0);

        // drawing snake
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? "black" : "white";
            ctx.fillRect(snake[i].snakeX, snake[i].snakeY, box, box);
            ctx.strokeStyle = "red";
            ctx.strokeRect(snake[i].snakeX, snake[i].snakeY, box, box);
        }

        // drawing food
        ctx.drawImage(foodImage, food.foodX, food.foodY);

        // old head position
        let oldHeadX = snake[0].snakeX;
        let oldHeadY = snake[0].snakeY;

        //checks for the direction
        if (snakeDirection == "Left") {
            oldHeadX -= box;
        }
        if (snakeDirection == "Up") {
            oldHeadY -= box;
        }
        if (snakeDirection == "Right") {
            oldHeadX += box;
        }
        if (snakeDirection == "Down") {
            oldHeadY += box;
        }

        // checks for the fruits
        if (oldHeadX === food.foodX && oldHeadY === food.foodY) {
            eat.play();
            score++;
            food = {
                foodX: randomFoodPostion().x,
                foodY: randomFoodPostion().y
            };
        } else {
            //remove the tail if the snake doesnot eat fruits
            snake.pop();
        }

        //new Head
        let newHead = {
            snakeX: oldHeadX,
            snakeY: oldHeadY
        };
        if (
            oldHeadX < box ||
            oldHeadX > 17 * box ||
            oldHeadY < 3 * box ||
            oldHeadY > 17 * box ||
            collisionWithInBody(newHead, snake)) {
            die.play();
            clearInterval(game);
            scoreText.innerText = score;
            console.log(scoreText.innerText);
            okButton.addEventListener("click", function() {
                location.reload();
            });
            $('#alertModal').modal('show');
        }
        snake.unshift(newHead);

        // placing score text
        ctx.fillStyle = "white";
        ctx.font = "30px Georgia, serif";
        ctx.fillText(score, 2 * box, 1.5 * box, box);

    }
}


// key events
document.addEventListener("keydown", inputDirection);

//
restartButton.addEventListener("click", function() {
    location.reload();
});
// calling the draw function every 100 miliseconds
let game = setInterval(draw, 100);