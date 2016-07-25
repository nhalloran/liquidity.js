var THREE = require('three');
var TWEEN = require('tween.js');
var d3 = require('d3');
var BufferedPlanesGeometry = require('./neilviz/BufferedPlanesGeometry');
var mix = require('./neilviz/util/mix');
//var forceLayout = require('./force');
var liquidDots = require('./liquidDots');
var layoutTransitions = require('./layoutTransitions');
var layoutStates = require('./layoutStates');
var layoutStatesPop = require('./layoutStatesPop');
var movieLayoutOrder = require('./movieLayoutOrder');
var movieUpdates = require('./movieUpdates');
var movieTweens = require('./movieTweens');
var movieStates = require('./movieStates');
var backdrop = require('./backdrop');
var reveals = require('./reveals');
var highlights = require('./highlights');
var getUrlVars = require('./neilviz/util/getUrlVars');
var textures = require('./textures').textures;




var audioEl;




var metaballs = require('./metaballs');
var config = require('./config');


//only during capture mode
if (config.capture) {
  var CCapture = require('ccapture.js');
  var capturer = new CCapture({
    verbose: false,
    display: true,
    framerate: config.captureFPS,
    motionBlurFrames: 1,
    quality: 100,
    format: 'webm', //'jpg',
    //  timeLimit: 5,
    //  onProgress: function( p ) { progress.style.width = ( p * 100 ) + '%' }
  });
}

//replace these


var model = require('./model');
var textItems = require('./textItems');

var catsById = model.catsById;
var depts = model.depts;
var dotValue = model.dotValue;
var totalDots = model.totalDots;
var nodes = model.nodes;
var popNodes = model.popNodes;
var cats = model.cats;

var time = 0;
var clock = new THREE.Clock();

var objects = {};

var camera, scene, renderer;
var revDots;

var showCircles = config.showCircles;
var showMetaBalls = config.showMetaBalls;



var force = {
  tick: function() {}
};


function init() {

  backdrop = backdrop();


  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, -1);
  camera.position.set(movieStates.initial.camX, movieStates.initial.camY, movieStates.initial.camZ);

  var textObjects = textItems.getObjects();


  audioEl = document.getElementById('narration');


  scene = new THREE.Scene();

  //var directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  //directionalLight.position.set(0.3, -1, 2);
  //scene.add(directionalLight);

  var pointLight = new THREE.PointLight(0xffffff,config.lightIFactor,5000);
  if(config.showMetaBalls && config.showShadows){
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 30;
       pointLight.shadowCameraVisible = true;
    pointLight.shadow.bias = 0.01;

  }

  pointLight.position.z = 1500;
  scene.add(pointLight);
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  //scene.add(ambientLight);




  scene.add(backdrop);



  revDots = liquidDots.build({
    nodes:nodes,
    width: 960,
    height: 500,
    dotRadius: config.dotRadius
  });

  if (showCircles)
    scene.add(revDots);

  popDots = liquidDots.build({
      nodes:popNodes,
      width: 960,
      height: 500,
      dotRadius: config.dotRadius
    });

    popDots.position.x = config.popDotsPos[0];
    popDots.position.y = config.popDotsPos[1];

    if (showCircles){
      scene.add(revDots);
      scene.add(popDots);
    }
    objects.revDots = revDots;
    objects.popDots = popDots;
    objects.popDots.visible = false;









  var revealObjects = reveals.makeObjects(textures);
  objects.revealObjects = revealObjects;
  Object.keys(revealObjects).forEach(function(key){scene.add(revealObjects[key]);});



  if (showMetaBalls){
    metaballs = metaballs.build();
    scene.add(metaballs);
    //for debugging
  }








  Object.keys(textObjects).forEach(function(key) {
    textObjects[key].position.z = 3;
    scene.add(textObjects[key]);
    textObjects[key].updateMatrix();
  });




  renderer = new THREE.WebGLRenderer({ antialias: true });
  //  renderer.autoClear = false;

  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.physicallyBasedShading = true;
  if (config.capture) {
    renderer.setPixelRatio(1);
    renderer.setSize(config.captureWidth, config.captureHeight);
    camera.aspect = config.captureWidth / config.captureHeight;
    camera.updateProjectionMatrix();

  } else {
    renderer.setPixelRatio(1);//window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  if (config.showMetaBalls && config.showShadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;
  }

  renderer.setClearColor(0xffffff, 1);

  var stageEl = document.getElementById('stage');
  stageEl.appendChild(renderer.domElement);
  //
  if (!config.capture) window.addEventListener('resize', onWindowResize, false);


  var layoutTransitionsRev = layoutTransitions({
    textObjects: textObjects,
    showCircles: showCircles,
    nodes: nodes,
    camera: camera,
    clock: clock,
    dots: revDots,
    layoutStates:layoutStates,
    movieLayoutOrder: movieLayoutOrder.rev
  });

  var layoutTransitionsPop = layoutTransitions({
    textObjects: {},
    showCircles: {},
    nodes: popNodes,
    camera: camera,
    clock: clock,
    dots: popDots,
    layoutStates:layoutStatesPop,
    movieLayoutOrder: movieLayoutOrder.pop
  });

  // movie init
  // should setup objects object before layoutTransitions
  objects.camera = camera;
  objects.metaballs = metaballs;
  objects.pointLight = pointLight;
  objects.backdrop = backdrop;
  if (config.movie){
    movieUpdates = movieUpdates({
      layoutTransitionsRev: layoutTransitionsRev ,
      layoutTransitionsPop: layoutTransitionsPop ,
      objects: objects
    });
    movieTweens.init({
      movieUpdates: movieUpdates,
      revDots: revDots,
      popDots: popDots
    });

  }


  if (config.movie){
    layoutTransitionsRev.gotoMovieState(0);
    layoutTransitionsPop.gotoMovieState(0);
  }
  //else
  //  layoutTransitions.gotoState('wholeCity');

  //force.friction(0);







//  renderer.domElement.onclick = function() {
//    layoutTransitions.nextState();
//  };

  //for camera positioning
  window._cp = camera.position;
  window._cr = camera.rotation;
  window.objects = objects;
  window.TWEEN = TWEEN;


  var urlVars =  getUrlVars();
  if (urlVars.goto) audioEl.currentTime = Number(urlVars.goto);

}



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
  requestAnimationFrame(animate);
  if (config.movie)
    movieTweens.update(audioEl.currentTime);
  else
    TWEEN.update(clock.getElapsedTime() * 1000);

  if (showMetaBalls && metaballs.visible)
    metaballs.update(nodes);
  renderer.render(scene, camera);

}

function captureFrames() {
    var frameDur = 1 / config.captureFPS;
    var f = 0;
    capturer.start();
    function nextFrame(){
        time = f * frameDur;
        f++;
        if (time < config.captureDuration){
          movieTweens.update(time);

          if (showMetaBalls && metaballs.visible) metaballs.update(nodes);

          renderer.render(scene, camera);
          capturer.capture(renderer.domElement);
          requestAnimationFrame(nextFrame);
        }
        else{
          capturer.stop();
          capturer.save();

        }
      }
      nextFrame();

}

module.exports = {
  init: init,
  animate: animate,
  captureFrames: captureFrames
};
