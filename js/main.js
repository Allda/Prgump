var player;

$(function(){

    var scene, camera, renderer;
    var controls;
    var stats;
    var spotLight, cube, sphere;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var keyboard;
    var playerAnim, yPlus;
    var mapSrc, map;

    var world, playerPos, playerStat, playerMax;

    function init(){
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
        controls.addEventListener( 'change', render );

        /*Add keyboard catch*/
        keyboard = new THREEx.KeyboardState();

        /*Camera*/
        camera.position.x = 2;
        camera.position.y = 12;
        camera.position.z = 5;


        $("#webGL-container").append(renderer.domElement);
    }

    function setScene() {
        /*Lights*/
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

       /* var spotLightHelper = new THREE.SpotLightHelper( spotLight );
        scene.add( spotLightHelper );*/

        /* Crates */
        var texName = ["floor.png", "water.jpg", "grass.jpg", "lava.jpg", "crate.png", "stone.jpg", "snow.jpg"];
        var textures = [];

        for (var i = 0; i < texName.length; i++) {
            var fTex = new THREE.ImageUtils.loadTexture("textures/" + texName[i]);
            var tex = new THREE.MeshBasicMaterial( { map: fTex } )
            textures.push(tex);
        };

        mapSrc = [ "6 6\n" +
                "0 2 0",

                "1 1 1 5 5 5\n" +
                "1 1 1 2 3 5\n" +
                "1 0 0 2 2 2\n" +
                "1 0 0 2 2 2\n" +
                "1 0 0 2 2 2\n" +
                "0 0 0 0 0 0",

                "1 9 9 5 5 5\n" +
                "9 9 9 9 3 5\n" +
                "9 9 9 9 9 5\n" +
                "9 9 4 4 9 9\n" +
                "9 9 4 4 9 9\n" +
                "9 9 9 9 9 9",

                "9 9 9 5 5 5\n" +
                "9 9 9 9 3 3\n" +
                "9 9 9 9 5 5\n" +
                "9 9 9 9 9 9\n" +
                "9 9 4 4 9 9\n" +
                "9 9 9 9 9 9",

                "9 9 9 5 9 5\n" +
                "9 9 9 9 9 5\n" +
                "9 9 9 9 9 5\n" +
                "9 9 9 9 9 9\n" +
                "9 9 4 9 9 9\n" +
                "9 9 9 9 9 9",

                "9 9 9 9 9 9\n" +
                "9 9 9 9 9 9\n" +
                "9 9 9 9 9 9\n" +
                "9 9 9 9 9 9\n" +
                "9 9 9 9 9 9\n" +
                "9 9 9 9 9 9",

                "6 6 9 9 9 9\n" +
                "9 9 9 9 9 9\n" +
                "9 9 9 9 9 9\n" +
                "9 9 9 9 6 9\n" +
                "9 9 9 9 6 6\n" +
                "9 6 9 9 9 6",
              ]
        map = new Array();

        world = new Object();
        world.y = parseInt(mapSrc.length) - 1;
        world.x = parseInt(mapSrc[0].match(/\d+/g)[0]);
        world.z = parseInt(mapSrc[0].match(/\d+/g)[1]);
        playerPos = new Object();
        playerPos = { x: parseInt(mapSrc[0].match(/\d+/g)[2]),
                      y: parseInt(mapSrc[0].match(/\d+/g)[3]),
                      z: parseInt(mapSrc[0].match(/\d+/g)[4]) };

        playerMax = new Object();
        playerMax.move = 1;
        playerMax.jump = 1;

        playerStat = new Object();
        playerStat.jump = 1;
        playerStat.move = 1;
        playerStat.jumpEn = false;

        var Box_geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var type;

        for (var y = 0; y < world.y; y++) {
            map[y] = new Array();
            for (var z = 0; z < world.x; z++) {
                map[y][z] = new Array();
                for (var x = 0; x < world.z; x++) {
                    type = mapSrc[y+1].match(/\d+/g)[world.x * z + x];
                    map[y][z][x] = type;
                    if (type == 9) {
                        continue;
                    }
                    var block = new Block(x, y, z, textures[type]);
                    scene.add(block.getMeshObject());
                };
            };
        };

        // prepare loader and load the model
       /* var oLoader = new THREE.OBJMTLLoader();
        oLoader.load('models/player.obj', 'models/player.mtl', function(object, materials) {

        var material = new THREE.MeshFaceMaterial(materials);
        //var material2 = new THREE.MeshLambertMaterial({ color: 0xa65e00 });

        object.traverse( function(child) {
            if (child instanceof THREE.Mesh) {

            // apply custom material
            child.material = material;

            // enable casting shadows
            child.castShadow = true;
            child.receiveShadow = true;
        }
        });

        object.position.x = 0;
        object.position.y = 5;
        object.position.z = 0;
        object.scale.set(1, 1, 1);
        scene.add(object);*/

        // instantiate a loader
       /* var loader = new THREE.JSONLoader();

        // load a resource
        loader.load(
            // resource URL
            'models/teapot.json',
            // Function when resource is loaded
            function ( geometry, materials ) {
                var material = new THREE.MeshFaceMaterial( materials );
                var object = new THREE.Mesh( geometry, material );
                object.position.x = 0;
                object.position.y = 5;
                object.position.z = 0;
                object.scale.set(1, 1, 1);
                scene.add( object );
            }
        );*/


        player = new Player(3,3,3);


        scene.add(player.getMeshObject());

        playerAnim = new TWEEN.Tween(player.getMeshObject().possition);

    }
    function update(){
        if(keyboard.pressed("W")){
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

        player.update();
        player.collision(blockList);
        camera.lookAt(player.getMeshObject().position);
        camera.position.x = player.x;
        camera.position.y = player.y+2;
        camera.position.z = player.z+5
    }

    function render() {}

    function animate(){
        requestAnimationFrame(animate);
        update();
        TWEEN.update();

        camera.lookAt(player.getMeshObject().position);
        render();

        renderer.render(scene, camera);
    }

    init();
    setScene();

    animate();

    $(window).resize(function(){
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    });

});
