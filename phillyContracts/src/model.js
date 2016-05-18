var THREE = require('three');
var cats = require('./data/cats');
var depts = require('./data/depts');
var initialPositions = require('./data/initialPositions');
var config = require('./config');
var budget = require('dsv!./data/phillyBudget2015.csv');

var deptsLookup = {};

var missingDepts = [];

depts.forEach(function(dept){
  dept.t = 0;
  deptsLookup[dept.n] = dept;
});


budget.forEach(function(item){
  var dept = deptsLookup[item.department];
  if (dept)
    dept.t += Number(item.total);
  else{
    console.log('no dept match', item.department);
    if (missingDepts.indexOf(item.department) === -1)
      missingDepts.push(item.department);
  }
});


var depts = depts.filter(function(dept){
  return dept.t > 0;
});



var eduDistrictSpending2015 = 2864005 * 1000;

var catsById = {};
cats.forEach(function(cat, i) {
  cat.colorObj = new THREE.Color(cat.color);
  cat.depts = [];
  cat.cid = i;
  cat.t = 0;
  catsById[cat.id] = cat;

});


var dotValue = config.dotValue;
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

var catX = 0;
cats.forEach(function(cat, i) {
  cat.x = catX;
  lt = cat.t;
  nt = (cats[i+1]) ? cats[i+1].t : 0;
  if(i+1 < cats.length) catX += 70 + (lt + nt) / 33000000;
});
cats.forEach(function(cat, i) {
  cat.x -= catX/2;
});


var nodes = [];

depts.forEach(function(dept, did) {
  var count = Math.round(dept.t / dotValue);

  for (var j = 0; j < count; j++) {
    var nid = nodes.length;
    var initialPos = initialPositions[nid] || [0,0];
    var node = {
      x: initialPos[0],
      y: initialPos[1],
      z: 0,
      nid: nid,
      did: did,
      color: {r:0,g:0,b:0}
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
