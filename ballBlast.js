var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

 canvas.height = window.innerHeight;
 canvas.width = window.innerWidth;

//canon variables
var xCanon = canvas.width/2;
var yCanon = canvas.height-100;
var canonH = 90;
var canonW = 80;
var canonSpeed=7;
//canon buttons
var rightPressed=false;
var leftPressed=false;

var canonImg = new Image();
canonImg.src = 'canon.png';

//bullet
var bullets = [];
var bulletRadius = 6;
var bulletSpeed = 10;
var bulletTime = 90;

var bulletImg = new Image();
bulletImg.src = 'bullet.png';



//Rocks
var leftRocks = [];
var rightRocks = [];

var greenRockImg = new Image();
greenRockImg.src = 'greenRock.png';

var yellowRockImg = new Image();
yellowRockImg.src = 'yellowRock.png';

var splitRocks=[];
//score
var score=0;

//game over
var gameOver=false;

//pause
var paused = false;

//restart buttons
    var restartButtonX = 20;
    var restartButtonY = 100;
    var restartButtonW = 110;
    var restartButtonH = 30;

function endGame() {
	// Stop the spawn interval
  clearInterval(leftInterval);
  clearInterval(rightInterval);
  clearInterval(animateInterval);
  clearInterval(bulletInterval);
  // Show the final score
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0,canvas.width,canvas.height);

  ctx.fillStyle = '#000000';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over. Final Score: ' + score, canvas.width / 2, canvas.height / 2);
  ctx.fillText('Click here to start new game',canvas.width /2,canvas.height/2+30);
}

document.addEventListener("click",restart);

function restart(e){

	if(event.x > restartButtonX && event.x < restartButtonX + restartButtonW &&event.y > restartButtonY && event.y < restartButtonY + restartButtonH||
		event.x>canvas.width/2-300&&event.x<canvas.width/2+300&&event.y>canvas.height/2-100&&event.y<canvas.height/2+100){
	document.location.reload();
	//document.removeEventListener("click",restart);
   }
}


function animate(){

	if(paused){
 	return;
 }

	ctx.fillStyle="#906c3f"
	ctx.clearRect(0,0,canvas.width,canvas.height);

	ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("press 'p' to pause", 8, 56);

	

	moveCanon();
	split();
	moveBullet();
	moveLeftRocks();
	moveRightRocks();
	drawScore();
	drawRestartButton();


	if (gameOver) {
    endGame();

//local storage
    let score_serialized = JSON.stringify(score);
localStorage.setItem("score",score_serialized);
let score_deserialized = JSON.parse(localStorage.getItem("score"));

  } 

   

	
}

function moveCanon(){
	
//ctx.fillRect(xCanon,yCanon,canonW,canonH);

            ctx.save();
			ctx.drawImage(canonImg,xCanon,yCanon,canonW,canonH);
			ctx.restore();

	if(rightPressed&&xCanon<canvas.width-canonW){
		xCanon+=canonSpeed;
	}
	else if(leftPressed&&xCanon>0){
		xCanon-=canonSpeed;
	}
	

}

function circleFactory(x,y,radius,xspeed,yspeed,gravity,strength,initialStrength,status){
	return{
		x:x,
		y:y,
		radius:radius,
		xs:xspeed,
		ys:yspeed,
		g:gravity,
		s:strength,
		n:initialStrength,
		p:status,
		drawCircle: function(){
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
			ctx.fill();
			ctx.closePath();

		},
		writeStrength: function(){
			ctx.font = "25px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText(this.s,this.x,this.y);
		}
	}
}

function makeBullet(){

	if(paused){
		return;
	}
	var xBullet = xCanon+canonW/2;
	var yBullet = yCanon;
	var bulletStrength = 1;
	var bulletDestroyed = 1;

	bullets.push(circleFactory(xBullet,yBullet,bulletRadius,0,bulletSpeed,0,bulletStrength,bulletDestroyed));
	//console.log(leftRocks);
}

