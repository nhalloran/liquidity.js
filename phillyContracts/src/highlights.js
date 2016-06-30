var THREE = require('three');
var CircleMaterial = require('./neilviz/CircleMaterial');
var layoutStates = require('./layoutStates');
var model = require('./model');

var states = {};

var highlights = new THREE.Object3D();


states.poverty = function(){
  var state = {
    reveal:0,
    circles:[]
  };

  layoutStates.deptByCat.focis.forEach(function(foci){
    var dept = model.depts[foci.did];
    if (dept.p) {
      var radius = model.radius(dept.t) + 40;
      var geo = new THREE.PlaneBufferGeometry(radius * 2, radius * 2);
      var mat = new CircleMaterial({epsilon:0.15});
      var circle = new THREE.Mesh(geo,mat);
      circle.position.x = foci.x;
      circle.position.y = foci.y;
      highlights.add(circle);
      state.circles.push(circle);
    }
  });


  return state;




}();
var stateKeys = Object.keys(states);
highlights.update = function(){
  stateKeys.forEach(function(key){
    var state = states[key];
      state.circles.forEach(function(circle){
        circle.material.uniforms.opacity.value = state.reveal;
        circle.visible = (state.reveal > 0);
      });
  });
};



highlights.update();

module.exports = highlights;
