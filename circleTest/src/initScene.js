var THREE = require('three');
var TWEEN = require('tween.js');
var d3 = require('d3');
var CircleMaterial = require('./neilviz/CircleMaterial');
var BufferedPlanesGeometry = require('./neilviz/BufferedPlanesGeometry');
var mix = require('./neilviz/util/mix');

var blobTest = require('./blobTest');
var config = require('./config');

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

var transState = {t:0};
var currentState = 0;
var transTween;


function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, -1);
  camera.position.z = 400;


  scene = new THREE.Scene();

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set( 0.3, -1, 2 );
  scene.add( directionalLight );

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
      //if(i/nodes.length < transState.t){
        var foci = o.foci;
        var distSq = (foci.y - o.y) * (foci.y - o.y) + (foci.x - o.x) * (foci.x - o.x);
        //less than 20,000 should start to taper
        var innerPull = 0.1 * Math.max(0,Math.min(1,(15 - foci.distSq/1000)));
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
  scene.add(circles);

  if (showMetaBalls)
    scene.add(blobTest);





  force.start();


 Object.keys(textItems).forEach(function(key){
   textItems[key].position.z = 3;
   scene.add(textItems[key]);
   textItems[key].updateMatrix();
 });

 window.textItems = textItems;



  renderer = new THREE.WebGLRenderer();
//  renderer.autoClear = false;

  renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.physicallyBasedShading = true;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);

  document.body.appendChild(renderer.domElement);
  //
  window.addEventListener('resize', onWindowResize, false);

  var maybeHide = function(item){
    //used for tween on opacity
    return function(){
      item.visible = (this.value > 0);
    };
  };
  var textKeys = Object.keys(textItems);
  function transStateUpdate(){
    //TODO: add sort order to state
    var ts = this;
    var colorT = Math.max(0,ts.t * 2 - 1);
    nodes.forEach(function(node,i){
      var pNode = states[ts.prev].nodes[i];
      var nNode = states[ts.next].nodes[i];


      node.foci = (i/nodes.length > ts.t) ? pNode.foci
        : nNode.foci;
      circleGeo.setSingleColor(i,{
        r: mix(pNode.color[0],nNode.color[0],colorT),
        g: mix(pNode.color[1],nNode.color[1],colorT),
        b: mix(pNode.color[2],nNode.color[2],colorT)
      });

    });
  }
  function goToState(sid){



    transState.prev = currentState; //previous state
    transState.next = sid; // next state
    currentState = sid;


    transState.t = 0;
    transTween = new TWEEN.Tween(transState)
     .onUpdate(transStateUpdate)
     //.onComplete(transStateUpdate)
     .to({t:1},1200)
     .start();
    force.start();
    textKeys.forEach(function(key){
      item = textItems[key];
      item.material.uniforms.opacity.value = 0;
      var isDept = (key.substring(0,5) === 'dept_');
      var isCat = (key.substring(0,4) === 'cat_');
      if(sid === 'deptByCat' && isDept){
        new TWEEN.Tween(item.material.uniforms.opacity).to({value:1},500).delay(1100).onUpdate(maybeHide(item)).start();
      }
      if(sid === 'catTotals' && isCat){
        new TWEEN.Tween(item.material.uniforms.opacity).to({value:1},500).delay(1100).onUpdate(maybeHide(item)).start();
      }
      if(sid === 'wholeCity' && !isCat && !isDept){
        new TWEEN.Tween(item.material.uniforms.opacity).to({value:1},500).delay(1100).onUpdate(maybeHide(item)).start();
      }

    });


  }
  var stateIds = Object.keys(states);
  var curStateNum = 0;
  function nextState(){
    curStateNum = (curStateNum + 1) % stateIds.length;
    goToState(stateIds[curStateNum]);

  }
  currentState = 'wholeCity';
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
//  var delta = clock.getDelta();
//	time += delta * 0.5;
  if (showMetaBalls)
    blobTest.update(nodes);
  renderer.render(scene, camera);
}

module.exports = {
  init: init,
  animate: animate,
};
