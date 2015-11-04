var player;
var level = "1";
var keyboard;

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

        this.initCollectibles();
        this.initAudio();

        player = new Player(1,1.1,3);
        scene.add(player.getMeshObject());
        scene.add(player.getBurningMesh());

        var start = new model3D(0,1.4,0);
        start.loadModel("start", scene);
        var start2 = new model3D(2,3.4,4);
        start2.loadModel("goal", scene);
    }

    this.initCollectibles = function(){
        var star = new Collectibles(3, 4, 0);
        star.setTranslation(0, 0.5, 0, 0.02);
        star.setRotate(0, 1, 0, 0.02);
        star.loadModel('star', scene);
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
        spotLight.position.set( 10, 10, -5 );
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 8;
        spotLight.shadowCameraFar = 30;
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
        currentMap = mapSrc[level]

        world = Object();
        world.y = parseInt(currentMap.length) - 1;
        world.x = parseInt(currentMap[0].match(/\d+/g)[0]);
        world.z = parseInt(currentMap[0].match(/\d+/g)[1]);
        playerPos = new Object();
        playerPos = { x: parseInt(currentMap[0].match(/\d+/g)[2]),
                      y: parseInt(currentMap[0].match(/\d+/g)[3]),
                      z: parseInt(currentMap[0].match(/\d+/g)[4]) };

        var Box_geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var type;
        for (var y = 0; y < world.y; y++) {
            for (var z = 0; z < world.x; z++) {
                for (var x = 0; x < world.z; x++) {
                    type = currentMap[y+1].match(/\d+/g)[world.x * z + x];
                    if (type == 9) {
                        continue;
                    }
                    var block = new Block(x, y, z, type, textures[type]);
                    scene.add(block.getMeshObject());
                };
            };
        };
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
        if(cameraRotationAngle == 0){
            player.moveForward();
        }
        else if (cameraRotationAngle == 90) {
            player.moveRight();
        }
        else if (cameraRotationAngle == 180) {
            player.moveBackward();
        }
        else if (cameraRotationAngle == 270) {
            player.moveLeft();
        }
    });
    kd.S.down(function (){
        if(cameraRotationAngle == 0){
            player.moveBackward();
        }
        else if (cameraRotationAngle == 90) {
            player.moveLeft();
        }
        else if (cameraRotationAngle == 180) {
            player.moveForward();
        }
        else if (cameraRotationAngle == 270) {
            player.moveRight();
        }
    });
    kd.A.down(function (){
        if(cameraRotationAngle == 0){
            player.moveLeft();
        }
        else if (cameraRotationAngle == 90) {
            player.moveForward();
        }
        else if (cameraRotationAngle == 180) {
            player.moveRight();
        }
        else if (cameraRotationAngle == 270) {
            player.moveBackward();
        }
    });
    kd.D.down(function (){
        if(cameraRotationAngle == 0){
            player.moveRight();
        }
        else if (cameraRotationAngle == 90) {
            player.moveBackward();
        }
        else if (cameraRotationAngle == 180) {
            player.moveLeft();
        }
        else if (cameraRotationAngle == 270) {
            player.moveForward();
        }
    });
    kd.SPACE.press(function(){
        if(!player.isDrowning()) {
            player.jump();
        }
    })
    kd.P.press(function(){
        game.cameraNextStep();
    });

    this.update = function(){

        /*if(keyboard.pressed("W")){
            player.moveForward();
        }
        if(keyboard.pressed("S")){
            player.moveBackward();
        }
        if(keyboard.pressed("A")){
            player.moveLeft();
        }
        if(keyboard.pressed("D")){
            player.moveRight();
        }
        if(keyboard.pressed("space")){
            player.jump();
        }
        if(keyboard.pressed("P") && cameraUpdate == false){
            this.cameraNextStep();
            cameraUpdate = true;
        }
        else{
            cameraUpdate = false;
        }
        if(keyboard.pressed("esc")){
            $(".gameControl").show();
            $(".gameContent").hide();
        }*/
        var delta = clock.getDelta();
        animatedLava.update(1000 * delta);
        animatedWater.update(16000 * delta);

        player.update(delta);
        if (!player.isDrowning()) {
            player.collisionBonus(Collectibles.starList);
        }

        //camera.lookAt(player.getMeshObject().position);
        camera.position.x = player.x + cameraOffsetX
        camera.position.y = player.y+3;
        camera.position.z = player.z+ cameraOffsetZ
        for (var i = 0; i < Collectibles.starList.length; i++) {
            star = Collectibles.starList[i]
            if (star.isLoaded()) {
                if (star.isPicked()) {
                    star.ending(Collectibles.starList ,scene);
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

    $(window).resize(function(){
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    });

}

function initControlMenu(){
    $("#startGame").click(function(){
        console.log("start");
        $(".gameControl").fadeOut("slow", function(){
            $(".gameContent").fadeIn("slow");
        });

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
        level = $(this).html().split(" ")[1];
        $("#levels").fadeOut("slow", function(){
            $("#options").fadeIn("slow");
        });
    });
}

$(document).ready(function(){

    initControlMenu();

    game = new Game();
});
