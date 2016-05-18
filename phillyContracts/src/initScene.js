var THREE = require('three');
var TWEEN = require('tween.js');
var d3 = require('d3');
var CircleMaterial = require('./neilviz/CircleMaterial');
var BufferedPlanesGeometry = require('./neilviz/BufferedPlanesGeometry');
var mix = require('./neilviz/util/mix');
//var forceLayout = require('./force');
var d3ForceLayout = require('./d3ForceLayout');


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
var states = require('./states');
var textItems = require('./textItems');

var catsById = model.catsById;
var depts = model.depts;
var dotValue = model.dotValue;
var totalDots = model.totalDots;
var nodes = model.nodes;
var cats = model.cats;

var time = 0;
var clock = new THREE.Clock();

var camera, scene, renderer;
var mesh;

var dotRadius = config.dotRadius;
var showCircles = config.showCircles;
var showMetaBalls = config.showMetaBalls;

var transState = {
  t: 0
};
var currentState = 0;
var transTween;
var textTweens = [];

var force = {
  tick: function() {}
};


function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, -1);
  camera.position.z = 400;

  var textObjects = textItems.getObjects();


  scene = new THREE.Scene();

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight.position.set(0.3, -1, 2);
  scene.add(directionalLight);
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  var circleMat = new CircleMaterial({
    color: 0xff0000,
    indivColors: true
  });

  var width = 960,
    height = 500;

  var ysum = 0;





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


  /*var onTick =  function(){
        nodes.forEach(function(node, i) {
        circleGeo.renderSinglePositions(i, node, dotRadius);
      });
  };

  force = forceLayout(nodes)
    .chargeDistance(dotRadius * 0.8)
    .size([width, height])
    .onTick(onTick);
    //.on("tick", tick);

  */

  function tick(e) {
    var k = 0.1 * e.alpha;

    //force.charge(function(node) {
    //   return (node.nid/nodes.length < transState.t) ? -80 : 0;
    //});




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

  if (showMetaBalls)
    scene.add(metaballs);





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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

  }
  renderer.setClearColor(0xffffff, 1);

  document.body.appendChild(renderer.domElement);
  //
  if (!config.capture) window.addEventListener('resize', onWindowResize, false);

  var maybeHide = function(item) {
    //used for tween on opacity
    return function() {
      item.material.uniforms.opacity.value = this.v;
      item.visible = (this.v > 0);
    };
  };
  var textKeys = Object.keys(textObjects);

  function transStateUpdate() {
    //TODO: add sort order to state
    var ts = this;
    var colorT = Math.max(0, ts.t * 2 - 1);
    var pCam = states[ts.prev].camPos;
    var nCam = states[ts.next].camPos;
    var camEase = TWEEN.Easing.Quadratic.InOut(ts.t);
    camera.position.set(
      mix(pCam.x, nCam.x, camEase),
      mix(pCam.y, nCam.y, camEase),
      mix(pCam.z, nCam.z, camEase)
    );

    nodes.forEach(function(node, i) {
      var pNode = states[ts.prev].nodes[i];
      var nNode = states[ts.next].nodes[i];


      node.foci = (i / nodes.length > ts.t) ? pNode.foci : nNode.foci;
      node.color.r =  mix(pNode.color[0], nNode.color[0], colorT);
      node.color.g =  mix(pNode.color[1], nNode.color[1], colorT);
      node.color.b =  mix(pNode.color[2], nNode.color[2], colorT);
      if (showCircles)
        circleGeo.setSingleColor(i, node.color );
    });
  }

  function gotoState(sid) {
    currentState = sid;
    transState.prev = currentState; //previous state
    transState.next = currentState; // next state
    transState.t = 1;
    transStateUpdate.call(transState);
    textKeys.forEach(function(key) {
      var item = textObjects[key];
      var opacity = (states[sid].text.indexOf(key) >= 0) ? 1 : 0;
      item.material.uniforms.opacity.value = opacity;
      item.visible = (opacity > 0);
    });

  }


  function animateToState(next, prev, startTime) {

    //TODO: be more selective
    //TWEEN.removeAll();
    //transitioning from stated state, or current state
    var sState = (prev === undefined) ? transState : {};

    if (startTime === undefined) startTime = clock.getElapsedTime() * 1000;
    if (prev === undefined) prev = currentState;
    currentState = next;

    sState.t = 0;
    sState.prev = prev;
    sState.next = next;


    transTween = new TWEEN.Tween(sState)
      .onUpdate(transStateUpdate)
      //.onComplete(transStateUpdate)
      .to({
        t: 1
      }, 1200)
      .onStart(force.start)
      .start(startTime);

    var pText = (states[prev] || states.empty).text;
    var nText = (states[next] || states.empty).text;



    textKeys.forEach(function(key) {
      var item = textObjects[key];
      var nOpacity = (nText.indexOf(key) >= 0) ? 1 : 0;
      var pOpacity = (pText.indexOf(key) >= 0) ? 1 : 0;

      if (pOpacity && !nOpacity)
        textTweens.push(new TWEEN.Tween({
          v: pOpacity
        }).to({
          v: nOpacity
        }, 200).onUpdate(maybeHide(item)).start(startTime));
      if (!pOpacity && nOpacity)
        textTweens.push(new TWEEN.Tween({
          v: pOpacity
        }).to({
          v: nOpacity
        }, 500).delay(1100).onUpdate(maybeHide(item)).start(startTime));

    });


  }
  var stateIds = Object.keys(states);
  var curStateNum = 0;

  function nextState() {
    curStateNum = (curStateNum + 1) % stateIds.length;
    animateToState(stateIds[curStateNum]);

  }

  gotoState('wholeCity');

  //force.friction(0);



  if (config.capture) {
    //test
    animateToState('wholeCity', 'wholeCity', 10);
    animateToState('deptByCat', 'wholeCity', 3500);
    animateToState('catTotals', 'deptByCat', 9000);
    animateToState('wholeCity', 'catTotals', 13500);
  } else {
    animateToState('wholeCity');
  }



  renderer.domElement.onclick = function() {
    nextState();
  };

  //for camera positioning
  window._cp = camera.position;
  window.metaballs = metaballs;

}



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
  requestAnimationFrame(animate);
  time = clock.getElapsedTime();
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