function moveBullet(){
	bullets.forEach(function(bullet){
		

		bullet.y-=bullet.ys;
		ctx.fillStyle='rgba(128,128,128,1)';

		//bullet.drawCircle();
		    ctx.save();
			ctx.drawImage(bulletImg,bullet.x-2*bullet.radius,bullet.y-2*bullet.radius,bullet.radius*4,bullet.radius*4);
			ctx.restore();

	
	})
}

function makeLeftRocks(){
	if(paused){
		return;
	}
	var xrock = 80;
	var yrock = Math.floor(Math.random()*250);
	var radius = Math.floor(Math.random()*60)+25;
	var xspeed = Math.floor(Math.random()*4)+2;
	var yspeed=0;
	var gravity = 0.3;
	var rockStrength = Math.floor(Math.random()*10)*2+6;
	var rockInitialStrength = rockStrength;
	var status=1;

	leftRocks.push(circleFactory(xrock,yrock,radius,xspeed,yspeed,gravity,rockStrength,rockInitialStrength,status));
	
}

function moveLeftRocks(){
	leftRocks.forEach(function(rock,j){


		if(rock.x+rock.xs+rock.radius>canvas.width || rock.x+rock.xs-rock.radius<0){
			rock.xs = -rock.xs;
		}
		if(rock.y+rock.ys+rock.radius>canvas.height){
			rock.ys = -rock.ys;
		}else{
			rock.ys+=rock.g;
		}

		rock.x +=rock.xs;
		
		rock.y += rock.ys;
		
		ctx.fillStyle='rgb(85,107,47)';
		
		
			//rock.drawCircle();
			ctx.save();
			ctx.drawImage(greenRockImg,rock.x-2*rock.radius,rock.y-2*rock.radius,rock.radius*4,rock.radius*4);
			ctx.restore();
			rock.writeStrength();
		

		bullets.forEach(function(bullet,i){
			if(bullet.x<rock.x+rock.radius && bullet.x>rock.x-rock.radius && bullet.y<rock.y+rock.radius &&bullet.y>rock.y-rock.radius){
				rock.s--;
				bullet.s--;
				
				
				
		    }
		    if(bullet.s==0){
		    	bullets.splice(i,1);

		    	score++;
		    	bulletSpeed++;

		    }
		     
		})
		if(rock.s==0){
			
				leftRocks.splice(j,1);
			    splitRocks.push(circleFactory(rock.x,rock.y,rock.radius,-rock.xs,0,rock.g,rock.n/2,rock.n/2,1));
			     splitRocks.push(circleFactory(rock.x,rock.y,rock.radius,rock.xs,0,rock.g,rock.n/2,rock.n/2,1));
			 
			}
		
		     

		     if(xCanon>rock.x-rock.radius&&xCanon<rock.x+rock.radius&&rock.y+rock.radius>yCanon){
		     	/*alert("Game Over");
		     	document.location.reload();
		     	clearInterval(interval);*/
		     	gameOver=true;
		     }
		
	});
}

function makeRightRocks(){
	if(paused){
		return;
	}
	var xrock = canvas.width-80;
	var yrock = Math.floor(Math.random()*250);
	var radius = Math.floor(Math.random()*50)+25;
	var xspeed = Math.floor(Math.random()*4)+2;
	var yspeed=0;
	var gravity = 0.25;
	var rockStrength = Math.floor(Math.random()*10)*2+6;
	var rockInitialStrength = rockStrength;
	var status=1;

	rightRocks.push(circleFactory(xrock,yrock,radius,xspeed,yspeed,gravity,rockStrength,rockInitialStrength,status));
}

