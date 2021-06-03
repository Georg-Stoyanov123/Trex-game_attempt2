// Creates all the gameStates and variables so then they can be used for/as restart and playing functions
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound, restart, wingsanimation, pterodactyl, pterodactylG, crouchAnimation;

//Preload is used for uploading all the images, sounds and animations later to be called as sprite.add_____

function preload(){
  wingsAnimation = loadAnimation("USE_THIS_PTERODACTYL.png", "USE_THIS_PTERODACTYL2.png", "USE_THIS_PTERODACTYL3.png")
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  crouchAnimation = loadAnimation("TREX_CROUCH.JPG")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

//Function setup is used to add the animations, sounds, images, size, sprites, groups, visibilities and colliders (very important!)

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  pterodactylG = new Group();
}

//Function draw is used to call the functions that we made, set the background, score, console.logs, gamestate definitions, key functions and if/else if statements

function draw() {
  
  background(255);
  //displaying score
  text("Score: "+ score, 500,50);
  var lol = "lol"
  console.log(lol)
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    trex.changeAnimation("running", trex_running)
    ground.velocityX = -(4 + 3* score/60)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    //jump when the space key is pressed
    if(keyDown("up")&& trex.y >= 161.5) {
        trex.velocityY = -13;
        jumpSound.play(); 
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.7
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    if (gameState === PLAY) {
      obstaclesGroup.setVelocityXEach(ground.velocityX)
    }
    if(obstaclesGroup.isTouching(trex) || pterodactylG.isTouching(trex)){
        jumpSound.play();
        gameState = END;
        dieSound.play()
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      pterodactylG.destroyEach()
      pterodactylG.visible = false
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  if(score % 2000 === 0 && score > 0) {
    background(0)
  }
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart) && restart.visible === true) {
      reset();
      gameState = PLAY
  }

  if (frameCount%random(300, 1000) === 0) {
    spawnPterodactyl()
  }

  drawSprites();
}

//The functions from now on are made by us, they are not official but they are local that we can later call anywhere as a global function!

function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(600,165,10,40);
   if (gameState === PLAY) {
      obstacle.velocityX = -(4 + 3* score/60 + 1)
   }
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}
function reset() {
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  score = 0
  restart.visible = false
  gameOver.visible = false
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
function spawnPterodactyl() {
  pterodactyl = createSprite(600, round(random(50, 100), 10, 10))
  pterodactyl.lifetime = 300
  pterodactyl.velocityX = -12
  pterodactyl.addAnimation("wings_flapping", wingsAnimation)
  pterodactyl.scale = 0.1
  pterodactylG.add(pterodactyl)
  pterodactyl.debug = true
  pterodactyl.setCollider("circle", 0, 0, 100)
}

