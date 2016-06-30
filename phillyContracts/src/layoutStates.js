var model = require('./model');
var extend = require('./neilviz/util/extend');

var radiusSquared = model.radiusSquared;
var radius = model.radius;


var catsById = model.catsById;
var depts = model.depts;
var cats = model.cats;
var dotValue = model.dotValue;
var totalDots = model.totalDots;
var nodes = model.nodes;

//TODO: move to util file
function hexToRgbArray(hex) {
  hex = Math.floor( hex );

  return [
        ( hex >> 16 & 255 ) / 255,
        ( hex >> 8 & 255 ) / 255,
        ( hex & 255 ) / 255
    ];

}


//var textObjects = require('./textItems').objects;


var states = {};
//var textKeys = Object.keys(textObjects);





// *********************
//   Make each state...
//   Every state has:
//      1)  array of focis (points where balls gravitate towards)
//      2)  array of nodes, that correspond to balls and indicate which foci they are linked to
//      3)  array of text objects that
//   It's probably a good idea to makes states immutable, meaning they don't include functions
//   or refernces to other objects, which is why the nodes refernce the focis by numeric id
//   not actual refernces.
// *********************

/*states.empty = {
    focis: [],
    nodes: [],
    text: []
  };
*/

states.wholeCity = function() {

  // state
  var foci = {
    x: 0,
    y: 0,
    distSq: radiusSquared(model.totalBudget)
  };

  var state = {
    focis: [foci],
    nodes: [],
    text: ['phillyTotal'],
    camPos:{
      x:0,
      y:0,
      z:300
    },
  };

  nodes.forEach(function(node,i){
    state.nodes.push({
      foci:foci,
      nid: i,
      color: hexToRgbArray(0x333333)
    });
  });

  return state;

}();

states.wholeCityNoText = extend({},states.wholeCity, {text:[]});




states.deptByCat = function() {
  // state
  var state = {
    focis: [],
    nodes: [],
    text: [],
    camPos:{
      x:0,
      y:0,
      z:500
    },
  };



  var deptFoci = []; //for this state, assigns a foci to each dept

  cats.forEach(function(cat) {
    cat.depts.sort(function(a, b) {
      return b.t - a.t;
    });
    yC = 200;
    cat.depts.forEach(function(dept) {

      state.text.push('dept_t_' + dept.did);
      state.text.push('dept_n_' + dept.did);

      yC -= radius(dept.t);



      var foci = {
        x: cat.x,
        y: yC,
        distSq: radiusSquared(dept.t),
        did: dept.did

      };


      state.focis.push(foci);
      deptFoci[dept.did] = foci;
      yC -= radius(dept.t) + model.deptNameScale(dept.t)*2 + 10;
    });
  });

  nodes.forEach(function(node, i) {
    state.nodes.push({
      nid: i,
      foci: deptFoci[node.did],
      color: hexToRgbArray(depts[node.did].cat.color)
    });
  });

  return state;
}();

states.catTotals = function() {
  // state
  var state = {
    focis: [],
    nodes: [],
    text: [],
    camPos:{
      x:0,
      y:100,
      z:500
    },
  };

  var catFoci = []; //for this state, assigns a foci to each dept

  cats.forEach(function(cat) {

    state.text.push('cat_t_' + cat.cid);
    state.text.push('cat_n_' + cat.cid);

    var foci = {
        x: cat.x,
        y: 200 - radius(cat.t),
        distSq: radiusSquared(cat.t),
        cid: cat.cid

      };
      state.focis.push(foci);
      catFoci[cat.cid] = foci;

      //temp
      /*if (textObjects['cat_t_' + cat.cid]){
        textObjects['cat_t_' + cat.cid].position.x = cat.x;
        textObjects['cat_t_' + cat.cid].position.y = 10;
        textObjects['cat_n_' + cat.cid].position.x = cat.x;
        textObjects['cat_n_' + cat.cid].position.y = 10;

      }
      */
  });


  nodes.forEach(function(node, i) {
    state.nodes.push({
      nid: i,
      foci: catFoci[depts[node.did].cat.cid],
      color: hexToRgbArray(depts[node.did].cat.color)
    });
  });

  return state;
}();


states.deptByCatHeaders = extend({},states.deptByCat);
states.deptByCatHeaders.text = states.deptByCatHeaders.text.slice(0);

states.catTotals.text.forEach(function(txt){
  if (txt.substring(0,5) === 'cat_n') states.deptByCatHeaders.text.push(txt);
});



module.exports = states;
