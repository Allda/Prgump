function loadMultiTexture(prefix, up, sides, down) {
    var urls = [ prefix + sides, prefix + sides,
    prefix + up, prefix + down,
    prefix + sides, prefix + sides ];
    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
          map: THREE.ImageUtils.loadTexture( urls[i] ),
        }));

    var material = new THREE.MeshFaceMaterial( materialArray );
    return material;
}
