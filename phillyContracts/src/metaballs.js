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

    var scaleFix = 2000;
    var posFix = {
        x: 0.5,
        y: 0.5,
        z: 0.5
    };

    effect.position.set(-posFix.x, -posFix.y, -posFix.z);
    effect.scale.set(scaleFix / 2, scaleFix / 2, scaleFix / 2 * 0.05);

    //effect.enableUvs = false;


    effect.update = function(nodes) {

        effect.reset();

        // fill the field with some metaballs

        var i, ballx, bally, ballz, subtract, strength;

        //subtract = 12;
        subtract = 40;
        strength = 0.13 * 0.1 * 1.2 / ((Math.sqrt(nodes.length) - 1) / 4 + 1);

        for (i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            effect.addBall(node.x / scaleFix + posFix.x, node.y / scaleFix + posFix.y, posFix.z, strength, subtract, node.color, node.reflect);

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
};
