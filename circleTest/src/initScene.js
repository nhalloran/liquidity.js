var THREE = require('three');
var d3 = require('d3');
var CircleMaterial = require('./neilviz/CircleMaterial');
var BufferedPlanesGeometry = require('./neilviz/BufferedPlanesGeometry');

var data = require('./data/phillyBudgetDeptAndCat');

var camera, scene, renderer;
var mesh;

var dotRadius = 10;


function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;
  scene = new THREE.Scene();

  var redMat= new CircleMaterial({color:0xff0000});



  var width = 960,
    height = 500;


cats = [];
var ysum = 0;

var nodes = [];

var dotValue = 5000000;
var totalDots = 0;
data.forEach(function(item, i){
  var dots = Math.round(item.t/dotValue);
  totalDots += dots;
  var col = i % 10;
  var row = Math.floor(i/10);
  item.foci =  { x: -500 + col * 100,  y:-300 + row * 100};
});


var circleGeo = new BufferedPlanesGeometry({count:totalDots});



var dotIndex = 0;
data.forEach(function(item, i){
  var count = Math.round(item.t/dotValue);

  for (var j = 0; j < count; j ++){

  //var radius = Math.sqrt(item.t) * 0.001;

  var node = {
    x:Math.random() * 1000 - 500,
    y:Math.random() * 1000 - 500,
    z: 0,
    ci: i
  };

  nodes.push(node);

  var geo = new THREE.PlaneBufferGeometry(1,1);

  circleGeo.merge(geo,dotIndex * 4);
  circleGeo.mergeIndex(geo,dotIndex);

  dotIndex++;

}



});

var foci = {x:0,y:0};
var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .gravity(0)
    .chargeDistance(dotRadius)
    .size([width, height])
    .on("tick", tick);

    function tick(e) {
      var k = 0.1 * e.alpha;




      // Push nodes toward their designated focus.
      nodes.forEach(function(o, i) {
        var foci = data[o.ci].foci;
        o.y += (foci.y - o.y) * k;
        o.x += (foci.x - o.x) * k;
      });


      nodes.forEach(function(node, i) {
        circleGeo.renderSinglePositions(i,node,dotRadius );
      });


    }


  var circles= new THREE.Mesh(circleGeo,redMat);
  scene.add(circles);

  force.start();



  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
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
