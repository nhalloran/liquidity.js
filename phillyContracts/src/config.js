/* Project configuration */

var config = {
  dotRadius: 10,
  dotValue: 5000000,
  //dotValue: 1000000,
  showCircles:true,
  showMetaBalls:false,
  showShadows:false,
  metaballResolution: 150,
  movie: true,
  capture: false, // setting capture to true sets movie to true below
  captureWidth: 1280,
  captureHeight: 720,
  captureFPS: 30,
  captureDuration:185, // seconds
  lightIFactor: 1.4,
  colorCanvasRez: 4,
  popDotsPos: [230,-780]

};

config.captureAlphaRatio = 45 / config.captureFPS;

if (config.capture) config.movie = true;

module.exports = config;
