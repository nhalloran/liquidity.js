var THREE = require('three');
var cats = require('./data/cats');
var depts = require('./data/phillyBudgetDeptAndCat');


var catsById = {};
cats.forEach(function(cat, i) {
  cat.x = -500 + 200 * i;
  cat.colorObj = new THREE.Color(cat.color);
  cat.depts = [];
  cat.cid = i;
  cat.t = 0;
  catsById[cat.id] = cat;

});


var dotValue = 5000000;
var totalDots = 0;
var totalBudget = 0;
depts.forEach(function(dept, i) {
  var cat = catsById[dept.c] || catsById.other;
  dept.cat = cat;
  dept.did = i; //for fast lookup
  dept.dn = dept.sn || dept.n, //display name: short name if avail
  cat.depts.push(dept);
  cat.t += dept.t;

  var dots = Math.round(dept.t / dotValue);
  totalDots += dots;
  totalBudget += dept.t;
  //var col = i % 10;
  //var row = Math.floor(i/10);

});

var nodes = [];

depts.forEach(function(dept, did) {
  var count = Math.round(dept.t / dotValue);

  for (var j = 0; j < count; j++) {
    var node = {
      x: Math.random() * 1000 - 500,
      y: Math.random() * 1000 - 500,
      z: 0,
      nid: nodes.length,
      did: did
    };
    nodes.push(node);
  }
});

function sortScore(node){
  var dept = depts[node.did];
  return dept.cat.x * 100000000 - dept.t;
}
nodes.sort(function(a,b){
  return sortScore(a) - sortScore(b);
});


module.exports = {
  cats: cats,
  catsById: catsById,
  depts: depts,
  totalDots: totalDots,
  dotValue: dotValue,
  nodes: nodes,
  totalBudget: totalBudget,

};
