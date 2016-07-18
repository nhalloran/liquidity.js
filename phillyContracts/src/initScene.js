var THREE = require('three');
var TWEEN = require('tween.js');
var d3 = require('d3');
var CircleMaterial = require('./neilviz/CircleMaterial');
var BufferedPlanesGeometry = require('./neilviz/BufferedPlanesGeometry');
var mix = require('./neilviz/util/mix');
//var forceLayout = require('./force');
var d3ForceLayout = require('./d3ForceLayout');
var layoutTransitions = require('./layoutTransitions');
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
    quality: 95,
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
var cats = model.cats;

var time = 0;
var clock = new THREE.Clock();

var objects = {};

var camera, scene, renderer;
var mesh;

var dotRadius = config.dotRadius;
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
  window.textObjects = textObjects;


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

  var circleMat = new CircleMaterial({
    color: 0xff0000,
    indivColors: true
  });

  var width = 960,
    height = 500;

  var ysum = 0;


  scene.add(backdrop);





  var circleGeo = new BufferedPlanesGeometry({
    count: totalDots,
    indivColors: true
  });


  var dotIndex = 0;
  nodes.forEach(function(node) {


    var geo = new THREE.PlaneBufferGeometry(1, 1);
    var dept = depts[node.did];

    circleGeo.merge(geo, dotIndex * 4);
    circleGeo.mergeIndex(geo, dotIndex);
    circleGeo.setSingleColor(dotIndex, dept.cat.colorObj);

    dotIndex++;


  });


  force = d3ForceLayout()
    .nodes(nodes)
    .links([])
    .gravity(0)

  .charge(-80)
    //.theta(0.2)
    .chargeDistance(dotRadius * 0.8)
    .size([width, height])
    .on("tick", tick);



  function tick(e) {
    var k = 0.1 * e.alpha;





    // Push nodes toward their designated focus.
    nodes.forEach(function(o, i) {
      //if(i/nodes.length < transState.t){
      var foci = o.foci;
      var distSq = (foci.y - o.y) * (foci.y - o.y) + (foci.x - o.x) * (foci.x - o.x);
      //less than 20,000 should start to taper
      var innerPull = 0.1 * Math.max(0, Math.min(1, (15 - foci.distSq / 1000)));
      var antidense = (distSq > foci.distSq) ? 1 : innerPull;
      o.y += (foci.y - o.y) * k * antidense;
      o.x += (foci.x - o.x) * k * antidense;
      //}
    });


    nodes.forEach(function(node, i) {
      circleGeo.renderSinglePositions(i, node, dotRadius);
    });


  }


  var circles = new THREE.Mesh(circleGeo, circleMat);
  if (showCircles)
    scene.add(circles);


  var revealObjects = reveals.makeObjects(textures);
  objects.revealObjects = revealObjects;
  //window.revealObjects = revealObjects;
  Object.keys(revealObjects).forEach(function(key){scene.add(revealObjects[key]);});



  if (showMetaBalls){
    metaballs = metaballs.build();
    scene.add(metaballs);
    //for debugging
    window.metaballs = metaballs;
  }






  force.start();


  Object.keys(textObjects).forEach(function(key) {
    textObjects[key].position.z = 3;
    scene.add(textObjects[key]);
    textObjects[key].updateMatrix();
  });

  window.textObjects = textObjects;



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


  layoutTransitions = layoutTransitions({
    textObjects: textObjects,
    showCircles: showCircles,
    nodes: nodes,
    circleGeo: circleGeo,
    camera: camera,
    clock: clock,
    force: force,
  });

  // movie init
  // should setup objects object before layoutTransitions
  objects.camera = camera;
  objects.metaballs = metaballs;
  objects.pointLight = pointLight;
  objects.backdrop = backdrop;
  if (config.movie){
    movieUpdates = movieUpdates({
      layoutTransitions: layoutTransitions,
      objects: objects
    });
    movieTweens = movieTweens({
      movieUpdates: movieUpdates
    });
    movieTweens.forEach(function(tween){
      tween.start();
    });

  }


  if (config.movie)
    layoutTransitions.gotoMovieState(0);
  else
    layoutTransitions.gotoState('wholeCity');

  //force.friction(0);







  renderer.domElement.onclick = function() {
    layoutTransitions.nextState();
  };

  //for camera positioning
  window._cp = camera.position;
  window._cr = camera.rotation;
  window.metaballs = metaballs;
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
  time = (config.movie) ? audioEl.currentTime : clock.getElapsedTime();
  TWEEN.update(time * 1000);
  force.tick();
  //  var delta = clock.getDelta();
  //	time += delta * 0.5;
  if (showMetaBalls)
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
          TWEEN.update(time * 1000);
          force.tick();
          if (showMetaBalls) metaballs.update(nodes);
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
