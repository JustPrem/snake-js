// References.
const canvas = document.getElementById("gameCanvas");                                   // The Canvas.
const background = document.getElementById("background");                               // The Background Canvas.
const g = canvas.getContext("2d");                                                      // The 2DGraphics Component of the Canvas.
const scoreText = document.getElementById("score");                                     // The Score text label.

scoreText.style.visibility = "hidden";

// Game Variables.
const unitSize = 25;                                                                    // The size of the Units.
const gameSpeed = 125;                                                                  // Speed of the game.
const CANVAS_BORDER_COLOUR = "#FFFFFF";
const CANVAS_BACKGROUND_COLOUR = "#303030";
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const FOOD_COLOUR = 'red';
const FOOD_BORDER_COLOUR = 'darkred';

// Food Position.
var foodX = 0;
var foodY = 0;

// Player Variables.
let score = 0;                                                                          // The Players Current Score.
let changingDirection = false;                                                          // Is the Snake changing directions?
let directionX = 1;
let directionY = 0;
let snake =                                                                             // The Snake Body Parts position array.
[
    {x: 6, y: 6},
    {x: 5, y: 6},
    {x: 4, y: 6},
    {x: 3, y: 6},
    {x: 2, y: 6}
]

// Runtime Code
DrawBoard();

//#region Functions
// Begin the game.
function StartGame()
{
    // Add a keyListener to the site.
    document.addEventListener("keydown", ChangeDirection);

    // Show the score.
    scoreText.style.visibility = "visible";
    
    // Delete the Start Button.
    document.getElementById("startButton").remove();

    CreateFood();
    Main();
}

// The Main Function.
function Main()
{
    // Stop scrolling.
    window.scrollTo(0, 0);

    if (didGameEnd())
    {
        return;
    }
    else
    {
        setTimeout(function onTick() 
        {
            changingDirection = false;
            DrawBoard();
            AdvanceSnake();
            DrawFood();
            DrawSnake();

            // Restart the Game Loop.
            Main();
        }, gameSpeed)
    }
}

// Draw the Board.
function DrawBoard()
{
    // Set the Background and Border colors.
    g.fillStyle = CANVAS_BACKGROUND_COLOUR;
    background.getContext("2d").fillStyle = CANVAS_BORDER_COLOUR;

    // Draw the Background and Border.
    background.getContext("2d").fillRect(0, 0, background.clientWidth, background.clientHeight);
    g.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Set the line width for all elements.
    g.lineWidth = 3;
}
// Draw the Food.
function DrawFood()
{
    // Set up the Food draw.
    g.fillStyle = FOOD_COLOUR;
    g.strokeStyle = FOOD_BORDER_COLOUR;

    // Draw the Food and a Border.
    g.fillRect(foodX * unitSize, foodY * unitSize, unitSize, unitSize);
    g.strokeRect(foodX * unitSize, foodY * unitSize, unitSize, unitSize);
}
// Advance the Snake in the correct Direction.
function AdvanceSnake()
{
    // Create a new head for snake.
    const head = {x: snake[0].x + directionX, y: snake[0].y + directionY};

    // Add the new head to the beginning of the snake body.
    snake.unshift(head);

    // Check if Snake ate the food.
    const isFed = snake[0].x === foodX && snake[0].y === foodY;

    if (isFed)
    {
        // Increase the score.
        score += 1;

        // Update the score.
        scoreText.textContent = "Score: " + score;

        // Generate new food.
        CreateFood();
    }
    else
    {
        // Destroy last snake part (last value in Array)
        snake.pop();
    }
}
// Get random value, between 0 and CanvasWidth / unitSize
function RandomValue()
{
    return Math.round((Math.random() * ((canvas.clientWidth - unitSize) / unitSize)));
}
// Create Food.
function CreateFood()
{
    // Get new Random Position.
    foodX = RandomValue()
    foodY = RandomValue()

    // Make sure it's not inside the snake (not yet at least :> hehe)
    snake.forEach(function isFoodInSnake(part)
    {
        const isInSnake = part.x == foodX && part.y == foodY;
        if (isInSnake)
        {
            CreateFood();
        }
    });
}
// Draw the snake.
function DrawSnake()
{
    // Prepare Snake Colour.
    g.fillStyle = SNAKE_COLOUR;
    g.strokeStyle = SNAKE_BORDER_COLOUR;
    
    for (let i = 0; i < snake.length; i++)
    {
        // Draw the current Snake Part.
        g.fillRect(snake[i].x * unitSize, snake[i].y * unitSize, unitSize, unitSize);
        g.strokeRect(snake[i].x * unitSize, snake[i].y * unitSize, unitSize, unitSize);
    }
}
// Did the Game end?
function didGameEnd()
{
    for (let i = 4; i < snake.length; i++)
    {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y)
        {
        return true
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > (canvas.clientWidth / unitSize) - 1;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > (canvas.clientHeight / unitSize)  - 1;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}
// Change Direction.
function ChangeDirection(event)
{
    // Button KeyCodes.
    const keyUp = 38;
    const keyRight = 39;
    const keyDown = 40;
    const keyLeft = 37;

    // Going certain direction (bools).
    const goingUp = directionY === -1;
    const goingDown = directionY === 1;
    const goingRight = directionX === 1;
    const goingLeft = directionX === -1;

    // Check if not changing directions already.
    if (changingDirection) return;

    // Make sure you can't change directions twice.
    changingDirection = true;

    // Switch Direction.
    switch(event.keyCode)
    {
        case keyUp:
            {
                if (!goingDown)
                {
                    directionY = -1;
                    directionX = 0;
                }
                break;
            }
        case keyRight:
            {
                if (!goingLeft)
                {
                    directionX = 1;
                    directionY = 0;
                }
                break;
            }
        case keyDown:
            {
                if (!goingUp)
                {
                    directionY = 1;
                    directionX = 0
                }
                break;
            }
        case keyLeft:
            {
                if (!goingRight)
                {
                    directionX = -1;
                    directionY = 0;
                }
                break;
            }
    }
}

//#endregion