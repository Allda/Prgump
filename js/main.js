var player;
var level = 0;
var keyboard;
var world;
var finish;
var removableBlocks = [];

function Game(){

    var scene, camera, renderer;
    var controls;
    var stats;
    var spotLight, cube, sphere;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    // GIFs
    var animatedLava, animatedWater;
    var clock = new THREE.Clock();
    var textures = [];

    var world, playerPos;
    var cameraOffsetX = 0;
    var cameraOffsetZ = 5;
    var cameraRotationAngle = 0;
    // Ambient sound
    var listener;
    var soundAmb;
    // Particles
    var emitter;
    var groupEmitter;

    var gamePause = true;

    this.init = function(){
        /*Creates empty scene object and renderer*/
        scene = new THREE.Scene();
        camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500);
        renderer = new THREE.WebGLRenderer({antialias:true});

        renderer.setClearColor(0xADEAEA);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        /*Add controls*/
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', this.render );

        /*Add keyboard catch*/
        //keyboard = new THREEx.KeyboardState();
        kd.run(function () {
            kd.tick();
        });

        /*Camera*/
        camera.position.x = 2;
        camera.position.y = 12;
        camera.position.z = 5;

        $("#webGL-container").append(renderer.domElement);

    }

    this.setScene = function() {
        this.initLight(false);
        this.initSkyBox();
        this.loadTextures();
        this.loadWorld();

        this.initAudio();

        player = new Player(playerPos.x,playerPos.y+0.1,playerPos.z);
        scene.add(player.getMeshObject());
        scene.add(player.getBurningMesh());

    }

    this.initCollectibles = function(position){
        this.removeAllColectibles();
        Collectibles.starList = [];
        for(var i = 0; i < position.length;i++){
            var star = new Collectibles(position[i].x, position[i].y, position[i].z);
            star.setTranslation(0, 0.5, 0, 0.02);
            star.setRotate(0, 1, 0, 0.02);
            star.loadModel('star', scene);
            removableBlocks.push(star.getMeshObject());

        }
    }

    this.removeAllColectibles = function(){
        if(Collectibles.starList == undefined)
            return;
        for(var i=0; i < Collectibles.starList.length; i++){
            objectMesh = Collectibles.starList[i].getMeshObject();
            scene.remove(objectMesh);
        }
    }

    this.initAudio = function() {
        listener = new THREE.AudioListener();
        soundAmb = new THREE.Audio( listener );
        soundAmb.autoplay = true;
        soundAmb.setVolume(0.05);
        soundAmb.setLoop(true);
        soundAmb.load( 'sounds/Ambient.ogg' );
    }

    this.initLight = function(help){
        var ambient = new THREE.AmbientLight( 0x404040 );
        scene.add( ambient );

        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( -5, 35, 3 );
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 8;
        spotLight.shadowCameraFar = 40;
        spotLight.shadowDarkness = 0.5;
        spotLight.shadowCameraVisible = false;
        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;
        spotLight.name = 'Spot Light';
        scene.add( spotLight );
        if(help){
             var spotLightHelper = new THREE.SpotLightHelper( spotLight );
             scene.add( spotLightHelper );
        }
    }

    this.initSkyBox = function(){
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );

        var urlPrefix = "textures/";
        var urls = [ urlPrefix + "skybox_ice1.jpg", urlPrefix + "skybox_ice3.jpg",
        urlPrefix + "skybox_ice0.jpg", urlPrefix + "skybox_ice5.jpg",
        urlPrefix + "skybox_ice4.jpg", urlPrefix + "skybox_ice2.jpg" ];

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push( new THREE.MeshBasicMaterial({
              map: THREE.ImageUtils.loadTexture( urls[i] ),
              side: THREE.BackSide
            }));

        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyGeometry = new THREE.BoxGeometry( 500, 500, 500 );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );

        scene.add( skyBox );
    }

    this.loadTextures = function(){
        var texName = [["floor.png","floor.png","floor.png"],
                       ["water.jpg","water.jpg","water.jpg"],
                       ["grass.jpg","grass-mud.jpg","mud.jpg"],
                       ["lava.png","lava.png","lava.png"],
                       ["crate.png","crate.png","crate.png"],
                       ["stone.jpg","stone.jpg","stone.jpg"],
                       ["snow.jpg","snow.jpg","snow.jpg"]];

        for (var i = 0; i < texName.length; i++) {

            var tex = loadMultiTexture("textures/",texName[i][0],texName[i][1]);
            if(texName[i][0] == "lava.png"){
                tex = new THREE.ImageUtils.loadTexture("textures/" + texName[i][0]);
                animatedLava = new TextureAnimator( tex, 3, 3, 9, 120 ); // texture, #horiz, #vert, #total, duration.
                tex = new THREE.MeshBasicMaterial( { map: tex } )
                textures.push(tex);
                continue;
            } else if(texName[i][0] == "water.jpg"){
                tex = new THREE.ImageUtils.loadTexture("textures/" + texName[i][0]);
                animatedWater = new TextureAnimator( tex, 16, 1, 16, 1600 ); // texture, #horiz, #vert, #total, duration.
                tex = new THREE.MeshBasicMaterial( { map: tex } )
                textures.push(tex);
                continue;
            }

            textures.push(tex);
        };
    }

    this.loadWorld = function(){
        var currentMap = mapSrc[level];

        world = Object();
        world.y = currentMap.mapSrc.length;
        world.x = currentMap.xSize;
        world.z = currentMap.zSize;
        playerPos = new Object();
        playerPos = { x: currentMap.player.x,
                      y: currentMap.player.y,
                      z: currentMap.player.z };

        var Box_geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var type;
        for (var y = 0; y < world.y; y++) {
            for (var z = 0; z < world.z; z++) {
                for (var x = 0; x < world.x; x++) {
                    type = currentMap.mapSrc[y][z][x];
                    if (type == 9) {
                        continue;
                    }
                    var block = new Block(world, x, y, z, type, textures[type]);
                    scene.add(block.getMeshObject());
                    removableBlocks.push(block.getMeshObject());
                };
            };
        };
        var finishPosition = currentMap.finish;
        var startPosition = currentMap.player;
        finish = new model3D(finishPosition.x,finishPosition.y,finishPosition.z);
        finish.loadModel("goal", scene);
        start = new model3D(startPosition.x,startPosition.y-0.6,startPosition.z);
        start.loadModel("start", scene);
        removableBlocks.push(finish.getMeshObject());
        removableBlocks.push(start.getMeshObject());

        this.initCollectibles(currentMap.collectibles);
    }

    this.playerDie = function(){
        $(".shadow").fadeIn("slow");
        $(".dieScreen").fadeIn("slow");
    }

    this.playerWin = function(){
        $(".shadow").fadeIn("slow");
        $(".winScreen").fadeIn("slow");
        gamePause = false;
    }

    this.cameraNextStep = function(){
        if(cameraOffsetX == 0 && cameraOffsetZ == 5){
            cameraOffsetX = -5;
            cameraOffsetZ = 0;
            cameraRotationAngle = 90;
        }
        else if(cameraOffsetX == -5 && cameraOffsetZ == 0){
            cameraOffsetX = 0;
            cameraOffsetZ = -5;
            cameraRotationAngle = 180
        }
        else if(cameraOffsetX == 0 && cameraOffsetZ == -5){
            cameraOffsetX = 5;
            cameraOffsetZ = 0;
            cameraRotationAngle = 270;
        }
        else if(cameraOffsetX == 5 && cameraOffsetZ == 0){
            cameraOffsetX = 0;
            cameraOffsetZ = 5;
            cameraRotationAngle = 0;
        }
    }

    kd.W.down(function (){
        if(!gamePause)
            return;
        if(cameraRotationAngle == 0){
            player.moveForward(world);
        }
        else if (cameraRotationAngle == 90) {
            player.moveRight(world);
        }
        else if (cameraRotationAngle == 180) {
            player.moveBackward(world);
        }
        else if (cameraRotationAngle == 270) {
            player.moveLeft(world);
        }
    });
    kd.S.down(function (){
        if(!gamePause)
            return;
        if(cameraRotationAngle == 0){
            player.moveBackward(world);
        }
        else if (cameraRotationAngle == 90) {
            player.moveLeft(world);
        }
        else if (cameraRotationAngle == 180) {
            player.moveForward(world);
        }
        else if (cameraRotationAngle == 270) {
            player.moveRight(world);
        }
    });
    kd.A.down(function (){
        if(!gamePause)
            return;
        if(cameraRotationAngle == 0){
            player.moveLeft(world);
        }
        else if (cameraRotationAngle == 90) {
            player.moveForward(world);
        }
        else if (cameraRotationAngle == 180) {
            player.moveRight(world);
        }
        else if (cameraRotationAngle == 270) {
            player.moveBackward(world);
        }
    });
    kd.D.down(function (){
        if(!gamePause)
            return;
        if(cameraRotationAngle == 0){
            player.moveRight(world);
        }
        else if (cameraRotationAngle == 90) {
            player.moveBackward(world);
        }
        else if (cameraRotationAngle == 180) {
            player.moveLeft(world);
        }
        else if (cameraRotationAngle == 270) {
            player.moveForward(world);
        }
    });
    kd.SPACE.press(function(){
        if(!gamePause)
            return;
        if(!player.isDrowning()) {
            player.jump();
        }
    })
    kd.P.press(function(){
        if(!gamePause)
            return;
        game.cameraNextStep();
    });

    this.update = function(){
        if(!gamePause)
            return;

        var delta = clock.getDelta();
        animatedLava.update(1000 * delta);
        animatedWater.update(16000 * delta);
        if(!player.falling)
            player.update(delta, world);
        if(player.y < -5){
            player.falling = true;
            this.playerDie();
        }
        if(player.dead){
            this.playerDie();
        }
        if (!player.isDrowning()) {
            player.collisionBonus(Collectibles.starList);
        }
        if(player.collisionFinish(finish)){
            this.playerWin();
        }
        $(".health").html("Health: "+player.health);
        $(".levelDisplay").html("Level: "+(level+1));

        //camera.lookAt(player.getMeshObject().position);
        camera.position.x = player.x + cameraOffsetX
        camera.position.y = player.y+3;
        camera.position.z = player.z+ cameraOffsetZ
        for (var i = 0; i < Collectibles.starList.length; i++) {
            star = Collectibles.starList[i]
            if (star.isLoaded()) {
                if (star.isPicked()) {
                    star.ending(i, Collectibles.starList ,scene);
                } else {
                    star.update();
                }
            }
        }

    }

    this.render = function() {}

    this.animate = function(){
        requestAnimationFrame(this.animate.bind(this));
        camera.lookAt(player.getMeshObject().position);
        this.update();

        this.render();

        renderer.render(scene, camera);
    }

    TextureAnimator = function(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration){
    	this.tilesHorizontal = tilesHoriz;
    	this.tilesVertical = tilesVert;
    	// how many images does this spritesheet contain?
    	//  usually equals tilesHoriz * tilesVert, but not necessarily,
    	//  if there at blank tiles at the bottom of the spritesheet.
    	this.numberOfTiles = numTiles;
    	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

    	// how long should each image be displayed?
    	this.tileDisplayDuration = tileDispDuration;

    	// how long has the current image been displayed?
    	this.currentDisplayTime = 0;

    	// which image is currently being displayed?
    	this.currentTile = 0;

    	this.update = function( milliSec )
    	{
    		this.currentDisplayTime += milliSec;
    		while (this.currentDisplayTime > this.tileDisplayDuration)
    		{
    			this.currentDisplayTime -= this.tileDisplayDuration;
    			this.currentTile++;
    			if (this.currentTile == this.numberOfTiles)
    				this.currentTile = 0;
    			var currentColumn = this.currentTile % this.tilesHorizontal;
    			texture.offset.x = currentColumn / this.tilesHorizontal;
    			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
    			texture.offset.y = currentRow / this.tilesVertical;
    		}
    	};
    }

    this.init();
    this.setScene();

    this.animate();

    $(".retry").click(function(){
        player.x = playerPos.x;
        player.y = playerPos.y+0.1;
        player.z = playerPos.z;
        player.backAlive();
        var delta = clock.getDelta();
        player.update(delta, world);
        $(".shadow").fadeOut("slow");
        $(".dieScreen").fadeOut("slow");
        var currentMap = mapSrc[level];
        game.initCollectibles(currentMap.collectibles);

    });

    $(".nextLevel").click(function(){
        gamePause = true;
        player.backAlive()
        scene.remove(finish.getMeshObject());
        game.removeAllColectibles();
        Collectibles.starList = [];
        Block.blocklist = [];
        for (var i = 0; i < removableBlocks.length; i++) {
            scene.remove(removableBlocks[i]);
            $(".shadow").fadeOut("slow");
            $(".winScreen").fadeOut("slow");
        }
        level++;
        if(level >= mapSrc.length)
            level = 0;
        game.loadWorld();
        player.setPosition(mapSrc[level].player);
    });

    $(window).resize(function(){
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    });

}

