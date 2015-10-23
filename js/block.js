function Block(x, y, z, texture){
    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    this.texture = texture;
    this.cube = new THREE.Mesh( this.geometry, texture);
    this.cube.position.set(x, y, z);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    if(Block.blocklist == undefined)
        Block.blocklist = [];
    Block.blocklist.push(this.cube);
    //blockList.push(this.cube);

    this.getMeshObject = function(){
        return this.cube;
    }
}
