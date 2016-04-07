var THREE = require('three');
var d3 = require('d3');
var CircleMaterial = require('./neilviz/CircleMaterial');
var BufferedPlanesGeometry = require('./neilviz/BufferedPlanesGeometry');

var depts = require('./data/phillyBudgetDeptAndCat');
var cats = require('./data/cats');

var catsById = {};
cats.forEach(function(cat,i){
  cat.x = -500 + 200 * i;
  cat.colorObj = new THREE.Color(cat.color);
  cat.depts = [];
  catsById[cat.id] = cat;

});


var camera, scene, renderer;
var mesh;

var dotRadius = 10;


function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;
  scene = new THREE.Scene();

  var circleMat= new CircleMaterial({color:0xff0000, indivColors:true});



  var width = 960,
    height = 500;


var ysum = 0;

var nodes = [];

var dotValue = 5000000;
var totalDots = 0;
depts.forEach(function(dept, i){
  var cat = catsById[dept.c] || catsById.other;
  dept.cat = cat;
  cat.depts.push(dept);

  var dots = Math.round(dept.t/dotValue);
  totalDots += dots;
  //var col = i % 10;
  //var row = Math.floor(i/10);

});

cats.forEach(function(cat){
  cat.depts.sort(function(a,b){
    return b.t - a.t;
  });
  yC = 100;
  cat.depts.forEach(function(dept){
    dept.foci =  { x: cat.x,  y:yC};
    yC -=  Math.sqrt(dept.t) * 0.004;

  });
});


var circleGeo = new BufferedPlanesGeometry({count:totalDots, indivColors:true});



var dotIndex = 0;
depts.forEach(function(dept, i){
  var count = Math.round(dept.t/dotValue);

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
  circleGeo.setSingleColor(dotIndex, dept.cat.colorObj);

  dotIndex++;

}



});

var foci = {x:0,y:0};
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
        var foci = depts[o.ci].foci;
        o.y += (foci.y - o.y) * k;
        o.x += (foci.x - o.x) * k;
      });


      nodes.forEach(function(node, i) {
        circleGeo.renderSinglePositions(i,node,dotRadius );
      });


    }


  var circles= new THREE.Mesh(circleGeo,circleMat);
  scene.add(circles);

  force.start();



  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( 0xffffff, 1);
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
