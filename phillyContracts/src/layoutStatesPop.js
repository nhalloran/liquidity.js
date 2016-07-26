var config = require('./config');
var model = require('./model');
var extend = require('./neilviz/util/extend');

var radiusSquared = model.radiusSquared;
var radiusSquaredPop = model.radiusSquaredPop;
var radius = model.radius;


var catsById = model.catsById;
var depts = model.depts;
var cats = model.cats;
var dotValue = model.dotValue;
var totalDots = model.totalDots;
var nodes = model.nodes;
var popNodes = model.popNodes;

//TODO: move to util file
function hexToRgbArray(hex) {
    hex = Math.floor(hex);

    return [
        (hex >> 16 & 255) / 255,
        (hex >> 8 & 255) / 255,
        (hex & 255) / 255
    ];

}


//layout states fro the population


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
        x: config.popDotsPos[0],
        y: config.popDotsPos[1],
        //distSq: radiusSquared(model.totalBudget), // uses rev as
        distSq: radiusSquaredPop(100), // uses rev as
        reflect: 1
    };

    var state = {
        focis: [foci],
        nodes: [],
        text: [],
        camPos: {
            x: 0,
            y: 0,
            z: 300
        },
    };

    popNodes.forEach(function(node, i) {
        state.nodes.push({
            foci: foci,
            nid: i,
            color: hexToRgbArray(0x333333)
        });
    });

    return state;

}();


states.byRace = function() {

    // state

    var x = -300;
    var r = 0, prevR = 0;
    var focisById = {};

    var focis = model.phillyRaces.map(function(race,i){
        r = Math.sqrt(radiusSquaredPop(race.p));
        x += r + prevR + 40;
        prevR = r;
        return {
          x: x,
          y: 0,
          //distSq: radiusSquared(model.totalBudget), // uses rev as
          distSq: radiusSquaredPop(race.p), // uses rev as
          reflect: 1,
          rid: i,
          pop: race.p
        };
    });

    var state = {
        focis: focis,
        nodes: [],
        text: model.phillyRaces.map(function(race){return 'race_' + race.id;}),
    };

    popNodes.forEach(function(node, i) {
        state.nodes.push({
            foci: focis[node.rid],
            nid: i,
            color: hexToRgbArray(0x333333)
        });
    });

    return state;

}();

// race and gender

states.byRaceGender = function() {

  var focis = [];
  var focisById = {};

  states.byRace.focis.forEach(function(foci,i){
    var female = extend({},foci,{distSq: foci.distSq/2, pop: foci.pop/2});
    var male = extend({},foci,{y:foci.y + 180, distSq: foci.distSq/2, pop: foci.pop/2});
    focis.push(female);
    focis.push(male);
    focisById['m' + i] = male;
    focisById['f' + i] = female;
  });

  var text = states.byRace.text.slice(0);
  text.push('male');
  text.push('female');
  var state = {
      focis: focis,
      focisById: focisById,
      nodes: [],
      text: text,
  };

  popNodes.forEach(function(node, i) {
      state.nodes.push({
          foci: focisById[node.gender + node.rid],
          nid: i,
          color: hexToRgbArray(0x333333)
      });
  });

  return state;


}();

states.whiteMale = function() {

  var focis = [];
  var m0 = states.byRaceGender.focisById.m0;

  var nonFoci = extend({}, m0, {
    pop: 100-m0.pop,
    distSq: radiusSquaredPop( 100-m0.pop),
    x: m0.x + 250
  });

  var nodes = states.byRaceGender.nodes.map(function(node){
      if (node.foci === m0) return node;
      return extend({},node,{foci:nonFoci});
  });


  return {
      focis: focis,
      nodes: nodes,
      text: [],
  };

}();








module.exports = states;
