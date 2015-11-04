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
    this.radius = 0.3;
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;

    this.gravity = 0.031;
    this.vy = 0.0;
    this.falling = true;
    this.floorCollision = false;
    this.velocity = 0.1;
    this.leftFlag = false;
    this.rightFlag = false;
    this.forwardFlag = false;
    this.backwardFlag = false;

    this.drownPosY;
    this.drowning = false;
    this.burning = false;
    this.dead = false;

    this.listener = new THREE.AudioListener();
    this.soundJump = new THREE.Audio( this.listener );
    this.soundJump.load( 'sounds/jump.ogg' );

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

    this.getBurningMesh = function() {
        return this.groupEmitter.mesh;
    }

    this.getMeshObject = function(){
        return this.sphere;
    }

    this.jump = function(){
        this.vy = 0.3;
        this.soundJump.play();
    }

    this.isDrowning = function() {
        return this.drowning;
    }

    this.isBurning = function() {
        return this.burn;
    }

    this.update = function(delta){
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
            }
            else if(this.vy <= 0) { // moving down.. floor collision
                var possibleMove = (oldY - this.radius) - (collisionObject.position.y + collisionObject.scale.y/2);
                console.log(possibleMove, oldY, this.y);
                if(possibleMove < 0.05)
                    this.y = oldY;
                else{
                    this.y = oldY - possibleMove + 0.01;
                }
                this.vy = 0;
                floorTouch = true;
            }
        }
        else{
            if(!floorTouch)
                this.vy -= this.gravity;
        }
        /*this.y += this.vy;
        if(this.drowning) {
            if((this.drownPosY-this.y) >= 1.0) {
                this.vy = 0.0;
                this.dead = true;
            }
        } else if(this.falling){
            this.vy -= this.gravity;
        }
        if(this.burning) {
            this.groupEmitter.mesh.position.x = this.x;
            this.groupEmitter.mesh.position.y = this.y;
            this.groupEmitter.mesh.position.z = this.z;
            this.groupEmitter.tick(delta);
        }*/
        this.updateMesh();
    }

    this.updateMesh = function(){
        this.sphere.position.x = this.x;
        this.sphere.position.y = this.y;
        this.sphere.position.z = this.z;
    }

    this.moveLeft = function(cameraRotationAngle){
        if(!this.isDrowning()){
            var oldX = this.x;
            this.x -= this.velocity;
            var collisionObject = this.isCollision(Block.blocklist);
            if(collisionObject != null){
                var possibleMove = oldX - this.radius - (collisionObject.position.x + collisionObject.scale.x/2);
                if(possibleMove < 0.05)
                    this.x = oldX;
                else
                    this.x = oldX - possibleMove+0.01;
            }
        }
        this.updateMesh();
    }

    this.moveRight = function(cameraRotationAngle){
        if(!this.isDrowning()){
            var oldX = this.x;
            this.x += this.velocity;
            var collisionObject = this.isCollision(Block.blocklist);
            if(collisionObject != null){
                var possibleMove = (collisionObject.position.x - collisionObject.scale.x/2) - (oldX + this.radius);
                if(possibleMove < 0.05)
                    this.x = oldX;
                else
                    this.x = oldX +possibleMove-0.01;
            }
        }
        this.updateMesh();
    }

    this.moveForward = function(cameraRotationAngle){
        if(!this.isDrowning()){
            var oldZ = this.z;
            this.z -= this.velocity;
            var collisionObject = this.isCollision(Block.blocklist);
            if(collisionObject != null){
                var possibleMove = oldZ - this.radius - (collisionObject.position.z + collisionObject.scale.z/2);
                if (possibleMove < 0.05)
                    this.z = oldZ;
                else
                    this.z = oldZ - possibleMove +0.01;
            }
        }
        this.updateMesh();
    }

    this.moveBackward = function(cameraRotationAngle){
        if(!this.isDrowning()){
            var oldZ = this.z;
            this.z += this.velocity;
            var collisionObject = this.isCollision(Block.blocklist);
            if(collisionObject != null){
                var possibleMove = (collisionObject.position.z - collisionObject.scale.z/2) - (oldZ + this.radius);
                if(possibleMove < 0.05)
                    this.z = oldZ;
                else
                    this.z = oldZ + possibleMove -0.01;
            }
        }

    }

    this.resetFlags = function(){
        this.leftFlag = false;
        this.rightFlag = false;
        this.forwardFlag = false;
        this.backwardFlag = false;
    }

    this.collision = function(colidableObjects){
        var count = 0;
        var flag = false;
        for(i = 0; i < colidableObjects.length; i++){
            var object = colidableObjects[i];
            // floor colision
            var xStart = this.x - this.sphere.scale.x/2;
            var xEnd = this.x + this.sphere.scale.x/2;
            var objectXStart = object.position.x - object.scale.x/2;
            var objectXEnd = object.position.x + object.scale.x/2;

            var yStart = this.y - this.sphere.scale.y/2;
            var yEnd = this.y + this.sphere.scale.y/2;
            var objectYStart = object.position.y - object.scale.y/2;
            var objectYEnd = object.position.y + object.scale.y/2;

            var zStart = this.z - this.sphere.scale.z/2;
            var zEnd = this.z + this.sphere.scale.z/2;
            var objectZStart = object.position.z - object.scale.z/2;
            var objectZEnd = object.position.z + object.scale.z/2;

            var xStartPl = this.x - this.radiusius;
            var xEndPl = this.x + this.radius;

            var yStartPl = this.y - this.radius;

            var zStartPl = this.z - this.radius;
            var zEndPl = this.z + this.radius;

            if(xStartPl > objectXStart && xEndPl < objectXEnd){
                if(zStartPl > objectZStart && zEndPl < objectZEnd){
                    if((yStartPl-objectYEnd) <= 0.25){
                        if(object.type == 1) {
                            this.vy = -0.015;
                            this.drownPosY = this.y;
                            this.drowning = true;
                            break;
                        } /*else if((object.type == 3) && !this.burning) {
                           this.burning = true;
                           this.emitter.enable();
                           this.groupEmitter.mesh.visible = true;
                       }*/
                    }
                }
            }

            if(xStart < objectXEnd && xEnd > objectXStart){
                if(zStart < objectZEnd && zEnd > objectZStart){
                    if(yStart < objectYEnd && yEnd > objectYStart){
                        flag = true;

                        if(object.type == 1) {
                            if(this.burning) {
                                this.burning = false;
                                this.emitter.disable();
                                this.groupEmitter.mesh.visible = false;
                            }
                        }
                        if((object.type == 3) && !this.burning) {
                           this.burning = true;
                           this.emitter.enable();
                           this.groupEmitter.mesh.visible = true;
                        }

                        if(!this.floorCollision){
                            if(this.vy <= 0){
                                this.y = objectYEnd + this.sphere.scale.y/2-0.01;
                                this.vy = 0.0;
                                this.falling = false;
                                this.floorCollision = true;
                            }
                            else{
                                this.y = objectYStart - this.sphere.scale.y/2-0.1;
                                this.vy = 0;
                                this.falling = true;
                            }
                        }
                        if(this.leftFlag && (this.y - objectYEnd - this.getMeshObject().scale.y/2) < -0.1){
                            this.x = objectXEnd + this.getMeshObject().scale.x/2;
                        }
                        else if(this.rightFlag && (this.y - objectYEnd - this.getMeshObject().scale.y/2) < -0.1){
                            this.x = objectXStart - this.getMeshObject().scale.x/2;
                        }
                        else if(this.forwardFlag && (this.y - objectYEnd - this.getMeshObject().scale.y/2) < -0.1){
                            this.z = objectZEnd + this.getMeshObject().scale.z/2;
                        }
                        else if(this.backwardFlag && (this.y - objectYEnd - this.getMeshObject().scale.y/2) < -0.1){
                            this.z = objectZStart - this.getMeshObject().scale.z/2;
                        }
                    }
                }
            }
        }
        if(flag){
            this.sphere.material.color.set( 0x00ff00 );
        }
        else{
            this.falling = true;
            this.sphere.material.color.set( 0x00ffff );
            this.floorCollision = false;
        }
        this.resetFlags();
    }


    this.collisionBonus = function(bonusList, scene){
        for (var i = 0; i < bonusList.length; i++) {
            object = bonusList[i];
            objectMesh = object.getMeshObject();
            if (!objectMesh)
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
                        console.log("collision");
                        object.dismiss();
                    }
                }
            }
        }
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
