function Player(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;

    this.geometry = new THREE.SphereGeometry( 0.25, 16, 16 );
    this.material = new THREE.MeshLambertMaterial( {color: 0xff66ff} );
    this.sphere = new THREE.Mesh( this.geometry, this.material );
    this.sphere.position.x = x;
    this.sphere.position.y = y;
    this.sphere.position.z = z;
    this.radius = 0.25;
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;

    this.gravity = 0.031;
    this.vy = 0.0;
    this.velocity = 0.1;

    this.jumpCount = 0;
    this.maxJumps = 1;
    this.maxJumpsInit = 1;
    this.drownPosY;
    this.drowning = false;
    this.burning = false;
    this.dead = false;
    this.health = 100;
    this.falling = false;

    this.listener = new THREE.AudioListener();
    this.soundJump = new THREE.Audio( this.listener );
    this.soundJump.load( 'sounds/jump.ogg' );

    /* Fire animation */
    this.emitter = new SPE.Emitter( {
        particleCount: 1,
        type: SPE.distributions.SPHERE,
        position: {
            value: new THREE.Vector3(0,0.45,0),
            radius: 0.0
        },
        maxAge: { value: 1 },
        size: { value: [12, 12] },
    });
    this.groupEmitter = new SPE.Group( {
        texture: {
            value: THREE.ImageUtils.loadTexture( './textures/fire.jpg' ),
            frames: new THREE.Vector2( 6, 6 ),
            frameCount: 36,
            loop: 1
        },
        depthTest: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        scale: 45
    });
    this.groupEmitter.addEmitter(this.emitter);
    this.groupEmitter.mesh.castShadow = true;
    this.groupEmitter.mesh.receiveShadow = true;
    this.emitter.disable();

    /* Function */

    this.getBurningMesh = function() {
        return this.groupEmitter.mesh;
    }

    this.getMeshObject = function(){
        return this.sphere;
    }

    this.jump = function(){
        if(this.jumpCount < this.maxJumps){
            this.jumpCount += 1;
            this.vy = 0.3;
            this.soundJump.play();
        }
    }

    this.isDrowning = function() {
        return this.drowning;
    }

    this.isBurning = function() {
        return this.burn;
    }

    this.backAlive = function(){
        if(this.burning) {
            this.burning = false;
            this.emitter.disable();
            this.groupEmitter.mesh.visible = false;
        }
        this.drowning = false;
        this.burning = false;
        this.dead = false;
        this.health = 100;
        this.maxJumps = this.maxJumpsInit;
        this.falling = false;
    }

    this.setPosition = function(possition) {
        this.x = possition.x;
        this.y = possition.y;
        this.z = possition.z;
        this.updateMesh();
    }

    this.update = function(delta, world){
        var oldY = this.y;
        this.y += this.vy;
        var collisionObject = this.isCollision(Block.blocklist);
        var floorTouch = false;
        if(collisionObject != null){
            if(this.vy > 0){ // moving up.. ceiling collision
                var possibleMove = (collisionObject.position.y - collisionObject.scale.y/2) - (oldY + this.radius);
                if(possibleMove < 0.05)
                    this.y = oldY;
                else
                    this.y = oldY + possibleMove - 0.01;
                this.vy = 0;
                this.vy -= this.gravity;
                this.checkFire(collisionObject, world);
            }
            else if(this.vy <= 0) { // moving down.. floor collision
                var possibleMove = (oldY - this.radius) - (collisionObject.position.y + collisionObject.scale.y/2);
                if(possibleMove < 0.05)
                    this.y = oldY;
                else{
                    this.y = oldY - possibleMove + 0.01;
                }
                this.vy = 0;
                this.jumpCount = 0;
                floorTouch = true;
                if ((!this.drowning) && (collisionObject.type == WATER)) {
                    if (this.collisionBlock(collisionObject, world, WATER)) {
                        this.checkWater(collisionObject, world);
                        this.dead = true;
                    };
                }
                this.checkFire(collisionObject, world);
            }
        }
        else{
            if(!floorTouch)
                this.vy -= this.gravity;
        }
        /*this.y += this.vy;*/

        if(this.drowning) {
            if((this.drownPosY-this.y) < 0.95) {
                this.y -= 0.0125;
            }
        }

        if(this.burning) {
            this.groupEmitter.mesh.position.x = this.x;
            this.groupEmitter.mesh.position.y = this.y;
            this.groupEmitter.mesh.position.z = this.z;
            this.groupEmitter.tick(delta);
            this.health -= 1;
            if(this.health < 0){
                this.health = 0;
                this.dead = true;
            }
        }

        this.updateMesh();
    }

    this.groundAcceleration = function(collisionObject) {
        switch(collisionObject.type) {
            case FLOOR:
                return 0.2;
            case GRASS:
                return -0.1;
            case LAVA:
                return -0.5;
            default:
                return 0.0;
        }
    }

    this.collisionBlock = function(collisionObject, world, blockType) {
        var center = collisionObject;
        var left, leftUp, up, rightUp, right, rightDown, down, leftDown;

        if (center.position.x > 0)
            left = Block.getBlock(center.index-1, blockType);
        if ((center.position.x > 0) && (center.position.z > 0))
            leftUp = Block.getBlock(center.index-1-world.x, blockType);
        if (center.position.z > 0)
            up = Block.getBlock(center.index-world.x, blockType);
        if ((center.position.x < world.x) && (center.position.z > 0))
            rightUp = Block.getBlock(center.index+1-world.x, blockType);
        if (center.position.x < world.x)
            right = Block.getBlock(center.index+1, blockType);
        if ((center.position.x < world.x) && (center.position.z < world.z))
            rightDown = Block.getBlock(center.index+1+world.x, blockType);
        if (center.position.z < world.z)
            down = Block.getBlock(center.index+world.x, blockType);
        if ((center.position.x > 0) && (center.position.z < world.z))
            leftDown = Block.getBlock(center.index-1+world.x, blockType);

        if ((center.type != blockType) && (blockType != WATER)) {
            return false;
        }

        var posX = this.x + this.radius - (center.position.x + center.scale.x/2);
        var posZ = this.z + this.radius - (center.position.z + center.scale.z/2);

        /* Check center position */
        if ((posX < 0.0) && (posX > -0.5) &&
            (posZ < 0.0) && (posZ > -0.5)) {
            return true;
        /* Check left corner */
        } else if ((posX < -0.5) && (posZ > -0.5) &&
                   (posZ < 0.0)) {
           if (typeof left != 'undefined') {
               return true;
           }
        /* Check leftUp corner */
        } else if ((posX < -0.5) && (posZ < -0.5)) {
            if (typeof leftUp != 'undefined') {
                return true;
            }
        /* Check up corner */
        } else if ((posZ < -0.5) && (posX > -0.5) &&
                   (posX < 0.0)) {
           if (typeof up != 'undefined') {
               return true;
           }
        /* Check rightUp corner */
        } else if ((posX > 0.0) && (posZ < -0.5)) {
            if (typeof rightUp != 'undefined') {
                return true;
            }
        /* Check right corner */
        } else if ((posX > 0.0) && (posZ > -0.5) &&
                   (posZ < 0.0)) {
           if (typeof right != 'undefined') {
               return true;
           }
        /* Check rightDown corner */
        } else if ((posX > 0.0) && (posZ > 0.0)) {
            if (typeof rightDown != 'undefined') {
                return true;
            }
        /* Check down corner */
        } else if ((posZ > 0.0) && (posX > -0.5) &&
                   (posX < 0.0)) {
           if (typeof down != 'undefined') {
               return true;
           }
        /* Check leftDown corner */
        } else if ((posX < -0.5) && (posZ > 0.0)) {
            if (typeof leftDown != 'undefined') {
                return true;
            }
        }

        return false;
    }

    this.updateMesh = function(){
        this.sphere.position.x = this.x;
        this.sphere.position.y = this.y;
        this.sphere.position.z = this.z;
    }

    this.moveLeft = function(world){
        if(!this.isDrowning() && !this.dead){
            var oldX = this.x;
            this.x -= this.velocity;
            var collisionObject = this.isCollision(Block.blocklist);
            if(collisionObject != null){
                var possibleMove = oldX - this.radius - (collisionObject.position.x + collisionObject.scale.x/2);
                if(possibleMove < 0.05) {
                    this.x = oldX;
                } else {
                    this.x = oldX - possibleMove+0.01;
                }
                this.checkFire(collisionObject, world);
            }
        }
        this.updateMesh();
    }

    this.moveRight = function(world){
        if(!this.isDrowning() && !this.dead){
            var oldX = this.x;
            this.x += this.velocity;
            var collisionObject = this.isCollision(Block.blocklist);
            if(collisionObject != null){
                var possibleMove = (collisionObject.position.x - collisionObject.scale.x/2) - (oldX + this.radius);
                if(possibleMove < 0.05) {
                    this.x = oldX;
                } else {
                    this.x = oldX +possibleMove-0.01;
                }
                this.checkFire(collisionObject, world);
            }
        }
        this.updateMesh();
    }

    this.moveForward = function(world){
        if(!this.isDrowning() && !this.dead){
            var oldZ = this.z;
            this.z -= this.velocity;
            var collisionObject = this.isCollision(Block.blocklist);
            if(collisionObject != null){
                var possibleMove = oldZ - this.radius - (collisionObject.position.z + collisionObject.scale.z/2);
                if (possibleMove < 0.05) {
                    this.z = oldZ;
                } else {
                    this.z = oldZ - possibleMove +0.01;
                }
                this.checkFire(collisionObject, world);
            }
        }
        this.updateMesh();
    }

    this.moveBackward = function(world){
        if(!this.isDrowning() && !this.dead){
            var oldZ = this.z;
            this.z += this.velocity;
            var collisionObject = this.isCollision(Block.blocklist);
            if(collisionObject != null){
                var possibleMove = (collisionObject.position.z - collisionObject.scale.z/2) - (oldZ + this.radius);
                if(possibleMove < 0.05) {
                    this.z = oldZ;
                } else {
                    this.z = oldZ + possibleMove -0.01;
                }
                this.checkFire(collisionObject, world);
            }
        }

    }

    this.checkFire = function(object, world) {
        var center = object;
        var isWater = this.collisionBlock(object, world, WATER);

        if(isWater) {
            if(this.burning) {
                this.burning = false;
                this.emitter.disable();
                this.groupEmitter.mesh.visible = false;
            }
        }

        var isLava = this.collisionBlock(object, world, LAVA);
        if(isLava) {
            if(!this.burning) {
               this.burning = true;
               this.emitter.enable();
               this.groupEmitter.mesh.visible = true;
            }
        }
    }

    this.checkWater = function(object) {
        if(object.type == WATER) {
            this.drowning = true;
            this.drownPosY = this.y;
        }
    }


    this.collisionBonus = function(bonusList, scene){
        for (var i = 0; i < bonusList.length; i++) {
            object = bonusList[i];
            objectMesh = object.getMeshObject();
            if (!objectMesh)
                continue;
            if(object.isPicked())
                continue;
            var xStart = this.x - this.sphere.scale.x/2;
            var xEnd = this.x + this.sphere.scale.x/2;
            var objectXStart = objectMesh.position.x - objectMesh.scale.x/2;
            var objectXEnd = objectMesh.position.x + objectMesh.scale.x/2;

            var yStart = this.y - this.sphere.scale.y/2;
            var yEnd = this.y + this.sphere.scale.y/2;
            var objectYStart = objectMesh.position.y - objectMesh.scale.y/2;
            var objectYEnd = objectMesh.position.y + objectMesh.scale.y/2;

            var zStart = this.z - this.sphere.scale.z/2;
            var zEnd = this.z + this.sphere.scale.z/2;
            var objectZStart = objectMesh.position.z - objectMesh.scale.z/2;
            var objectZEnd = objectMesh.position.z + objectMesh.scale.z/2;

            if(xStart < objectXEnd && xEnd > objectXStart){
                if(zStart < objectZEnd && zEnd > objectZStart){
                    if(yStart < objectYEnd && yEnd > objectYStart){
                        object.dismiss();
                        this.maxJumps++;
                    }
                }
            }
        }
    }

    this.collisionFinish = function(finish){
        var xStart = this.x - this.sphere.scale.x/2;
        var xEnd = this.x + this.sphere.scale.x/2;

        var yStart = this.y - this.sphere.scale.y/2;
        var yEnd = this.y + this.sphere.scale.y/2;

        var zStart = this.z - this.sphere.scale.z/2;
        var zEnd = this.z + this.sphere.scale.z/2;

        if(xStart < finish.x && xEnd > finish.x){
            if(zStart < finish.z && zEnd > finish.z){
                if(yStart < finish.y && yEnd > finish.y){
                    return true;
                }
            }
        }
        return false;
    }

    this.isCollision = function(blockList){
        for (var i = 0; i < blockList.length; i++) {
            objectMesh = blockList[i];

            var xStart = this.x - this.radius;
            var xEnd = this.x + this.radius;
            var objectXStart = objectMesh.position.x - objectMesh.scale.x/2;
            var objectXEnd = objectMesh.position.x + objectMesh.scale.x/2;

            var yStart = this.y - this.radius;
            var yEnd = this.y + this.radius;
            var objectYStart = objectMesh.position.y - objectMesh.scale.y/2;
            var objectYEnd = objectMesh.position.y + objectMesh.scale.y/2;

            var zStart = this.z - this.radius;
            var zEnd = this.z + this.radius;
            var objectZStart = objectMesh.position.z - objectMesh.scale.z/2;
            var objectZEnd = objectMesh.position.z + objectMesh.scale.z/2;

            if(xStart < objectXEnd && xEnd > objectXStart){
                if(zStart < objectZEnd && zEnd > objectZStart){
                    if(yStart < objectYEnd && yEnd > objectYStart){
                        return objectMesh;
                    }
                }
            }
        }
        return null;
    }
}
