var config = require('./config');
var initScene = require('./initScene');

window.onload = function() {
  initScene.init();
  if (config.capture) {
    initScene.captureFrames();
  } else {
    initScene.animate();
  }


}
