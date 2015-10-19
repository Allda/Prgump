$(function(){
    
    var scene, camera, renderer;
    var controls;
    var stats;
    var spotLight, cube, sphere;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var keyboard;
    var playerAnim, yPlus;
    var mapSrc, map;
    var world, playerPos, playerStat;

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
        kd.run(function () {
            kd.tick();
        });

        /*Camera*/
        camera.position.x = 2;
        camera.position.y = 12;
        camera.position.z = 5;
        camera.lookAt(scene.position);

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
        world.y = parseInt(mapSrc.length);
        world.x = parseInt(mapSrc[0].match(/\d+/g)[0]);
        world.z = parseInt(mapSrc[0].match(/\d+/g)[1]);
        playerPos = new Object();
        playerPos = { x: parseInt(mapSrc[0].match(/\d+/g)[2]),
                      y: parseInt(mapSrc[0].match(/\d+/g)[3]),
                      z: parseInt(mapSrc[0].match(/\d+/g)[4]) };

        playerStat = new Object();
        playerStat.jump = 1;
        playerStat.move = 1;
        playerStat.moving = false;
        yPlus = 0;

        var Box_geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var type;

        for (var y = 1; y < world.y; y++) {
            map[y-1] = new Array();
            for (var z = 0; z < world.x; z++) {
                map[y-1][z] = new Array();
                for (var x = 0; x < world.z; x++) {
                    type = mapSrc[y].match(/\d+/g)[world.x * z + x];
                    map[y-1][z][x] = type;
                    if (type == 9) {
                        continue;
                    }
                    var cube = new THREE.Mesh( Box_geometry, textures[type] );
                    cube.position.set(x, y-1, z);
                    cube.castShadow = true;
                    cube.receiveShadow = true;
                    scene.add(cube);    
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


        var geometry = new THREE.SphereGeometry( 0.5, 16, 16 );
        var material = new THREE.MeshBasicMaterial( {color: 0xff66ff} );
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.x = playerPos.x;
        sphere.position.y = playerPos.y;
        sphere.position.z = playerPos.z;

        scene.add( sphere );
    }

    // Key W was pressed
    kd.W.down(function () {
        if ((playerPos.z > 0) && (playerStat.move > 0)) {
            // Go forward
            playerCollision(0,0,-1);
        }
    });

    // Key A was pressed
    kd.A.down(function () {
        if ((playerPos.x > 0) && (playerStat.move > 0)) {
            // Go left
            playerCollision(-1,0,0);
        }
    });

    // Key S was pressed
    kd.S.down(function () {
        if ((playerPos.z < (world.z-1)) && (playerStat.move > 0)) {
            // Go back
            playerCollision(0,0,1);
        }
    });

    // Key D was pressed
    kd.D.down(function () {
        if ((playerPos.x < (world.x-1)) && (playerStat.move > 0)) {
            // Go right
            playerCollision(1,0,0);
        }
    });

    // Key SPACE was pressed
    kd.SPACE.press(function () {
        // Can player jump?
        if ((playerPos.y < (world.y-2)) && (playerStat.jump > 0)) {
            // Temporaly decrease high of jump
            playerStat.jump -= 1;
            var tween = new TWEEN.Tween(sphere.position);
            // Can player jump to air?
            if (map[playerPos.y+1][playerPos.z][playerPos.x] == 9) {
                // Move player +1 higher
                yPlus = 1;
                tween.to({y:playerPos.y+1},500);
            }
            // Style of move
            tween.easing(TWEEN.Easing.Cubic.In);
 
            tween.onStart(function() {
                playerStat.moving = true;
            });
 
            tween.onComplete(function() {
                playerStat.moving = false;
                yPlus = 0;
                playerPos.y++;

                var tween = new TWEEN.Tween(sphere.position);
                var speed = playerPos.y;
                for (var i = playerPos.y; i > 0; i--) {
                    if (map[playerPos.y-1][playerPos.z][playerPos.x] == 9) {
                        playerPos.y -= 1;
                    }
                };
                // Speed is set about high of falling player
                speed -= playerPos.y;
                tween.easing(TWEEN.Easing.Cubic.InOut);

                tween.onStart(function() {
                    playerStat.moving = true;
                });

                tween.onComplete(function() {
                    playerStat.moving = false;
                    playerStat.jump += 1;
                })

                // Isn't some anim about player falling in chain?
                if (speed) {
                    tween.to({y:playerPos.y},speed*250);
                    if (playerStat.moving) {
                        playerAnim.chain(tween);
                    } else {
                        playerAnim = tween;
                        playerAnim.start();
                    }
                } else {
                    playerStat.jump += 1;
                }
            });
            

            if (playerStat.moving) {
                playerAnim.chain(tween);
            } else {
                playerAnim = tween;
                playerAnim.start();
            }
        }
    });
    
    function playerCollision(x, y, z) {
        // Temporaly decrease length of move
        playerStat.move -= 1;
        var tween = new TWEEN.Tween(sphere.position);
        // Can player move?
        if (map[playerPos.y+y+yPlus][playerPos.z+z][playerPos.x+x] == 9) {
            playerPos.x += x;
            playerPos.y += y + yPlus;
            playerPos.z += z;
            tween.to({x:playerPos.x,
                      y:playerPos.y,
                      z:playerPos.z }, 250);
        }
        tween.easing(TWEEN.Easing.Cubic.InOut);

        tween.onStart(function() {
            playerStat.moving = true;
        });
   
        // Check if player will fall
        tween.onComplete(function() {
            playerStat.moving = false;
            playerFall();
        });
   
        
        /*if (playerStat.jump == 0) {
            tween.delay(250);
        }*/

        if (playerStat.moving) {
            playerAnim.chain(tween);
        } else {
            playerAnim = tween;
            playerAnim.start();
        }
    }

    function playerFall() {
        var tween = new TWEEN.Tween(sphere.position);
        var speed = playerPos.y;
        for (var i = playerPos.y; i > 0; i--) {
            if (map[playerPos.y-1][playerPos.z][playerPos.x] == 9) {
                playerPos.y -= 1;
            }
        };
        // Speed is set about high of falling player
        speed -= playerPos.y;
      
        tween.onStart(function() {
            playerStat.moving = true;
        });

        tween.onComplete(function() {
            playerStat.moving = false;
            // Increase length of move 
            playerStat.move += 1;
        });
        
        // Isn't some anim about player falling in chain?
        if (speed) {
            tween.to({y:playerPos.y},speed*250);
            if (playerStat.moving) {
                playerAnim.chain(tween);
            } else {
                playerAnim = tween;
                playerAnim.start();
            }
        } else {
            playerStat.move += 1;
        }
    }

    function render() {}

    function animate(){
        requestAnimationFrame(animate);
        TWEEN.update();
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
