var TWEEN = require('tween.js');
var model = require('./model');
var states = require('./movieStates');

//var KeySpline = require('./neilviz/util/KeySpline');





module.exports = function(params) {

  var InOut = TWEEN.Easing.Quadratic.InOut;




  var updates = params.movieUpdates;

  var simpleTween = function(endState, key, duration){
    startState = states[endState.prevId];
    return new TWEEN.Tween({val:startState[key]})
    .to({val:endState[key]},duration)
    .onUpdate(updates[key]);
  };
  var camTween = function(endState, duration){
    startState = states[endState.prevId];
    return new TWEEN.Tween(startState)
    .to({camX:endState.camX,camY:endState.camY,camZ:endState.camZ},duration)
    .onUpdate(updates.cam);
  };


  //time constants
  var START = 0,
      INITIAL_PULLBACK_DUR = 8000,
      SPLIT_TO_DEPTS_START = START + INITIAL_PULLBACK_DUR,
      SPLIT_TO_DEPTS_DUR = 6000,
      GROUP_BY_CAT_START = SPLIT_TO_DEPTS_START + SPLIT_TO_DEPTS_DUR,
      GROUP_BY_CAT_DUR =  5000,
      BACK_TO_DEPTS_START = GROUP_BY_CAT_START + GROUP_BY_CAT_DUR,
      BACK_TO_DEPTS_DUR = 8000,
      POVERTY_START = BACK_TO_DEPTS_START + BACK_TO_DEPTS_DUR,
      DUMMYVAR = 0;


  var tweens = [

    //time tween
    simpleTween(states.initialPullback,'camZ',INITIAL_PULLBACK_DUR + 1000).easing(InOut),
    simpleTween(states.initialPullback, 'layout', 2000)
      .delay(START + INITIAL_PULLBACK_DUR * 0.5),

    camTween(states.splitToDepts, 2000)
      .delay(SPLIT_TO_DEPTS_START + 1000).easing(InOut),
    simpleTween(states.splitToDepts, 'layout', 2000)
      .delay(SPLIT_TO_DEPTS_START),

    simpleTween(states.groupByCats, 'layout', 2000)
      .delay(GROUP_BY_CAT_START),
    camTween(states.groupByCats, GROUP_BY_CAT_DUR * 0.9)
        .delay(GROUP_BY_CAT_START).easing(InOut),

    simpleTween(states.backToDepts, 'layout', 2000)
      .delay(BACK_TO_DEPTS_START),

    simpleTween(states.backToDepts, 'camZ', BACK_TO_DEPTS_DUR * 0.7)
      .delay(BACK_TO_DEPTS_START).easing(InOut),
    simpleTween(states.backToDepts, 'camY', BACK_TO_DEPTS_DUR * 0.8)
      .delay(BACK_TO_DEPTS_START).easing(InOut),

      camTween(states.povertyExamples, 2000)
        .delay(POVERTY_START).easing(InOut),

  //  simpleTween(states.backToDepts, 'camRotX', 8000)
  //    .delay(BACK_TO_DEPTS_START),


  ];

  return tweens;


};
