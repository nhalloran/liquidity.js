var THREE = require('three');
var cats = require('./data/cats');
var depts = require('./data/depts');
var initialPositions = require('./data/initialPositions');
var config = require('./config');
var phillyDemographics = require('./data/phillyDemographics.js');
var budget = require('dsv!./data/phillyBudget2015.csv');

var deptsLookup = {};

var missingDepts = [];

var radiusSquared = function(t){
  return t * 0.0000035;
};
var radius = function(t){
  return Math.sqrt(radiusSquared(t));
};

var deptNameScale = function(t){
  var scale = radius(t) * 0.5;
  return Math.max(10,Math.min(18,scale));
};

depts.forEach(function(dept,did){
  dept.t = 0;
  dept.tc = 0;
//  dept.tp = 0;
  deptsLookup[dept.n] = dept;

});

var BHContractTotal = 0,
    contractTotal = 0,
    procurementTotal = 0,
    nonContractTotal = 0;

budget.forEach(function(item){
  var dept = deptsLookup[item.department];
  if (dept){
    dept.t += Number(item.total);
    if (Number(item.class_id) == 2 || Number(item.class_id) == 3 || Number(item.class_id) == 4){
      //if (Number(item.class_id) > 2)   dept.tcp += Number(item.total);
      if (Number(item.class_id) > 2) procurementTotal += Number(item.total);
      dept.tc += Number(item.total);
      contractTotal += Number(item.total);
      if (dept.sn === 'Behavioral Health') BHContractTotal += Number(item.total);

    } else {
      nonContractTotal += Number(item.total);

    }
  }else{
    console.log('no dept match', item.department);
    if (missingDepts.indexOf(item.department) === -1)
      missingDepts.push(item.department);
  }
});


var depts = depts.filter(function(dept){
  return dept.t > 0;
});
var behavioralHealthDid;
depts.forEach(function(dept, did){
  if(dept.sn === 'Behavioral Health') behavioralHealthDid = did;
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
  dept.dn = dept.sn || dept.n; //display name: short name if avail
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
  if(i+1 < cats.length) catX += 80 + (lt + nt) / 33000000;
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

//population nodes should

function sortScore(node){
  var dept = depts[node.did];
  return dept.cat.x * 100000000 - dept.t;
}
nodes.sort(function(a,b){
  return sortScore(a) - sortScore(b);
});


//population nodes. same count as rev

var dotValuePop = 100/nodes.length;

var radiusSquaredPop = function(p){
  var t = p / dotValuePop * dotValue;
  return radiusSquared(t);
};




var raceCounts = phillyDemographics.races.map(function(race){
  return Math.round(race.p / 100 * nodes.length);
});

function getNextRace(){
  for (var i = Math.floor(Math.random() * raceCounts.length), j = 0; j < raceCounts.length; i++, j++){
    if(raceCounts[i%raceCounts.length] >=0){
      raceCounts[i%raceCounts.length] --;
      return i%raceCounts.length;
    }
  }
  return 0;

}


var popNodes = nodes.map(function(node){
  return {
    x: node.x,
    y: node.y,
    z: 0,
    color: {r:0,g:0,b:0},
    rid: getNextRace(),
    gender: (Math.random() > 0.5) ? 'm' : 'f'
  };
});



module.exports = {
  nodes: nodes,
  popNodes: popNodes,
  cats: cats,
  catsById: catsById,
  depts: depts,
  totalDots: totalDots,
  dotValue: dotValue,
  totalBudget: totalBudget,
  radiusSquared: radiusSquared,
  radius: radius,
  deptNameScale: deptNameScale,
  behavioralHealthDid: behavioralHealthDid,
  BHContractTotal: BHContractTotal,
  contractTotal: contractTotal,
  nonContractTotal: nonContractTotal,
  procurementTotal: procurementTotal,
  phillyRaces: phillyDemographics.races,
  radiusSquaredPop: radiusSquaredPop

};
