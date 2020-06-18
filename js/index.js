var cnv=document.getElementById("gameCanvas");
var ctx=cnv.getContext("2d");

cnv.height=document.documentElement.clientHeight;
cnv.width=document.documentElement.clientWidth;
if(cnv.width>cnv.height){
    cnv.width=cnv.height;
}

//===========================================
//Images

var arena       = new Image();
var charImage   = new Image();
var cloudImage  = new Image();
var restartImage= new Image();
var playButton  = new Image();
var gameOver    = new Image();

arena.src       = "img/arena.jpg"
charImage.src   = "img/me.png";
cloudImage.src  = "img/cloud.png";
restartImage.src= "img/restart.png";
playButton.src  = "img/playButton.png";
gameOver.src    = "img/gameOver.png";

//===============================================

var reStart     = true;
var gameState   = "play";
var isTouch     = false;
var isAlive     = true;
var startTime   = 0;
var isLoad      = true;

//================================================
//Disable Scroll
function disableScroll(){
    scrollTop=window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft=window.pageXOffset || document.documentElement.scrollLeft;
}
window.onscroll=function(){
    disableScroll();
    window.scrollTo(0,0);
}
//===================================================

function drawText(text,x,y,color)
{
    ctx.fillStyle=color;
    ctx.font="45px fantasy";
    ctx.fillText(text,x,y);
}

function drawScore(text,x,y,color)
{
    ctx.fillStyle=color;
    ctx.font="35px fantasy";
    ctx.fillText(text,x,y);
}

const char={
    x:cnv.width/2,
    y:cnv.height/2,
    width:0.2*cnv.width,
    height:0.12*cnv.height
}


function render(){
    ctx.drawImage(arena,0,0,cnv.width,cnv.height);
    ctx.drawImage(charImage,char.x,char.y,char.width,char.height);
    drawScore(input.value(),(cnv.width/4)-45,45,"CYAN");
    if(isAlive==true){
        drawScore(Math.ceil((new Date() - startTime) / 1000),3*(cnv.width/4),45,"CYAN")
    }
    
    for (i in objects) {
            object = objects[i];
    ctx.beginPath();
    ctx.fillStyle = object.color;
    ctx.arc(object.centerX, object.centerY, object.radius, 0, 2 * Math.PI);
    ctx.fill();
    
    
    //=====================================================================================    
    //After Death
    if(isAlive==false){
        var score = Math.ceil((new Date() - startTime) / 1000);
        if (score < 0)
            score *= -1;
        ctx.drawImage(gameOver,cnv.width/4,cnv.height/4-(cnv.height/4)/2,(cnv.width/2),cnv.height/4);
        drawText("Score : " + score, cnv.width / 4 , 3*(cnv.height / 4) ,"WHITE");
        ctx.drawImage(restartImage,(cnv.width/2)-((0.32*cnv.height)/4),300,(0.22*cnv.height)/2,(0.22*cnv.height)/2);
        
        cnv.addEventListener("click",function(e){
        if(e.x>(cnv.width/2)-((0.32*cnv.height)/4) && e.x<((cnv.width/2)-((0.32*cnv.height)/4))+((0.22*cnv.height)/2) && e.y>300 && e.y<300+((0.22*cnv.height)/2)){  
            if(isAlive==false){
                objects.length=0;
                incrementEnemy();
                isAlive=true;
                startTime = new Date();
                score=0;
            }
        }
    
    });
    }
    }
}

