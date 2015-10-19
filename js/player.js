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

    this.gravity = 0.01;
    this.vy = 0.0;
    this.falling = true;

    this.getMeshObject = function(){
        return this.sphere;
    }

    this.jump = function(){
        this.vy = 0.5;
    }

    this.update = function(){
        if(this.falling){
            console.log("update" + this.falling);
            this.y += this.vy;
            this.vy -= this. gravity;

        }
        this.updateMesh();
    }

    this.updateMesh = function(){
        this.sphere.position.x = this.x;
        this.sphere.position.y = this.y;
        this.sphere.position.z = this.z;
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
                        if(this.vy < 0){
                            this.y = objectYEnd + this.sphere.scale.y/2;
                            this.vy = 0.0;
                            this.falling = false;
                            //console.log("Colision")

                        }
                        /*else{

                            this.y = objectYStart - this.sphere.scale.y/2-0.1;
                            this.vy = 0;
                            this.falling = true;
                        }*/
                    }
                }
            }
            //down edge

        }
        if(flag){
            this.sphere.material.color.set( 0x00ff00 );
        }
        else{
            if(this.vy != 0){
                this.falling = true;
                this.sphere.material.color.set( 0x00ffff );

            }
        }
    }

}
