var model = require('./model');

var catsById = model.catsById;
var depts = model.depts;
var cats = model.cats;
var dotValue = model.dotValue;
var totalDots = model.totalDots;
var nodes = model.nodes;


var states = {};


// *********************
//   make each state...
// *********************

states.wholeCity = function() {
  // state
  var foci = {x: 0,y: 0};
  var state = {
    focis: [foci],
    nodes: []
  };

  nodes.forEach(function(node,i){
    state.nodes.push({
      foci:foci,
      nid: i,
    });
  });

  return state;

}();




states.deptByCat = function() {
  // state
  var state = {
    focis: [],
    nodes: []
  };

  var deptFoci = []; //for this state, assigns a foci to each dept

  cats.forEach(function(cat) {
    cat.depts.sort(function(a, b) {
      return b.t - a.t;
    });
    yC = 100;
    cat.depts.forEach(function(dept) {
      var foci = {
        x: cat.x,
        y: yC
      };
      state.focis.push(foci);
      deptFoci[dept.did] = foci;
      yC -= Math.sqrt(dept.t) * 0.004;
    });
  });

  nodes.forEach(function(node, i) {
    state.nodes.push({
      nid: i,
      foci: deptFoci[node.did]
    });
  });

  return state;
}();


module.exports = states;