function update(){
    
    if(char.x<0){
        char.x=0;
    }
    if(char.x+char.width>cnv.width)
        char.x=cnv.width-char.width;
    if(char.y<0)
        char.y=0;
    if(char.y+char.height>cnv.height)
        char.y=cnv.height-char.height;
    
    cnv.addEventListener("touchstart",function(e){
        var touch=e.targetTouches[0];
        var x=touch.clientX;
        var y=touch.clientY;
        
        if(x>char.x && x<(char.x+char.width) && y>char.y && y<char.y+char.height){
            isTouch=true;
        }
        else
        {
            isTouch=false;
        
        }
    });
        cnv.addEventListener("touchmove",function(e){
            if(isTouch==true){
                char.x=e.targetTouches[0].clientX-(char.width/2);
                char.y=e.targetTouches[0].clientY-(char.height/2);
            }
        });
    
}

  function init() {
        objects = [
        ];
        incrementEnemy();
    }

 function incrementEnemy() {
        if (objects.length < 10) {
            r = Math.ceil(Math.random() * 255);
            g = Math.ceil(Math.random() * 255);
            b = Math.ceil(Math.random() * 255);
            color = "rgba(" + r + "," + g + "," + b + ",0.5)";
            xPosition = cnv.width * Math.random();
            xRadius = 50;
            xRadius = Math.ceil(Math.random() * 40) + 10;
            xSpeed = Math.ceil(Math.random() * 6) + 2;
            ySpeed = Math.ceil(Math.random() * 6) + 2;
            if (xPosition <= 2 * xRadius || xPosition + 2 * xRadius >= cnv.width) {
                xPosition = cnv.width / 2;
            }
            objects.push({id: "#circle", radius: xRadius, speedX: xSpeed, speedY: ySpeed, color: color, centerX: xPosition, centerY: 80});
        }
    }



  function moveBalls() {
        for (i in objects) {
            object = objects[i];
            if ((object.centerY + object.radius * 0.75 >= char.y && object.centerY + object.radius * 0.75 <= char.y + char.height)
                    ||
                    (object.centerY - object.radius * 0.75 >= char.y && object.centerY - object.radius * 0.75 <= char.y + char.height)
                    ) {
                if (
                        (object.centerX + object.radius * 0.75 > char.x && object.centerX + object.radius * 0.75 < char.x + char.width)
                        ||
                        (object.centerX - object.radius * 0.75 > char.x && object.centerX - object.radius * 0.75 < char.x + char.width)

                        ) {
                   
                    isAlive=false;
                   
                }
            }
            if (object.centerX + object.radius > cnv.width || object.centerX - object.radius < 0) {
                object.speedX *= -1;
            }
            if (object.centerY + object.radius > cnv.height || object.centerY - object.radius < 0) {
                object.speedY *= -1;
            }
            
            object.centerX += object.speedX;
            object.centerY += object.speedY;
        }

    }

init();
function game(){
    if(isAlive==true){
        update();
        moveBalls();
        render();
    }
}
 //ctx.fillStyle = "linear-gradient(to right, #FFFDE4, #005AA7);";
 //ctx.fillRect(0,0,cnv.width,cnv.height);

     var input = new CanvasInput({
    canvas :document.getElementById("gameCanvas"),
    x:(cnv.width/2)-((0.32*cnv.height)/4),
    y:430,
    fontSize: 10,
    fontFamily: 'Airal',
    fontColor: 'white',
    fontStyle: 'bold',
    width: 150,
    padding: 8,
    borderWidth: 1,
    borderColor: 'steelblue',
    borderRadius: 3,
    boxShadow: '1px 1px 0px #000',
    innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
    placeHolder: 'PLAYER NAME',
    backgroundGradient: [ "#FFFDE4",  "#005AC7"],
    selectionColor:"white",
    placeHolderColor:"white",
   // backgroundImage: "img/arena.jpg",
         
     });

var isGameStart=true;

window.onload=function onLoad(){
   
    ctx.drawImage(playButton,(cnv.width/2)-((0.32*cnv.height)/4),300,(0.32*cnv.height)/2,(0.32*cnv.height)/2);
    
    cnv.addEventListener("touchstart",function(e){
        var touch=e.targetTouches[0];
        var x=touch.clientX;
        var y=touch.clientY;
    if(x>(cnv.width/2)-((0.32*cnv.height)/4) && x<((cnv.width/2)-((0.32*cnv.height)/4))+((0.32*cnv.height)/2) && y>300 && y<300+((0.32*cnv.height)/2)){  
        //input.renderCanvas();
        input.destroy();
        if(isGameStart==true){
           var gameloop= setInterval(game,40);
            startTime = new Date();
            var enemyIncrementLoop=setInterval(incrementEnemy,5000);
            isGameStart=false;
        }
    }

    });
    
}


   
        
      















