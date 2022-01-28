//Crear estados del juego END y PLAY
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Crear variables de objetos del programa
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//Crea variables del puntaje
var score;

//Crea las variables para el gameover
var gameOverImg,restartImg, gameOver, restart;

var backgroundImg, sunAnimation;

function preload(){
  
  //Precargar la imagen del fondo
   backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  //Precargar imagen del trex corriendo
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
  //Precargar imagen del suelo
  groundImage = loadImage("ground.png");
  
  //Precargar imagen de las nubes
  cloudImage = loadImage("cloud-1.png");
  
  //Precargar imagenes de los obstaculos
  obstacle1 = loadImage("obstacle1-1.png");
  obstacle2 = loadImage("obstacle2-1.png");
  obstacle3 = loadImage("obstacle3-1.png");
  obstacle4 = loadImage("obstacle4-1.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  //Precargar las imagenes de gameOver y Restart
   gameOverImg = loadImage("gameOver-1.png");
  restartImg = loadImage("restart-1.png");
  
  //precargar sonidos
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  //Crea el Sprite del trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.08;
  
  
  //radio de colicionar
  trex.setCollider("circle",0,0,350);
  trex.debug = false;
  
  //crea el suelo invisible
  invisibleGround = createSprite(width/2,height-10,width,125);
  //invisibleGround.visible = true;
  invisibleGround.shapeColor = "#f4cbaa";
    
  //crea el Sprite del suelo
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  ground.depth= trex.depth;
  trex.depth = trex.depth+1;
  
  //crea grupo de obstaculos y grupo de nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //crea sprites de gameOver y restart
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  restart.visible = false;
  
  //console.log("Hello" + 5);
  
  //variable de score
  score = 0;
  
}

function draw() {
  //establece el color de fondo
  background(backgroundImg);
  //crea el texto de la puntuación en la pantalla
  fill("midnightblue");
  stroke("white");
  textSize(20);
  text("Puntuación: "+ score, 30,50);
  
  //muestra en la consola el estado del juego
  console.log("Estado del juego ",gameState);
  
  //agrega estados del juego
  if(gameState === PLAY){
    //puntuación
    score = score + Math.round(getFrameRate()/60);
    //mueve el suelo
    ground.velocityX = -(6 + 3 * score/100);
    
    //condición para que suene cada 100 puntos
    if(score>0 && score%100 === 0){
      checkPointSound.play();
    }
        
    //hace que el suelo reestablezca su posición
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //salta cuando preciono la barra espaciadora
    if(touches.length > 0 || keyDown("space")&& trex.y >= height-120) {
      trex.velocityY = -10;
      jumpSound.play(); 
      touches = [];
    }
    
    //agrega gravedada al trex
    trex.velocityY = trex.velocityY + 0.8
  
  //evita que el trex caiga
  trex.collide(invisibleGround);
    
  //aparecen las nubes
  spawnClouds();
    
  //aparecen los obtaculos en el suelo
  spawnObstacles();
    
    //condición para que si el trex toca un obstaculo el juego cambie de estado
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END) {
     //detiene el suelo
     ground.velocityX = 0;
     //detiene la velocidad de salto del trex
     trex.velocityY = 0;
     
     //Detiene el grupo de obstaculos y nubes
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     
    //cambia la animación del trex
      trex.changeAnimation("collided", trex_collided);

     //Mantiene las nubes y obstaculos en pantalla aunque el trex colicione, nunca desaparecerán
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     //letrero de gameOver y reset visble
      gameOver.visible = true;
      restart.visible = true;
      if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)){
        reset();
        touches = [];
      }     
   }
     
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(1000,height-95,20,30 );
   obstacle.setCollider('circle',0,0,45); 
   obstacle.debug = false;
   obstacle.velocityX = -(6 + 3 * score/100);
   
    //genera obstaculos al azar
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      //case 3: obstacle.addImage(obstacle3);
              //break;
      //case 4: obstacle.addImage(obstacle4);
              //break;
      //case 5: obstacle.addImage(obstacle5);
              //break;
      //case 6: obstacle.addImage(obstacle6);
              //break;
      default: break;
    }
   
    //asigna escala y ciclo de vida al obstaculo           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth = trex.depth+1;
   //añade cada obstaculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribe el código para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.6;
    cloud.velocityX = -(6 + score/200);
    
     //asigna ciclo de vida a la variable nubes
    cloud.lifetime = 300;
    
    //ajusta la profundidad del trex con relacion a las nubes
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //añade cada nube al grupo de nubes
    cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
}
