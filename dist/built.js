function Player(){

    
}
;$(function(){

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
                    var cube = new THREE.Mesh( Box_geometry, textures[type] );
                    cube.position.set(x, y, z);
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

        playerAnim = new TWEEN.Tween(sphere.position);
    }

    // Key W was pressed
    kd.W.press(function () {
        if ((playerPos.z > 0) && (playerStat.move > 0)) {
            // Go forward
            playerCollision(0,-1);
        }
    });

    // Key A was pressed
    kd.A.press(function () {
        if ((playerPos.x > 0) && (playerStat.move > 0)) {
            // Go left
            playerCollision(-1,0);
        }
    });

    // Key S was pressed
    kd.S.press(function () {
        if ((playerPos.z < (world.z-1)) && (playerStat.move > 0)) {
            // Go back
            playerCollision(0,1);
        }
    });

    // Key D was pressed
    kd.D.press(function () {
        if ((playerPos.x < (world.x-1)) && (playerStat.move > 0)) {
            // Go right
            playerCollision(1,0);
        }
    });

    kd.LEFT.press(function () {
        if (playerStat.move > 1) {
            playerStat.move -= 1;
        }
    });

    kd.RIGHT.press(function () {
        if (playerStat.move < playerMax.move) {
            playerStat.move += 1;
        }
    });

    kd.UP.press(function () {
        if (playerStat.jump < playerMax.jump) {
            playerStat.jump += 1;
        }
    });

    kd.DOWN.press(function () {
        if (playerStat.jump > 1) {
            playerStat.jump -= 1;
        }
    });

    // Key SPACE was pressed
    kd.SPACE.press(function () {
        playerStat.jumpEn = !playerStat.jumpEn;
    });

    function playerCollision(dirX, dirZ) {
        // Can player move?
        if (dirZ == 0) {
            if (playerPos.y < (world.y-1)) {
                for (var i = 1; i <= playerStat.jump; i++) {
                    if (map[playerPos.y+i][playerPos.z][playerPos.x] == 9) {
                        playerPos.y++;
                        var tween = new TWEEN.Tween(sphere.position);
                        tween.easing(TWEEN.Easing.Cubic.InOut);
                        tween.to({ x:playerPos.x,
                                   y:playerPos.y,
                                   z:playerPos.z  }, 250);
                        tween.onComplete(function() {
                            playerAnim.setPlaying(false);
                        })
                        if (playerAnim.isPlaying()) {
                            playerAnim.chain(tween);
                        } else {
                            playerAnim = tween;
                            playerAnim.start();
                        }
                    } else {
                        break;
                    }
                };
            }

            for (var i = 0; i < playerStat.move; i++) {
                if (map[playerPos.y][playerPos.z][playerPos.x+dirX] == 9) {
                    playerPos.x += dirX;
                    var tween = new TWEEN.Tween(sphere.position);
                    tween.easing(TWEEN.Easing.Cubic.InOut);
                    tween.to({ x:playerPos.x,
                               y:playerPos.y,
                               z:playerPos.z  }, 250);
                    tween.onComplete(function() {
                        playerAnim.setPlaying(false);
                    })
                    if (playerAnim.isPlaying()) {
                        playerAnim.chain(tween);
                    } else {
                        playerAnim = tween;
                        playerAnim.start();
                    }
                } else {
                    break;
                }
            };

            for (var i = playerPos.y-1; i > 0; i--) {
                if (map[i][playerPos.z][playerPos.x] == 9) {
                    playerPos.y--;
                    var tween = new TWEEN.Tween(sphere.position);
                    tween.easing(TWEEN.Easing.Cubic.InOut);
                    tween.to({ x:playerPos.x,
                               y:playerPos.y,
                               z:playerPos.z  }, 250);
                    tween.onComplete(function() {
                        playerAnim.setPlaying(false);
                    })
                    if (playerAnim.isPlaying()) {
                        playerAnim.chain(tween);
                    } else {
                        playerAnim = tween;
                        playerAnim.start();
                    }
                } else {
                    break;
                }
            };

        } else {
            if (playerPos.y < (world.y-1)) {
                for (var i = 1; i <= playerStat.jump; i++) {
                    if (map[playerPos.y+i][playerPos.z][playerPos.x] == 9) {
                        playerPos.y++;
                        var tween = new TWEEN.Tween(sphere.position);
                        tween.easing(TWEEN.Easing.Cubic.InOut);
                        tween.to({ x:playerPos.x,
                                   y:playerPos.y,
                                   z:playerPos.z  }, 250);
                        tween.onComplete(function() {
                            playerAnim.setPlaying(false);
                        })
                        if (playerAnim.isPlaying()) {
                            playerAnim.chain(tween);
                        } else {
                            playerAnim = tween;
                            playerAnim.start();
                        }
                    } else {
                        break;
                    }
                };
            }

            for (var i = 0; i < playerStat.move; i++) {
                if (map[playerPos.y][playerPos.z+dirZ][playerPos.x] == 9) {
                    playerPos.z += dirZ;
                    var tween = new TWEEN.Tween(sphere.position);
                    tween.easing(TWEEN.Easing.Cubic.InOut);
                    tween.to({ x:playerPos.x,
                               y:playerPos.y,
                               z:playerPos.z  }, 250);
                    tween.onComplete(function() {
                        playerAnim.setPlaying(false);
                    })
                    if (playerAnim.isPlaying()) {
                        playerAnim.chain(tween);
                    } else {
                        playerAnim = tween;
                        playerAnim.start();
                    }
                } else {
                    break;
                }
            };

            for (var i = playerPos.y-1; i > 0; i--) {
                if (map[i][playerPos.z][playerPos.x] == 9) {
                    playerPos.y--;
                    var tween = new TWEEN.Tween(sphere.position);
                    tween.easing(TWEEN.Easing.Cubic.InOut);
                    tween.to({ x:playerPos.x,
                               y:playerPos.y,
                               z:playerPos.z  }, 250);
                    tween.onComplete(function() {
                        playerAnim.setPlaying(false);
                    })
                    if (playerAnim.isPlaying()) {
                        playerAnim.chain(tween);
                    } else {
                        playerAnim = tween;
                        playerAnim.start();
                    }
                } else {
                    break;
                }
            };
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
