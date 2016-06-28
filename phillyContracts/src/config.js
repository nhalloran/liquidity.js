/* Project configuration */

var config = {
  dotRadius: 10,
  dotValue: 5000000,
  //dotValue: 1000000,
  showCircles:true,
  showMetaBalls:false,
  metaballResolution: 450,
  movie: true,
  capture: false, // setting capture to true sets movie to true below
  captureWidth: 1280,
  captureHeight: 720,
  captureFPS: 30,
  captureDuration:19 // seconds

};

if (config.capture) config.movie = true;

module.exports = config;
