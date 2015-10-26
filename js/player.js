function Player(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;

    this.geometry = new THREE.SphereGeometry( 0.5, 16, 16 );
    this.material = new THREE.MeshBasicMaterial( {color: 0xff66ff} );
    this.sphere = new THREE.Mesh( this.geometry, this.material );
    this.sphere.position.x = x;
    this.sphere.position.y = y;
    this.sphere.position.z = z;

    this.gravity = 0.03;
    this.vy = 0.0;
    this.falling = true;
    this.floorCollision = false;
    this.velocity = 0.1;
    this.leftFlag = false;
    this.rightFlag = false;
    this.forwardFlag = false;
    this.backwardFlag = false;

    this.getMeshObject = function(){
        return this.sphere;
    }

    this.jump = function(){
        this.vy = 0.3;
    }

    this.update = function(){

        this.y += this.vy;
        if(this.falling){
            this.vy -= this. gravity;

        }
        this.updateMesh();
    }

    this.updateMesh = function(){
        this.sphere.position.x = this.x;
        this.sphere.position.y = this.y;
        this.sphere.position.z = this.z;
    }

    this.moveLeft = function(cameraRotationAngle){
        if(cameraRotationAngle == 0){
            this.x -= this.velocity;
            this.leftFlag = true;
        }
        else if (cameraRotationAngle == 90) {
            this.z -= this.velocity;
            this.forwardFlag = true;
        }
        else if (cameraRotationAngle == 180) {
            this.x += this.velocity;
            this.rightFlag = true;
        }
        else if (cameraRotationAngle == 270) {
            this.z += this.velocity;
            this.backwardFlag = true;
        }
    }

    this.moveRight = function(cameraRotationAngle){
        if(cameraRotationAngle == 0){
            this.x += this.velocity;
            this.rightFlag = true;
        }
        else if (cameraRotationAngle == 90) {
            this.z += this.velocity;
            this.backwardFlag = true;
        }
        else if (cameraRotationAngle == 180) {
            this.x -= this.velocity;
            this.leftFlag = true;
        }
        else if (cameraRotationAngle == 270) {
            this.z -= this.velocity;
            this.forwardFlag = true;
        }
    }

    this.moveForward = function(cameraRotationAngle){
        if(cameraRotationAngle == 0){
            this.z -= this.velocity;
            this.forwardFlag = true;
        }
        else if (cameraRotationAngle == 90) {
            this.x += this.velocity;
            this.rightFlag = true;
        }
        else if (cameraRotationAngle == 180) {
            this.z += this.velocity;
            this.backwardFlag = true;
        }
        else if (cameraRotationAngle == 270) {
            this.x -= this.velocity;
            this.leftFlag = true;
        }
    }

    this.moveBackward = function(cameraRotationAngle){
        if(cameraRotationAngle == 0){
            this.z += this.velocity;
            this.backwardFlag = true;
        }
        else if (cameraRotationAngle == 90) {
            this.x -= this.velocity;
            this.leftFlag = true;
        }
        else if (cameraRotationAngle == 180) {
            this.z -= this.velocity;
            this.forwardFlag = true;
        }
        else if (cameraRotationAngle == 270) {
            this.x += this.velocity;
            this.rightFlag = true;
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

            if(xStart < objectXEnd && xEnd > objectXStart){
                if(zStart < objectZEnd && zEnd > objectZStart){
                    if(yStart < objectYEnd && yEnd > objectYStart){
                        flag = true;
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


    this.collisionBonus = function(bonusList){
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
                    }
                }
            }
        }
    }

}
