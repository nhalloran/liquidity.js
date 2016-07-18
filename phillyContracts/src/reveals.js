var RevealMap = require('./neilviz/RevealMap');


var params = {
    lowestPrice: {
        x: 530,
        y: -20,
        width: 120, //2800X3155
        height: 120,
        mapUrl: '/textures/drawing-lowestPrice-fill-512.png',
        revealMapUrl: '/textures/drawing-lowestPrice-reveal-512.png',
        maxAlpha: 0.9,
        epsilon: 0.005
    },
    rfp: {
        x: 180,
        y: -260,
        width: 120, //2800X3155
        height: 120,
        mapUrl: '/textures/drawing-rfp-fill-512.png',
        revealMapUrl: '/textures/drawing-rfp-reveal-256.png',
        maxAlpha: 0.9,
        epsilon: 0.005
    },
};

var keys = Object.keys(params);
var objects = {};



var makeObjects = function(textures) {
  // called after



    keys.forEach(function(key) {
        var p = params[key];
        p.map =  textures['reveal_' + key + '_fill'];
        p.revealMap =  textures['reveal_' + key + '_reveal'];
        objects[key] = new RevealMap(p);
        objects[key].material.uniforms.revealed.value = 0;


    });

    return objects;


};


module.exports = {
    params: params,
    makeObjects: makeObjects

};
