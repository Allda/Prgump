function Block(world, x, y, z, type, texture){
    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    this.texture = texture;
    this.cube = new THREE.Mesh( this.geometry, texture);
    this.cube.position.set(x, y, z);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.cube.type = type;
    this.cube.index = x + (z*world.x) + (y*world.x*world.z);

    if(Block.blocklist == undefined)
        Block.blocklist = [];
    Block.blocklist.push(this.cube);
    //blockList.push(this.cube);

    this.getMeshObject = function(){
        return this.cube;
    }

    Block.getBlock = function(index, type) {
        max = Block.blocklist.length;
        for (i=0; i<max; i++) {
            if (Block.blocklist[i].index == index) {
                if ((Block.blocklist[i].type == type) ||
                    (typeof type === 'undefined')) {
                    return Block.blocklist[i];
                }
            }
        }
    }
}