function initControlMenu(){
    for (var i = 0; i < mapSrc.length; i++) {
        levelIter = i + 1
        $("#levels").append('<li class="level">level '+ levelIter +'</li>');
    }
    $("#levels").append('<li class="back backLevel">Back</li>')
    $("#startGame").click(function(){
        $(".gameControl").fadeOut("slow", function(){
            $(".gameContent").fadeIn("slow");

        });
        game = new Game();

    });

    $("#selectLevel").click(function(){
        $("#options").fadeOut("slow", function(){
            $("#levels").fadeIn("slow");
        });
    });

    $(".backLevel").click(function(){
        $("#levels").fadeOut("slow", function(){
            $("#options").fadeIn("slow");
        });
    });

    $("#control").click(function(){
        $("#options").fadeOut("slow", function(){
            $(".control").fadeIn("slow");
        });
    });

    $(".backControl").click(function(){
        $(".control").fadeOut("slow", function(){
            $("#options").fadeIn("slow");
        });
    });

    $("#about").click(function(){
        $("#options").fadeOut("slow", function(){
            $(".about").fadeIn("slow");
        });
    });

    $(".backAbout").click(function(){
        $(".about").fadeOut("slow", function(){
            $("#options").fadeIn("slow");
        });
    });

    $(".level").click(function(){

        level = parseInt($(this).html().split(" ")[1]) - 1;
        $("#levels").fadeOut("slow", function(){
            $("#options").fadeIn("slow");
        });
    });
}


$(document).ready(function(){
    initControlMenu();
});
