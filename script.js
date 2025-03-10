window.onload = function() 
{   
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakey;
    var appley;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;
    init();


    function init() 
    {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height  = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakey = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]],"right");
        appley = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }
    
    function refreshCanvas()
    {   
        snakey.advance();
        if(snakey.checkCollision())
        {
          gameOver();

        } else {
            if(snakey.ItEatingApple(appley))
            {   
                score++;
                snakey.Ateapple = true;
                do
            {
               appley.SetNewPosition();
            }
            while(appley.isOnSnake(snakey))

            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snakey.draw();
            appley.draw();
            timeout = setTimeout(refreshCanvas,delay);
             
        }
        
        
    }
    function gameOver()
    {
        ctx.save();
        
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth /2;
        var centreY = canvasHeight /2;
        ctx.strokeText("GAME OVER" , centreX, centreY - 180);
        ctx.fillText("GAME OVER", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }
    function restart()
    {
        snakey = new Snake ([[6,4], [5,4], [4,4], [3,4], [2,4]] , "right");
        appley = new Apple ([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        var centreX = canvasWidth /2;
        var centreY = canvasHeight /2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }
    function drawBlock(ctx, position)
    {
       var x = position[0] * blockSize;
       var y = position[1] * blockSize;
       ctx.fillstyle = "#ff0000";
       ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction)
    {
        this.body = body;
        this.direction = direction;
        this.Ateapple = false;
        this.draw = function()
        {
             ctx.save();
             ctx.fillStyle = "#ff0000";
             for(var i = 0; i < this.body.length; i++ )
             {
                drawBlock(ctx, this.body[i]);
             }
                ctx.restore();
        };
            this.advance = function()
            {
            var nextPosition = this.body[0].slice();
            switch (this.direction)
            {
                case "left":
                    nextPosition[0] -= 1;
                      break;
                case "right":
                    nextPosition[0] += 1;
                      break;
                case "down":
                    nextPosition[1] += 1;
                      break;
                case "up":
                    nextPosition[1] -= 1;
                      break;
                    default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.Ateapple){ 
            this.body.pop();
            } else {  this.Ateapple = false;
            }
        };
            this.setDirection = function (newDirection)
            {
            var allowedDirection;
            switch (this.direction)
            {
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down":
                case "up":
                   allowedDirection = ["left", "right"];
                   break;
                   default:
                    throw("Invalid Direction");
            }
                if (allowedDirection.indexOf(newDirection) > -1)
                {
                    this.direction = newDirection;
                }
            };
            this.checkCollision = function ()
            {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks -1;
            var maxY = heightInBlocks -1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                wallCollision = true;
            }

            for(var i = 0; i < rest.length; i++ )
            {
                if (snakeX === rest[i] [0] && snakeY === rest [i] [1])
                {
                  snakeCollision = true;  
                }
            }

            return wallCollision || snakeCollision;
            };
            this.ItEatingApple= function(appleToEat)
            {
              var head = this.body[0];
              if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
               return true;
               else 
               return false
            };
    }
                function Apple (position)
                {
                    this.position = position;
                    this.draw = function()
                    {
                      ctx.save();
                      ctx.fillStyle = "#33cc33";
                      ctx.beginPath();
                      var radius = blockSize/2;
                      var x = this.position[0]*blockSize + radius;
                      var y = this.position[1]*blockSize + radius;
                      ctx.arc(x, y, radius, 0, Math.PI*2, true); 
                      ctx.fill();
                      ctx.restore();
                    };
                    this.SetNewPosition = function()
                    {
                      var newX = Math.round(Math.random() * (widthInBlocks - 1))
                      var newY = Math.round(Math.random() * (heightInBlocks - 1))
                      this.position = [newX , newY];
                    };
                    this.isOnSnake = function(snakeToCheck)
                    {
                      var isOnSnake = false;
                      for(var i = 0; i < snakeToCheck.body.length ; i++)
                      {
                        if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
                        {
                            isOnSnake = true;
                        }  
                      }
                      return isOnSnake
                    };
                }


    document.onkeydown = function handleKeyDown(e)
    {
        var key = e.key;
        var newDirection;
        switch(key)
        {
            case "ArrowLeft":
                newDirection = "left";
                break;
            case "ArrowUp":
                newDirection = "up";
                break;
            case "ArrowRight":
                newDirection = "right";
                break;
            case "ArrowDown":
                newDirection = "down";
                break;
            case " ":
                restart();
                return;
            default:
                return;
        }
        snakey.setDirection(newDirection);
    }
    }