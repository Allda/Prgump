function model3D(x, y, z) {
    var x = x;
    var y = y;
    var z = z;

    this.loadModel = function(modelName, scene) {
        // instantiate a loader
        var loader = new THREE.OBJMTLLoader();

        // load an obj / mtl resource pair
        loader.load(
            // OBJ resource URL
            'models/' + modelName + '.obj',
            // MTL resource URL
            'models/' + modelName + '.mtl',
            // Function when both resources are loaded
            function ( loadedModel ) {
                var model = loadedModel.children[0];
                model.position.x = x;
                model.position.y = y;
                model.position.z = z;
                scene.add(model);
            },
            // Function called when downloads progress
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when downloads error
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        );
    }

    this.setTranslation = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
