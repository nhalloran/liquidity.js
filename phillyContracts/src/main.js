var config = require('./config');
var initScene = require('./initScene');
var textureLoader = require('./textures');


window.onload = function() {
  textureLoader.load().then(function(){
    initScene.init();
    if (config.capture) {
      initScene.captureFrames();
    } else {
      initScene.animate();
    }

  });



};
