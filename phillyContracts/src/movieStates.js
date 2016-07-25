var extend = require('./neilviz/util/extend');
var model = require('./model');
var layoutStates = require('./layoutStates');





var statesArray = [{
        id: 'initial',
        layout: 0,
        layoutPop: 0,
        camX: 0,
        camY: 0,
        camZ: 100,
        revOpacity: 1,
        popOpacity: 0,
        camRotX: 0,
        reflect: 0.7,
        reflectPhoto:0,
        lightI: 1,
        highlightPoverty: 0,
        highlightEpsilon: 1,
        revealPCircles: 0,
        revealSCircles: 0,
        revealLowestPrice:0,
        revealRfp: 0,
        revealBidders:0,
        revealWinner: 0,
        revealBulbs: 0,
        revealCurses: 0,
        revealDothis:0,
        revealResourcesNetwork:0

    },
    {
        id: 'initialPullback',
        camZ: layoutStates.wholeCity.camPos.z + 50,
        layout: 1,
        reflect: 0.2

    },
    {
        id: 'splitToDepts',
        reflect: 0.07,
        layout: 2,
        camX: layoutStates.deptByCat.camPos.x,
        camY: layoutStates.deptByCat.camPos.y,
        camZ: layoutStates.deptByCat.camPos.z,


    }, {
        id: 'groupByCats',
        camY: layoutStates.catTotals.camPos.y,
        layout: 3,
    }, {
        id: 'backToDepts',
        layout: 4,
        camZ: 700,
        camY: -300,
        //camRotX: -0.3,
    }, {
        id: 'povertyExamples',
        camX: -120,
        camY: 40,
        camZ: 400,
        lightI: 0.7,
        highlightPoverty: 1,
        highlightEpsilon: 0.2,
        revealPCircles: 1

    }, {
        id: 'preSecurity',
        lightI: 1,
        highlightPoverty: 0,
        revealPCircles: 2,
        highlightEpsilon: 1
    }, {
        id: 'securityExamples',
        camX: -180,
        camZ: 500,
        camY: -15,
        lightI: 0.7,
        revealSCircles: 1,
        highlightSecurity: 1,
        highlightEpsilon: 0.2

    }, {
        id: 'colorContracts',
      //  camX: 0,
        camY: -20,
        camZ: 450,
        layout: 5,
        lightI: 1,
        revealSCircles: 2,
        highlightSecurity: 0,

    }, {
        id: 'colorContractsDown',
        camX: 100,
        camY: -250,
        camZ: 350,
    }, {
        id: 'colorContractsBack',
        camX: 0,
        camY: -20,
        camZ: 450,
    }, {
        id: 'behavioralHealth',
        camX: -220,
        camY: 200,
        camZ: 240,
        layout: 6,
        reflect:0,



    }, {
    }, {
        id: 'behavioralHealthPhoto',
        reflectPhoto:1,
        camX: -240,
        camY: 240,
        camZ: 120,
        layout: 7,
        reflect:0.8,


    }, {
        id: 'contractNonContract',
        camX: 0,
        camY: -20,
        camZ: 450,
        layout: 8,
        reflect: 0,



    }, {
        id: 'contractsImportant',
        camZ: 370,
        reflectPhoto:2,
        reflect: 0.07,

    }, {
        id: 'procurement',
        camZ: 300,
        camX: 270,
        layout: 9,
        reflect: 0,


      }, {
          id: 'procurementPhoto',
          camX: 380,
          camZ: 118,
          camY: 0,
          reflect: 0.8,
          reflectPhoto:3,
      }, {
          id: 'procurementDrawing',
          camX: 380,
          camY: -70,
          camZ: 170,
          revealLowestPrice:1,
          reflect: 0,





    }, {
        id: 'profServices',
        camZ: 180,
        camX: 200,
        camY: -20,
        reflect: 0.8,
        reflectPhoto:4,
        layout: 10,


  }, {
      id: 'rfpReveal',
      camY: -260,
      revealRfp:1,
      revOpacity: 0,

  }, {
      id: 'rfpBidders',
      camX: 200,
      camY: -340,
      camZ: 270,
      revealBidders:1,
      revealWinner:1
  }, {
      id: 'bulbs',
      revealWinner:2,
      revealBulbs:1,
  }, {
      id: 'curses',
      revealCurses: 1,
      revealBulbs:2,
  }, {
      id: 'prescriptive',
      camX: 170,
      camY: -260,
      camZ: 130,
      revealCurses: 2,
      revealRfp:0.4,
      revealDothis:1
  }, {
      id: 'resources',
      camX: 200,
      camY: -400,
      camZ: 190,
      revealResourcesNetwork:1
  }, {
      id: 'network',
      camX: 240,
      camY: -360,
      camZ: 240,
  }, {
      id: 'popTotal',
      popOpacity: 1,
      camY: -780,
  }, {
      id: 'popByRace',
      layoutPop: 1,
      camZ: 500,
  }, {
      id: 'popByRaceGender',
      layoutPop: 2,
      camZ: 500,
  },
];


var states = {};
var state = {};


for (var i = 0; i < statesArray.length; i++) {
    var id = statesArray[i].id;
    statesArray[i].prevId = statesArray[Math.max(0, i - 1)].id;
    extend(state, statesArray[i]); //first arg means deep
    states[id] = extend({}, state); //deep clone

}



module.exports = states;
