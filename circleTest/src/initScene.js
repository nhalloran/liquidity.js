var THREE = require('three');
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




  states.deptByCat.nodes.forEach(function(sNode){
    nodes[sNode.nid].foci = sNode.foci;
  });


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
    .charge(-85)
    //.theta(0.2)
    .chargeDistance(dotRadius)
    .size([width, height])
    .on("tick", tick);

  function tick(e) {
    var k = 0.1 * e.alpha;




    // Push nodes toward their designated focus.
    nodes.forEach(function(o, i) {
      var foci = o.foci;
      o.y += (foci.y - o.y) * k;
      o.x += (foci.x - o.x) * k;
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
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

module.exports = {
  init: init,
  animate: animate,


}