function moveRightRocks(){
	rightRocks.forEach(function(rock,j){


		if(rock.x-rock.xs-rock.radius<0 || rock.x-rock.xs+rock.radius>canvas.width){
			rock.xs = -rock.xs;
		}
		if(rock.y+rock.ys+rock.radius>canvas.height){
			rock.ys = -rock.ys;
		}else{
			rock.ys+=rock.g;
		}

		rock.x -=rock.xs;
		
		rock.y += rock.ys;
		
		ctx.fillStyle='rgb(85,107,47)';
		//if(strengthStatus==0)
		
			//rock.drawCircle();

			ctx.save();
			ctx.drawImage(greenRockImg,rock.x-2*rock.radius,rock.y-2*rock.radius,rock.radius*4,rock.radius*4);
			ctx.restore();
			rock.writeStrength();
		

		bullets.forEach(function(bullet,i){
			if(bullet.x<rock.x+rock.radius && bullet.x>rock.x-rock.radius && bullet.y<rock.y+rock.radius &&bullet.y>rock.y-rock.radius){
				rock.s--;
				bullet.s--;
				
				
				
		    }
		    if(bullet.s==0){
		    	
                bullets.splice(i,1);
		    	score++;

		    }
		     
		})
		if(rock.s==0){
			
				rightRocks.splice(j,1);
			    splitRocks.push(circleFactory(rock.x,rock.y,rock.radius,-rock.xs,0,rock.g,rock.n/2,rock.n/2,1));
			     splitRocks.push(circleFactory(rock.x,rock.y,rock.radius,rock.xs,0,rock.g,rock.n/2,rock.n/2,1));

			 
			}

		if(xCanon>rock.x-rock.radius&&xCanon<rock.x+rock.radius&&rock.y+rock.radius>yCanon){
		     	/*alert("Game Over");
		     	document.location.reload();
		     	clearInterval(interval);*/
		     	gameOver=true;
		     }
		
	});
}
function split(){

	 splitRocks.forEach(function(splitrock,k){

           	if(splitrock.x-splitrock.xs-splitrock.radius<0 || splitrock.x-splitrock.xs+splitrock.radius>canvas.width){
			splitrock.xs = -splitrock.xs;
		}
		if(splitrock.y+splitrock.ys+splitrock.radius>canvas.height){
			splitrock.ys = -splitrock.ys;
		}else{
			splitrock.ys+=splitrock.g;
		}

		splitrock.x -=splitrock.xs;
		
		splitrock.y += splitrock.ys;
		 ctx.fillStyle="yellow";
			    	//splitrock.drawCircle();

			    	ctx.save();
			    ctx.drawImage(yellowRockImg,splitrock.x-splitrock.radius,splitrock.y-splitrock.radius,splitrock.radius*2,splitrock.radius*2);
			     ctx.restore();
			    	splitrock.writeStrength();

	 bullets.forEach(function(bullet,i){
			if(bullet.x<splitrock.x+splitrock.radius && bullet.x>splitrock.x-splitrock.radius && bullet.y<splitrock.y+splitrock.radius &&bullet.y>splitrock.y-splitrock.radius){
				splitrock.s--;
				bullet.s--;
					
		    }
		    if(bullet.s==0){
		    	
                bullets.splice(i,1);
		    	score++;

		    }
		     
		})
		if(splitrock.s==0){
			splitRocks.splice(k,1);

		}
		if(xCanon>splitrock.x-splitrock.radius&&xCanon<splitrock.x+splitrock.radius&&splitrock.y+splitrock.radius>yCanon){
		     	
		     	gameOver=true;
		     }
			      })

	
}
function  drawScore(){
	ctx.font = "25px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawRestartButton(){

    
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(restartButtonX, restartButtonY, restartButtonW, restartButtonH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px serif';
  	ctx.fillText('New game', 24, 118);
	    }

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

function keyDownHandler(event){
	if(event.keyCode==39||event.keyCode==68){
		rightPressed=true;
	}
	else if(event.keyCode ==37||event.keyCode==65){
		leftPressed=true;
	}

}

function keyUpHandler(event){
	 if(event.keyCode ==39  || event.keyCode==68) {
        rightPressed = false;
    }
    else if(event.keyCode == 37 || event.keyCode == 65) {
        leftPressed = false;
    }
}

document.addEventListener('keydown',pause,false);

function pause(e){
	if(e.keyCode === 80){
		paused = !paused;
	}
}

//document.addEventListener("click",restart);






let animateInterval=setInterval(animate,10);
let bulletInterval = setInterval(makeBullet,bulletTime);
let leftInterval = setInterval(makeLeftRocks, 14000);
let rightInterval=setInterval(makeRightRocks,5200);
animate();
	