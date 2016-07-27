var TWEEN = require('tween.js');
var model = require('./model');
var states = require('./movieStates');
var alphaTimeline = require('./alphaTimeline');


//var KeySpline = require('./neilviz/util/KeySpline');



var tweens = [];

var movieTweens = {
    update: function() {} //dummy function until init
};

movieTweens.init = function(params) {

    var InOut = TWEEN.Easing.Quadratic.InOut;
    var In = TWEEN.Easing.Quadratic.In;
    var Out = TWEEN.Easing.Quadratic.Out;




    var updates = params.movieUpdates;
    var revDots = params.revDots;
    var popDots = params.popDots;

    var simpleTween = function(endState, key, duration, override) {
        startState = states[endState.prevId];
        return new TWEEN.Tween({ val: startState[key] })
            .to({ val: endState[key] }, duration)
            .onUpdate(updates[key]);
    };
    var camTween = function(endState, duration) {
        startState = states[endState.prevId];
        return new TWEEN.Tween(startState)
            .to({ camX: endState.camX, camY: endState.camY, camZ: endState.camZ }, duration)
            .onUpdate(updates.cam);
    };



    var alphaHistory = [
        { t: 0, a: 0 }

    ];


    //below variables use timeConstants.js and webpack's DefinePlugin
    tweens = [

        //time tween
        simpleTween(states.initialPullback, 'camZ', INITIAL_PULLBACK_DUR).easing(InOut),
        simpleTween(states.initialPullback, 'layout', 2000)
        .delay(START + INITIAL_PULLBACK_DUR * 0.4),

        simpleTween(states.initialPullback, 'reflect', INITIAL_PULLBACK_DUR * 0.3)
        .delay(START + INITIAL_PULLBACK_DUR * 0.3),


        simpleTween(states.splitToDepts, 'reflect', SPLIT_TO_DEPTS_DUR * 0.6)
        .delay(SPLIT_TO_DEPTS_START),

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

        simpleTween(states.backToDepts, 'camZ', BACK_TO_DEPTS_DUR * 0.55)
        .delay(BACK_TO_DEPTS_START + BACK_TO_DEPTS_DUR * 0.4).easing(InOut),
        simpleTween(states.backToDepts, 'camY', BACK_TO_DEPTS_DUR * 0.8)
        .delay(BACK_TO_DEPTS_START).easing(InOut),

        //  camTween(states.povertyExamples, POVERTY_DUR * 0.9)
        //    .delay(POVERTY_START).easing(InOut),
        simpleTween(states.povertyExamples, 'camY', POVERTY_DUR * 0.6)
        .delay(POVERTY_START).easing(InOut),
        simpleTween(states.povertyExamples, 'camX', POVERTY_DUR * 0.9)
        .delay(POVERTY_START).easing(InOut),
        simpleTween(states.povertyExamples, 'camZ', POVERTY_DUR * 0.9)
        .delay(POVERTY_START).easing(InOut),
        //  simpleTween(states.povertyExamples, 'lightI', 2000)
        //    .delay(POVERTY_START + POVERTY_DUR * 0.1),
        //  simpleTween(states.povertyExamples, 'highlightPoverty', 2000)
        //  .delay(POVERTY_START + POVERTY_DUR * 0.1),
        //  simpleTween(states.povertyExamples, 'highlightEpsilon', 4000)
        //  .delay(POVERTY_START + POVERTY_DUR * 0.1),
        simpleTween(states.povertyExamples, 'revealPCircles', POVERTY_DUR * 0.2)
        .delay(POVERTY_START + POVERTY_DUR * 0.3),




        simpleTween(states.preSecurity, 'revealPCircles', 400)
        .delay(POVERTY_START + POVERTY_DUR),


        camTween(states.securityExamples, PRE_SECURITY_DUR + SECURITY_DUR * 0.35)
        .delay(POVERTY_START + POVERTY_DUR).easing(InOut),

        //  simpleTween(states.preSecurity, 'lightI', PRE_SECURITY_DUR)
        //    .delay(POVERTY_START + POVERTY_DUR),
        //  simpleTween(states.preSecurity, 'highlightPoverty', PRE_SECURITY_DUR )
        //  .delay(POVERTY_START + POVERTY_DUR),
        //  simpleTween(states.preSecurity, 'highlightEpsilon', PRE_SECURITY_DUR)
        //  .delay(POVERTY_START + POVERTY_DUR),

        simpleTween(states.securityExamples, 'revealSCircles', SECURITY_DUR * 0.2)
        .delay(SECURITY_START + SECURITY_DUR * 0.1),

        //  simpleTween(states.securityExamples, 'lightI', 800)
        //  .delay(SECURITY_START + SECURITY_DUR * 0.1),
        //  simpleTween(states.securityExamples, 'highlightSecurity', 800)
        //  .delay(SECURITY_START + SECURITY_DUR * 0.1),
        //  simpleTween(states.securityExamples, 'highlightEpsilon', 1500)
        //  .delay(SECURITY_START + SECURITY_DUR * 0.1),

        simpleTween(states.colorContracts, 'revealSCircles', SECURITY_DUR * 0.1)
        .delay(SECURITY_START + SECURITY_DUR * 0.8),

        //  simpleTween(states.colorContracts, 'lightI', 400)
        //  .delay(COLOR_CONTRACTS_START),
        //  simpleTween(states.colorContracts, 'highlightSecurity', 400)
        //  .delay(COLOR_CONTRACTS_START),

        simpleTween(states.colorContracts, 'layout', COLOR_CONTRACTS_DUR * 0.1)
        .delay(COLOR_CONTRACTS_START),
        simpleTween(states.colorContractsDown, 'camX', COLOR_CONTRACTS_DUR * 0.55).easing(InOut)
        .delay(COLOR_CONTRACTS_START),
        simpleTween(states.colorContracts, 'camY', COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
        .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.1),
        simpleTween(states.colorContracts, 'camZ', COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
        .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.1),

        simpleTween(states.colorContractsDown, 'camY', COLOR_CONTRACTS_DUR * 0.4).easing(InOut)
        .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.3),
        simpleTween(states.colorContractsDown, 'camZ', COLOR_CONTRACTS_DUR * 0.4).easing(InOut)
        .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.3),

        simpleTween(states.colorContractsBack, 'camX', COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
        .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.7),
        simpleTween(states.colorContractsBack, 'camY', COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
        .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.7),
        simpleTween(states.colorContractsBack, 'camZ', COLOR_CONTRACTS_DUR * 0.2).easing(InOut)
        .delay(COLOR_CONTRACTS_START + COLOR_CONTRACTS_DUR * 0.7),


        simpleTween(states.behavioralHealth, 'layout', 1000)
        .delay(BEHAVIORAL_HEALTH_START),



        simpleTween(states.behavioralHealth, 'camX', BEHAVIORAL_HEALTH_DUR * 0.5).easing(InOut)
        .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0),
        simpleTween(states.behavioralHealth, 'camY', BEHAVIORAL_HEALTH_DUR * 0.5).easing(InOut)
        .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0),
        simpleTween(states.behavioralHealth, 'camZ', BEHAVIORAL_HEALTH_DUR * 0.4).easing(InOut)
        .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.1),

        //zoom in to photo


        camTween(states.behavioralHealthPhoto, PRE_SECURITY_DUR + SECURITY_DUR * 0.5).easing(InOut)
        .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.5),
        simpleTween(states.behavioralHealthPhoto, 'layout', 1000)
        .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.5),

        //fade to zero reflection fure photo flip
        simpleTween(states.behavioralHealth, 'reflect', 400)
        .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.5 - 400),
        simpleTween(states.behavioralHealthPhoto, 'reflectPhoto', 0)
        .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.5),
        simpleTween(states.behavioralHealthPhoto, 'reflect', BEHAVIORAL_HEALTH_DUR * 0.4)
        .delay(BEHAVIORAL_HEALTH_START + BEHAVIORAL_HEALTH_DUR * 0.5),




        simpleTween(states.contractNonContract, 'reflect', CONSTRACT_NONCONTRACT_DUR)
        .delay(CONSTRACT_NONCONTRACT_START),

        camTween(states.contractNonContract, 2000).easing(InOut)
        .delay(CONSTRACT_NONCONTRACT_START),

        simpleTween(states.contractsImportant, 'reflectPhoto', 0)
        .delay(CONTRACTS_IMPORTANT_START),
        simpleTween(states.contractsImportant, 'reflect', CONTRACTS_IMPORTANT_DUR * 0.4)
        .delay(CONTRACTS_IMPORTANT_START),
        camTween(states.contractsImportant, CONTRACTS_IMPORTANT_DUR * 0.7).easing(InOut)
        .delay(CONTRACTS_IMPORTANT_START),


        simpleTween(states.contractNonContract, 'layout', 2000)
        .delay(CONSTRACT_NONCONTRACT_START + 300),

        camTween(states.procurement, 2000).easing(InOut)
        .delay(PROCUREMENT_START),

        simpleTween(states.procurement, 'layout', 1000)
        .delay(PROCUREMENT_START),
        simpleTween(states.procurement, 'reflect', 290)
        .delay(PROCUREMENT_START - 300),
        //rfp
        camTween(states.procurementPhoto, PROCUREMENT_DUR * 0.5 - 2500).easing(InOut)
        .delay(PROCUREMENT_START + 2500),
        simpleTween(states.procurementPhoto, 'reflectPhoto', 0)
        .delay(PROCUREMENT_START),
        simpleTween(states.procurementPhoto, 'reflect', PROCUREMENT_DUR * 0.2)
        .delay(PROCUREMENT_START + PROCUREMENT_DUR * 0.1),
        camTween(states.procurementDrawing, PROCUREMENT_DUR * 0.1).easing(InOut)
        .delay(PROCUREMENT_START + PROCUREMENT_DUR * 0.6),
        simpleTween(states.procurementDrawing, 'revealLowestPrice', PROCUREMENT_DUR * 0.18)
        .delay(PROCUREMENT_START + PROCUREMENT_DUR * 0.65)
        .easing(InOut),


        simpleTween(states.profServices, 'revealLowestPrice', 600)
        .delay(PROFESSIONAL_START + PROFESSIONAL_DUR * 0.1),
        simpleTween(states.profServices, 'camX', PROFESSIONAL_DUR * 0.5).easing(InOut)
        .delay(PROFESSIONAL_START),
        simpleTween(states.profServices, 'camY', PROFESSIONAL_DUR * 0.4).easing(InOut)
        .delay(PROFESSIONAL_START),
        simpleTween(states.profServices, 'camZ', PROFESSIONAL_DUR * 0.9).easing(InOut)
        .delay(PROFESSIONAL_START),
        simpleTween(states.procurementDrawing, 'reflect', PROFESSIONAL_DUR * 0.2)
        .delay(PROFESSIONAL_START),
        simpleTween(states.profServices, 'reflectPhoto', 0)
        .delay(PROFESSIONAL_START + PROFESSIONAL_DUR * 0.2),
        simpleTween(states.profServices, 'layout', PROFESSIONAL_DUR * 0.4)
        .delay(PROFESSIONAL_START + PROFESSIONAL_DUR * 0.1),
        simpleTween(states.profServices, 'reflect', PROFESSIONAL_DUR * 0.8)
        .delay(PROFESSIONAL_START + PROFESSIONAL_DUR * 0.2),

        //rfp
        camTween(states.rfpReveal, 1200).easing(InOut)
        .delay(RFP_REVEAL_START),
        simpleTween(states.rfpReveal, 'revealRfp', RFP_REVEAL_DUR * 0.15)
        .delay(RFP_REVEAL_START + 1000),
        simpleTween(states.rfpReveal, 'revOpacity', 0)
        .delay(RFP_REVEAL_START + 1000 + RFP_REVEAL_DUR * 0.15),

        //rfp
        camTween(states.rfpBidders, 1200).easing(InOut)
        .delay(RFP_REVEAL_START + RFP_REVEAL_DUR * 0.26),
        simpleTween(states.rfpBidders, 'revealBidders', RFP_REVEAL_DUR * 0.2)
        .delay(RFP_REVEAL_START + RFP_REVEAL_DUR * 0.29),
        simpleTween(states.rfpBidders, 'revealWinner', RFP_REVEAL_DUR * 0.05)
        .delay(RFP_REVEAL_START + RFP_REVEAL_DUR * 0.51).easing(In),

        simpleTween(states.bulbs, 'revealWinner', RFP_REVEAL_DUR * 0.1)
        .delay(RFP_REVEAL_START + RFP_REVEAL_DUR * 0.75).easing(In),

        //light bulbs


        simpleTween(states.bulbs, 'revealBulbs', BULBS_DUR * 0.5)
        .delay(BULBS_START + BULBS_DUR * 0.1),
        //curses

        simpleTween(states.curses, 'revealBulbs', CURSES_DUR * 0.05)
        .delay(CURSES_START),
        simpleTween(states.curses, 'revealCurses', CURSES_DUR * 0.2)
        .delay(CURSES_START + CURSES_DUR * 0.2),

        //prescriptive

        camTween(states.prescriptive, PRESCRIPT_DUR * 0.6).easing(InOut)
        .delay(PRESCRIPT_START),
        simpleTween(states.prescriptive, 'revealCurses', 400)
        .delay(PRESCRIPT_START),
        simpleTween(states.prescriptive, 'revealRfp', PRESCRIPT_DUR * 0.1)
        .delay(PRESCRIPT_START + PRESCRIPT_DUR * 0.3),

        simpleTween(states.prescriptive, 'revealDothis', PRESCRIPT_DUR * 0.1)
        .delay(PRESCRIPT_START + PRESCRIPT_DUR * 0.47),

        // Resources & network
        camTween(states.resources, RESOURSES_DUR * 0.2).easing(InOut)
        .delay(RESOURSES_START),

        simpleTween(states.resources, 'revealResourcesNetwork', RESOURSES_DUR * 0.6)
        .delay(RESOURSES_START + RESOURSES_DUR * 0.2),

        // Resources & network
        camTween(states.network, RESOURSES_DUR * 0.22).easing(InOut)
        .delay(RESOURSES_START + RESOURSES_DUR * 0.5),

        simpleTween(states.popTotal, 'popOpacity', 0)
        .delay(POP_TOTAL_START),
        simpleTween(states.popTotal, 'reflect', 0)
        .delay(POP_TOTAL_START),
        simpleTween(states.popTotal, 'reflectPhoto', 0)
        .delay(POP_TOTAL_START),

        simpleTween(states.popTotal, 'revealResourcesNetwork', 0)
        .delay(POP_TOTAL_START + POP_TOTAL_DUR * 0.7),
        simpleTween(states.popTotal, 'revealRfp', 0)
        .delay(POP_TOTAL_START + POP_TOTAL_DUR * 0.7),
        simpleTween(states.popTotal, 'revealBidders', 0)
        .delay(POP_TOTAL_START + POP_TOTAL_DUR * 0.7),
        simpleTween(states.popTotal, 'revealDothis', 0)
        .delay(POP_TOTAL_START + POP_TOTAL_DUR * 0.7),



        camTween(states.popTotal, POP_TOTAL_DUR * 0.7).easing(InOut)
        .delay(POP_TOTAL_START),

        camTween(states.popByRace, POP_RACE_DUR * 0.3).easing(InOut)
        .delay(POP_RACE_START),

        simpleTween(states.popByRace, 'layoutPop', POP_RACE_DUR * 0.3)
        .delay(POP_RACE_START),


        simpleTween(states.popByRaceGender, 'layoutPop', POP_GENDER_DUR * 0.3)
        .delay(POP_GENDER_START),
        camTween(states.popByRaceGender, POP_GENDER_DUR * 0.2).easing(InOut)
        .delay(POP_GENDER_START),


        simpleTween(states.whiteMale, 'layoutPop', POP_WHITE_MALE_DUR * 0.3)
        .delay(POP_WHITE_MALE_START),
        camTween(states.whiteMale, POP_WHITE_MALE_DUR * 0.2).easing(InOut)
        .delay(POP_WHITE_MALE_START),




        camTween(states.backToRev, REV_WHITE_MALE_DUR * 0.15).easing(InOut)
        .delay(REV_WHITE_MALE_START),
        camTween(states.whiteMaleRev, REV_WHITE_MALE_DUR * 0.3).easing(InOut)
        .delay(REV_WHITE_MALE_START + REV_WHITE_MALE_DUR * 0.3),

        simpleTween(states.backToRev, 'revOpacity', 0)
        .delay(REV_WHITE_MALE_START),
        //simpleTween(states.backToRev, 'layout', 500)
        //.delay(REV_WHITE_MALE_START + REV_WHITE_MALE_DUR * 0.4),
        simpleTween(states.whiteMaleRev, 'layout', 1000)
        .delay(REV_WHITE_MALE_START + REV_WHITE_MALE_DUR * 0.4) ,

        simpleTween(states.cityGoal, 'revealDashedCircle', 1000)
        .delay(CITY_GOAL_START) ,

        simpleTween(states.cityGoal, 'layout', 200)
        .delay(CITY_GOAL_START + 1000 + 1000) ,

        simpleTween(states.cityGoalBack, 'layout', 200)
        .delay(CITY_GOAL_START + CITY_GOAL_DUR * 0.9) ,
        simpleTween(states.cityGoalBack, 'revealDashedCircle', 500)
        .delay(CITY_GOAL_START + CITY_GOAL_DUR * 0.9) ,

        //closing
        simpleTween(states.closingDepts, 'layout', CLOSING_DEPTS_DUR * 0.3)
        .delay(CLOSING_DEPTS_START) ,
        camTween(states.closingDepts, CLOSING_DEPTS_DUR * 0.6)
        .delay(CLOSING_DEPTS_START) ,
        simpleTween(states.closingDepts, 'reflect', 500)
        .delay(CLOSING_DEPTS_START + CLOSING_DEPTS_DUR * 0.6) ,
        simpleTween(states.closingWhole, 'reflectPhoto', 0)
        .delay(CLOSING_DEPTS_START + CLOSING_DEPTS_DUR * 0.6 + 500) ,
        simpleTween(states.closingWhole, 'reflect', 500)
        .delay(CLOSING_DEPTS_START + CLOSING_DEPTS_DUR * 0.6 + 500) ,

        simpleTween(states.closingWhole, 'layout', CLOSING_WHOLE_DUR * 0.5)
        .delay(CLOSING_WHOLE_START) ,
        camTween(states.closingWhole, CLOSING_WHOLE_DUR)
        .delay(CLOSING_WHOLE_START) ,






        //  simpleTween(states.backToDepts, 'camRotX', 8000)
        //    .delay(BACK_TO_DEPTS_START),


    ];


    tweens.forEach(function(tween) {
        tween.start(0);
    });

    movieTweens.update = function(time) {

        //move to tweens
        var alpha = alphaTimeline.getAlpha(time * 1000);
        if(revDots.visible){
          revDots.force.alpha(alpha);
          revDots.force.tick();
        }

        if(popDots.visible){
          popDots.force.alpha(0.05);
          popDots.force.tick();
        }


        TWEEN.update(time * 1000);


    };


};



module.exports = movieTweens;
