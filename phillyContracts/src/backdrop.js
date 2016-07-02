var THREE = require('three');
var highlights = require('./highlights');
var textures = require('./textures').textures;
var config = require('./config');


module.exports = function() {

    textures.paperNormal.repeat = new THREE.Vector2(20, 20);
    textures.paperNormal.wrapS = textures.paperNormal.wrapT = THREE.RepeatWrapping;

    var mat = new THREE.MeshPhongMaterial({ color: 0xf1f1f1, normalMap: textures.paperNormal, shininess: 10 });

    var geo = new THREE.PlaneBufferGeometry(5000, 5000);

    var backdrop = new THREE.Mesh(geo, mat);
    backdrop.position.z = -10;

    highlights.position.z = 2;
    backdrop.highlights = highlights;
    backdrop.add(highlights);

    module.exports = backdrop;

    if (config.showMetaBalls && config.showShadows) {
      //  backdrop.castShadow = true;
        backdrop.receiveShadow = true;
    }


    return backdrop;




};
