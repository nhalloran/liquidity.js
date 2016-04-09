var THREE = require('three');
var TWEEN = require('tween.js');
var d3 = require('d3');
var CircleMaterial = require('./neilviz/CircleMaterial');
var BufferedPlanesGeometry = require('./neilviz/BufferedPlanesGeometry');

var model = require('./model');
var states = require('./states');

var catsById = model.catsById;
var depts = model.depts;
var dotValue = model.dotValue;
var totalDots = model.totalDots;
var nodes = model.nodes;
var cats = model.cats;


var camera, scene, renderer;
var mesh;

var dotRadius = 10;

var transState = {t:0};
var transTween;


function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;
  scene = new THREE.Scene();

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

  var foci = {
    x: 0,
    y: 0
  };
  var force = d3.layout.force()
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

    //force.charge(function(node) {
    //   return (node.nid/nodes.length < transState.t) ? -80 : 0;
    //});




    // Push nodes toward their designated focus.
    nodes.forEach(function(o, i) {
      if(i/nodes.length < transState.t){
        var foci = o.foci;
        var distSq = (foci.y - o.y) * (foci.y - o.y) + (foci.x - o.x) * (foci.x - o.x);
        var antidense = (distSq > foci.distSq) ? 1 : 0.1;
        o.y += (foci.y - o.y) * k * antidense;
        o.x += (foci.x - o.x) * k * antidense;
      }
    });


    nodes.forEach(function(node, i) {
      circleGeo.renderSinglePositions(i, node, dotRadius);
    });


  }


  var circles = new THREE.Mesh(circleGeo, circleMat);
  scene.add(circles);

  force.start();



  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);
  document.body.appendChild(renderer.domElement);
  //
  window.addEventListener('resize', onWindowResize, false);


  function goToState(sid){
    states[sid].nodes.forEach(function(sNode){
      nodes[sNode.nid].foci = sNode.foci;
    });
    transState.t = 0;
    transTween = new TWEEN.Tween(transState)
     .to({t:1},1200)
     .start();
    force.start();

  }
  var stateIds = Object.keys(states);
  var curStateNum = 0;
  function nextState(){
    curStateNum = (curStateNum + 1) % stateIds.length;
    goToState(stateIds[curStateNum]);

  }

  goToState('wholeCity');
//wholeCity
//deptByCat

  renderer.domElement.onclick = function(){
    nextState();
  };
}




function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
}

module.exports = {
  init: init,
  animate: animate,
};
