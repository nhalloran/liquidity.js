var extend = require('./neilviz/util/extend');
var RevealMap = require('./neilviz/RevealMap');
var layoutStates = require('./layoutStates');
var model = require('./model');

var circPScale = 0.245;
var resourceNetworkScale = 0.1;


var params = {
    lowestPrice: {
        x: 404,
        y: -115,
        width: 119, //2800X3155
        height: 119,
        mapUrl: '/textures/drawing-lowestPrice-fill-512.png',
        revealMapUrl: '/textures/drawing-lowestPrice-reveal-512.png',
    },
    rfp: {
        x: 180,
        y: -260,
        width: 120, //2800X3155
        height: 120,
        mapUrl: '/textures/drawing-rfp-fill-512.png',
        revealMapUrl: '/textures/drawing-rfp-reveal-256.png',
    },
    bidders: {
        x: 180,
        y: -410,
        width: 2838 * 0.1, //2800X3155
        height: 1962 * 0.1,
        mapUrl: '/textures/drawing-bidders-fill-512.png',
        revealMapUrl: '/textures/drawing-bidders-reveal-256.png',
    },
    winnerCircle: {
        x: 294,
        y: -435,
        width: 140, //2800X3155
        height: 140,
        mapUrl: '/textures/drawing-circle-bigGreen-fill.png',
        revealMapUrl: '/textures/drawing-circle-bigGreen-reveal.png',
    },
    bulbs: {
        x: 190,
        y: -380,
        width: 3657 * 0.1, //2800X3155
        height: 944 * 0.1,
        mapUrl: '/textures/drawing-bulbs-fill.png',
        revealMapUrl: '/textures/drawing-bulbs-reveal.png',
    },
    curses: {
        x: 200,
        y: -320,
        width: 3316 * 0.124, //2800X3155
        height: 1746 * 0.124,
        mapUrl: '/textures/drawing-curses-fill.png',
        revealMapUrl: '/textures/drawing-curses-reveal.png',
    },
    dothis: {
        x: 179,
        y: -263,
        width: 818 * 0.07, //2800X3155
        height: 923 * 0.07,
        mapUrl: '/textures/drawing-dothis-fill.png',
        revealMapUrl: '/textures/drawing-dothis-reveal.png',
    },
    moneyArms: {
        x: 147,
        y: -440,
        width: 2455 * resourceNetworkScale * 1.05, //2800X3155
        height: 681 * resourceNetworkScale * 1.05,
        mapUrl: '/textures/drawing-money-arms-fill.png',
        revealMapUrl: '/textures/drawing-money-arms-reveal.png',
    },
    moneyBills: {
        x: 130,
        y: -431,
        width: 2265 * resourceNetworkScale, //2800X3155
        height: 534 * resourceNetworkScale,
        mapUrl: '/textures/drawing-money-bills-fill.png',
        revealMapUrl: '/textures/drawing-money-bills-reveal.png',
    },
    network: {
        x: 384,
        y: -440,
        width: 1596 * resourceNetworkScale * 1.05, //2800X3155
        height: 928 * resourceNetworkScale * 1.05,
        mapUrl: '/textures/drawing-network-fill.png',
        revealMapUrl: '/textures/drawing-network-reveal.png',
    },
    circleP1: {
        x: 0,
        y: 10,
        width: 716 * circPScale, //2800X3155
        height: 751 * circPScale,
        mapUrl: '/textures/draw-circle-p1-fill.png',
        revealMapUrl: '/textures/draw-circle-p1-reveal.png',
        color: 0xff0000
    },
    circleP2: {
        x: 0,
        y: 0,
        width: 655 * circPScale, //2800X3155
        height: 596 * circPScale,
        mapUrl: '/textures/draw-circle-p2-fill.png',
        revealMapUrl: '/textures/draw-circle-p2-reveal.png',
        color: 0xff0000
    },
    circleP3: {
        x: 0,
        y: 0,
        width: 357 * circPScale, //2800X3155
        height: 331 * circPScale,
        mapUrl: '/textures/draw-circle-p3-fill.png',
        revealMapUrl: '/textures/draw-circle-p3-reveal.png',
        color: 0xff0000
    },
    circleP4: {
        x: 0,
        y: 0,
        width: 320 * circPScale, //2800X3155
        height: 268 * circPScale,
        mapUrl: '/textures/draw-circle-p4-fill.png',
        revealMapUrl: '/textures/draw-circle-p4-reveal.png',
        color: 0xff0000
    },
    circleS1: {
        x: 0,
        y: 0,
        width: 631 * circPScale, //2800X3155
        height: 567 * circPScale,
        mapUrl: '/textures/draw-circle-s1-fill.png',
        revealMapUrl: '/textures/draw-circle-s1-reveal.png',
        color: 0xff0000
    },
    circleS2: {
        x: 0,
        y: 0,
        width: 427 * circPScale, //2800X3155
        height: 389 * circPScale,
        mapUrl: '/textures/draw-circle-s2-fill.png',
        revealMapUrl: '/textures/draw-circle-s2-reveal.png',
        color: 0xff0000
    },
    circleS3: {
        x: 0,
        y: 0,
        width: 386 * circPScale, //2800X3155
        height: 350 * circPScale,
        mapUrl: '/textures/draw-circle-s3-fill.png',
        revealMapUrl: '/textures/draw-circle-s3-reveal.png',
        color: 0xff0000
    },
    circleS4: {
        x: 0,
        y: 0,
        width: 245 * circPScale, //2800X3155
        height: 205 * circPScale,
        mapUrl: '/textures/draw-circle-s4-fill.png',
        revealMapUrl: '/textures/draw-circle-s4-reveal.png',
        color: 0xff0000
    },
    circleS5: {
        x: 0,
        y: 0,
        width: 161 * circPScale, //2800X3155
        height: 170 * circPScale,
        mapUrl: '/textures/draw-circle-s5-fill.png',
        revealMapUrl: '/textures/draw-circle-s5-reveal.png',
        color: 0xff0000
    },
    circleS6: {
        x: 0,
        y: 0,
        width: 186 * circPScale, //2800X3155
        height: 174 * circPScale,
        mapUrl: '/textures/draw-circle-s6-fill.png',
        revealMapUrl: '/textures/draw-circle-s6-reveal.png',
        color: 0xff0000
    },
};

var keys = Object.keys(params);
var objects = {};



var makeObjects = function(textures) {
  // called after



    keys.forEach(function(key) {
        var p = extend({
                  maxAlpha: 0.9,
                  epsilon: 0.005
                },params[key]);
        p.map =  textures['reveal_' + key + '_fill'];
        p.revealMap =  textures['reveal_' + key + '_reveal'];
        objects[key] = new RevealMap(p);
        objects[key].material.uniforms.revealed.value = 0;


    });


    var genCatCirc = function(filterField){
      var cn = 1;
      return function(foci) {
        var dept = model.depts[foci.did];
        if (dept[filterField]) {
            var circle = objects['circle' + filterField.toUpperCase() + cn];
            circle.position.x += foci.x;
            circle.position.y += foci.y;
            circle.updateMatrix();
            cn++;
        }
      };
    };
    layoutStates.deptByCat.focis.forEach(genCatCirc('p'));
    layoutStates.deptByCat.focis.forEach(genCatCirc('s'));


    return objects;


};


module.exports = {
    params: params,
    makeObjects: makeObjects

};
