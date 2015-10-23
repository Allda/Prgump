function Collectibles(x,y,z) {
    var orig = new THREE.Vector3(x,y,z);
    var dest = new THREE.Vector3();
    var rotate = new THREE.Vector3();
    var falling = false;
    var speedTrans;
    var speedRotate;
    if(Collectibles.starList == undefined)
        Collectibles.starList = []
    Collectibles.starList.push(this);

    var model;
    var loaded = false;

    this.getMeshObject = function() {
        return model;
    }

    this.isLoaded = function() {
        return loaded;
    }

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
                model = loadedModel.children[0];
                model.position.x = orig.x;
                model.position.y = orig.y;
                model.position.z = orig.z;
                scene.add(model);
                loaded = true;
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

    this.setTranslation = function(x, y, z, speed) {
        dest.x = x;
        dest.y = y;
        dest.z = z;

        /*if (orig > dest) {
            var tmp = dest;
            dest = orig;
            orig = tmp;
        }*/

        speedTrans = speed;
    }

    this.setRotate = function(x, y, z, speed) {
        rotate.x = x;
        rotate.y = y;
        rotate.z = z;
        speedRotate = speed;
    }

    this.update = function() {
        model.rotateOnAxis(rotate,speedRotate);

        if (falling) {
            if (model.position.y <= orig.y) {
                falling = false;
            } else {
                model.position.x -= dest.x*speedTrans;
                model.position.y -= dest.y*speedTrans;
                model.position.z -= dest.z*speedTrans;
            }
        } else {
            if (model.position.y >= (dest.y+orig.y)) {
                falling = true;
            } else {
                model.position.x += dest.x*speedTrans;
                model.position.y += dest.y*speedTrans;
                model.position.z += dest.z*speedTrans;
            }
        }
    }

}
