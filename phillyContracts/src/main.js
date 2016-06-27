var config = require('./config');
var initScene = require('./initScene');
var textureLoader = require('./textures');
var textureCubesLoader = require('./textureCubes');


window.onload = function() {
  Promise.all([textureLoader.load(), textureCubesLoader.load()]).then(function(){
    initScene.init();
    if (config.capture) {
      initScene.captureFrames();
    } else {
      initScene.animate();
    }

  });



};
