var THREE = require('three');
var MarchingCubes = require('./MarchingCubes');
var config = require('./config');
var model = require('./model');
var textureCubesLoader = require('./textureCubes');
var moviePhotoOrder = require('./moviePhotoOrder');
var movieStates = require('./movieStates');
var depts = model.depts;





function build() {

    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.BackSide,
      //  vertexColors: THREE.VertexColors,
        envMap: textureCubesLoader.textureCubes.philly,
        combine: THREE.MixOperation,
        specularMap: new THREE.Texture(),
        reflectivity: movieStates.initial.reflect,
        //specular: new THREE.Color(255,255,1),
        map: new THREE.Texture(),
    });

    window.blobMat = material;

    var resolution = config.metaballResolution;
    //  var numBlobs = 10;

    var effect = new MarchingCubes(resolution, material, true, true, config.colorCanvasRez);



    //effect.enableUvs = false;


    effect.update = function(nodeSets, camera) {

        effect.reset();

        var scaleFix = camera.position.z * 3;
        var posFix = {
            x: 0.5,
            y: 0.5,
            z: 0.5
        };

        effect.position.set(camera.position.x, camera.position.y, -posFix.z);
        effect.scale.set(scaleFix / 2, scaleFix / 2, scaleFix / 2 * 0.05);

        // fill the field with some metaballs

        //this.scale.x = 0.5;
        //this.scale.y = 0.5;


        var i, ballx, bally, ballz, subtract, strength;

        //subtract = 12;
        subtract = 40 *scaleFix / 2000;
        strength = 0.13 * 0.12 /scaleFix * 2000 / ((Math.sqrt(nodeSets[0].length) - 1) / 4 + 1);

        for (var ns = 0; ns < nodeSets.length; ns++){
          for (i = 0; i < nodeSets[ns].length; i++) {
            var node = nodeSets[ns][i];
            effect.addBall((node.x - effect.position.x) / scaleFix + posFix.x , (node.y- effect.position.y) / scaleFix + posFix.y, posFix.z, strength, subtract, node.color, node.reflect);
          }
        }


    };

    if (config.showMetaBalls && config.showShadows) {
        effect.castShadow = true;
    //    effect.receiveShadow = true;
    }

    effect.setPhoto = function(id){
      var photo = moviePhotoOrder[id];
      material.envMap = textureCubesLoader.textureCubes[photo];
      //material.envMap

    };



    return effect;

}





module.exports = {
    build: build,
    update: function(){},
    setPhoto: function(){},
};
