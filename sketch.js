var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;


function preload(){
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1-1.png");
  obstacle2 = loadImage("obstacle2-1.png");
  obstacle3 = loadImage("obstacle3-1.png");
  obstacle4 = loadImage("obstacle4-1.png");
  //obstacle5 = loadImage("obstacle5.png");
  //obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
 jumpSound = loadSound("jump.mp3");
 checkPointSound = loadSound("checkPoint.mp3");
 dieSound = loadSound("die.mp3");
}

function setup() {
  createCanvas(600, 600);
  
  ground = createSprite(200,630,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  trex = createSprite(50,530,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.08;
  
   gameOver = createSprite(300,300);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,330);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,530,700,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  trex.setCollider("rectangle",0,0,50,50);
  //trex.debug = true;
  
  score = 0;  
}

function draw() {
  
  background("lightblue");
  //displaying score
  text("Score: "+ score, 500,50);
  
  if(score%100===0 && score>0)
    {
      checkPointSound.play();
    }
  
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    //move the ground
    ground.velocityX = -(4+2*score/100);
    //scoring
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 520) {
        trex.velocityY = -16;
      jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
       dieSound.play();
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
    if(mousePressedOver(restart))
      {
        reset();
      }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,530,10,40);
   obstacle.velocityX = -(6+2*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
         obstacle.scale = 0.5;
        obstacle.setCollider("rectangle",0,0,80,50);
        //obstacle.debug=true;
              break;
      case 2: obstacle.addImage(obstacle2);
         obstacle.scale = 0.5;
         obstacle.setCollider("rectangle",0,0,120,50);
         //obstacle.debug=true;
              break;
      case 3: obstacle.addImage(obstacle3);
         obstacle.scale = 0.3;
         obstacle.setCollider("rectangle",0,100,420,290);
         //obstacle.debug=true;
        obstacle.y=500;
              break;
      case 4: obstacle.addImage(obstacle4);
        obstacle.y=500;
         obstacle.scale = 0.3;
         obstacle.setCollider("rectangle",30,100,550,290);
         //obstacle.debug=true;
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
   
    obstacle.lifetime = 300;
   
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function reset()
{
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;
}

