var config = require('./config');
var initScene = require('./initScene');

initScene.init();
if (config.capture){
  initScene.captureFrames();
}
else{
  initScene.animate();
}
