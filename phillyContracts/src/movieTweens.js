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
      POVERTY_DUR = 8000,
      PRE_SECURITY_DUR = 900,
      SECURITY_START= POVERTY_START + POVERTY_DUR + PRE_SECURITY_DUR,
      SECURITY_DUR = 8000,
      COLOR_CONTRACTS_START = SECURITY_START + SECURITY_DUR,
      COLOR_CONTRACTS_DUR = 28000,
      BEHAVIORAL_HEALTH_START = COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR,
      BEHAVIORAL_HEALTH_DUR = 14000,
      CONSTRACT_NONCONTRACT_START = BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR,
      CONSTRACT_NONCONTRACT_DUR = 8000,
      CONTRACTS_IMPORTANT_START = CONSTRACT_NONCONTRACT_START + CONSTRACT_NONCONTRACT_DUR,
      CONTRACTS_IMPORTANT_DUR = 20000,
      PROCUREMENT_START = CONTRACTS_IMPORTANT_START + CONTRACTS_IMPORTANT_DUR,
      PROCUREMENT_DUR = 14000,
      PROFESSIONAL_START = PROCUREMENT_START + PROCUREMENT_DUR,
      PROFESSIONAL_DUR = 7000,
      RFP_REVEAL_START = PROFESSIONAL_START + PROFESSIONAL_DUR,
      RFP_REVEAL_DUR = 7000,
      DUMMYVAR = 0;


  var tweens = [

    //time tween
    simpleTween(states.initialPullback,'camZ',INITIAL_PULLBACK_DUR).easing(InOut),
    simpleTween(states.initialPullback, 'layout', 2000)
      .delay(START + INITIAL_PULLBACK_DUR * 0.4),

    simpleTween(states.initialPullback,'reflect',1000)
      .delay(START + INITIAL_PULLBACK_DUR * 0.7),


    camTween(states.splitToDepts, 2000)
      .delay(SPLIT_TO_DEPTS_START).easing(InOut),
    simpleTween(states.splitToDepts, 'layout', 1000)
      .delay(SPLIT_TO_DEPTS_START + 400),

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

      camTween(states.povertyExamples, POVERTY_DUR * 0.9)
        .delay(POVERTY_START).easing(InOut),
      simpleTween(states.povertyExamples, 'lightI', 2000)
        .delay(POVERTY_START + POVERTY_DUR * 0.1),
      simpleTween(states.povertyExamples, 'highlightPoverty', 2000)
      .delay(POVERTY_START + POVERTY_DUR * 0.1),
      simpleTween(states.povertyExamples, 'highlightEpsilon', 4000)
      .delay(POVERTY_START + POVERTY_DUR * 0.1),


      camTween(states.securityExamples, PRE_SECURITY_DUR + SECURITY_DUR * 0.9)
      .delay(POVERTY_START + POVERTY_DUR).easing(InOut),

      simpleTween(states.preSecurity, 'lightI', PRE_SECURITY_DUR)
        .delay(POVERTY_START + POVERTY_DUR),
      simpleTween(states.preSecurity, 'highlightPoverty', PRE_SECURITY_DUR )
      .delay(POVERTY_START + POVERTY_DUR),
      simpleTween(states.preSecurity, 'highlightEpsilon', PRE_SECURITY_DUR)
      .delay(POVERTY_START + POVERTY_DUR),

      simpleTween(states.securityExamples, 'lightI', 800)
      .delay(SECURITY_START + SECURITY_DUR * 0.1),
      simpleTween(states.securityExamples, 'highlightSecurity', 800)
      .delay(SECURITY_START + SECURITY_DUR * 0.1),
      simpleTween(states.securityExamples, 'highlightEpsilon', 1500)
      .delay(SECURITY_START + SECURITY_DUR * 0.1),


      simpleTween(states.colorContracts, 'lightI', 400)
      .delay(COLOR_CONTRACTS_START),
      simpleTween(states.colorContracts, 'highlightSecurity', 400)
      .delay(COLOR_CONTRACTS_START),

      simpleTween(states.colorContracts, 'layout', COLOR_CONTRACTS_DUR * 0.1)
        .delay(COLOR_CONTRACTS_START),
     simpleTween(states.colorContractsDown,'camX',COLOR_CONTRACTS_DUR * 0.55).easing(InOut)
     .delay(COLOR_CONTRACTS_START),
     simpleTween(states.colorContracts,'camY',COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
     .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.1),
     simpleTween(states.colorContracts,'camZ',COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
     .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.1),
     simpleTween(states.colorContractsDown,'camY',COLOR_CONTRACTS_DUR * 0.4).easing(InOut)
     .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.3),
     simpleTween(states.colorContractsDown,'camZ',COLOR_CONTRACTS_DUR * 0.4).easing(InOut)
     .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.2),
     simpleTween(states.colorContractsBack,'camX',COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
     .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.7),
     simpleTween(states.colorContractsBack,'camY',COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
     .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.7),
     simpleTween(states.colorContractsBack,'camZ',COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
     .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.7),


     simpleTween(states.behavioralHealth, 'layout', 1000)
       .delay(BEHAVIORAL_HEALTH_START),



       simpleTween(states.behavioralHealth,'camX',BEHAVIORAL_HEALTH_DUR * 0.5).easing(InOut)
       .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0),
       simpleTween(states.behavioralHealth,'camY',BEHAVIORAL_HEALTH_DUR * 0.5).easing(InOut)
       .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0),
       simpleTween(states.behavioralHealth,'camZ',BEHAVIORAL_HEALTH_DUR * 0.4).easing(InOut)
       .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.1),

       //zoom in to photo


      camTween(states.behavioralHealthPhoto, PRE_SECURITY_DUR + SECURITY_DUR * 0.5)
      .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.5),
      simpleTween(states.behavioralHealthPhoto, 'layout', 1000)
      .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.5),

       simpleTween(states.behavioralHealthPhoto, 'reflect', BEHAVIORAL_HEALTH_DUR * 0.4)
       .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.5),




       simpleTween(states.behavioralHealth, 'reflect', CONSTRACT_NONCONTRACT_DUR * 0.5)
       .delay(CONSTRACT_NONCONTRACT_START + CONSTRACT_NONCONTRACT_DUR * 0.5),

       camTween(states.contractNonContract, 2000).easing(InOut)
       .delay(CONSTRACT_NONCONTRACT_START),

       camTween(states.contractsImportant, CONTRACTS_IMPORTANT_DUR * 0.7).easing(InOut)
       .delay(CONTRACTS_IMPORTANT_START),


         simpleTween(states.contractNonContract, 'layout', 2000)
       .delay(CONSTRACT_NONCONTRACT_START + 300),

       camTween(states.procurement, 2000).easing(InOut)
       .delay(PROCUREMENT_START),

       simpleTween(states.procurement, 'layout', 1000)
       .delay(PROCUREMENT_START),
       simpleTween(states.procurement, 'reflect', PROCUREMENT_DUR * 0.2)
       .delay(PROCUREMENT_START + PROCUREMENT_DUR * 0.5),
       simpleTween(states.procurement, 'revealLowestPrice', PROCUREMENT_DUR * 0.18)
       .delay(PROCUREMENT_START + PROCUREMENT_DUR * 0.6)
       .easing(InOut),



       simpleTween(states.profServices,'camX',PROFESSIONAL_DUR * 0.5).easing(InOut)
       .delay(PROFESSIONAL_START),
       simpleTween(states.profServices,'camY',PROFESSIONAL_DUR * 0.4).easing(InOut)
       .delay(PROFESSIONAL_START),
       simpleTween(states.profServices,'camZ',PROFESSIONAL_DUR * 0.9).easing(InOut)
       .delay(PROFESSIONAL_START),
       simpleTween(states.profServices, 'reflect', PROFESSIONAL_DUR * 0.1)
       .delay(PROFESSIONAL_START),

       //rfp
       camTween(states.rfpReveal, 1200).easing(InOut)
       .delay(RFP_REVEAL_START),
       simpleTween(states.rfpReveal, 'revealRfp', RFP_REVEAL_DUR * 0.2)
       .delay(RFP_REVEAL_START + 1000),


  //  simpleTween(states.backToDepts, 'camRotX', 8000)
  //    .delay(BACK_TO_DEPTS_START),


  ];

  return tweens;


};
