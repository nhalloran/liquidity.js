var extend = require('./neilviz/util/extend');
var model = require('./model');
var layoutStates = require('./layoutStates');





var statesArray = [{
  id: 'initial',
  layout:0,
  camX: 0,
  camY: 0,
  camZ: 100,
},
{
  id: 'initialPullback',
  camZ:layoutStates.wholeCity.camPos.z,
  layout:1,

},
{
  id: 'splitToDepts',
  layout:2,
  camX:layoutStates.deptByCat.camPos.x,
  camY:layoutStates.deptByCat.camPos.y,
  camZ:layoutStates.deptByCat.camPos.z,


},{
  id: 'groupByCats',
  layout:3,
},{
  id: 'backToDepts',
  layout:4,
}
];


var states = {};
var state = {};


for (var i = 0; i < statesArray.length; i++) {
  var id = statesArray[i].id;
  statesArray[i].prevId =  statesArray[Math.max(0,i-1)].id;
  extend(state, statesArray[i]); //first arg means deep
  states[id] = extend({}, state); //deep clone

}



module.exports = states;
