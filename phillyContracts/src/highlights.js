var THREE = require('three');
var CircleMaterial = require('./neilviz/CircleMaterial');
var layoutStates = require('./layoutStates');
var model = require('./model');

var states = {};

var highlights = new THREE.Object3D();
highlights.circles = [];

var makeState = function(filterField) {
    var state = {
        reveal: 0,
        circles: []
    };

    layoutStates.deptByCat.focis.forEach(function(foci) {
        var dept = model.depts[foci.did];
        if (dept[filterField]) {
            var radius = model.radius(dept.t) + 30;
            var geo = new THREE.PlaneBufferGeometry(radius * 2, radius * 2);
            var mat = new CircleMaterial({ epsilon: 0.15 });
            var circle = new THREE.Mesh(geo, mat);
            circle.position.x = foci.x;
            circle.position.y = foci.y;
            highlights.add(circle);
            state.circles.push(circle);
            highlights.circles.push(circle);
        }
    });


    return state;

};


states.poverty = makeState('p');
states.security = makeState('s');

var stateKeys = Object.keys(states);
highlights.update = function() {
    stateKeys.forEach(function(key) {
        var state = states[key];
        state.circles.forEach(function(circle) {
            circle.material.uniforms.opacity.value = state.reveal * 0.8;
            circle.visible = (state.reveal > 0);
        });
    });
};



highlights.states = states;
highlights.update();

module.exports = highlights;
