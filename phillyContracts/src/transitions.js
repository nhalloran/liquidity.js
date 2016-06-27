var TWEEN = require('tween.js');
var states = require('./states');
var mix = require('./neilviz/util/mix');


module.exports = function(params) {

    var textObjects = params.textObjects;
    var showCircles = params.showCircles;
    var nodes = params.nodes;
    var circleGeo = params.circleGeo;
    var camera = params.camera;
    var clock = params.clock;
    var force = params.force;

    var transState = {
      t: 0
    };
    var currentState = 0;
    var transTween;
    var textTweens = [];


    var textKeys = Object.keys(textObjects);


    var maybeHide = function(item) {
        //used for tween on opacity
        return function() {
            item.material.uniforms.opacity.value = this.v;
            item.visible = (this.v > 0);
        };
    };

    function transStateUpdate() {
        //TODO: add sort order to state
        var ts = this;
        var colorT = Math.max(0, ts.t * 2 - 1);
        var pCam = states[ts.prev].camPos;
        var nCam = states[ts.next].camPos;
        var camEase = TWEEN.Easing.Quadratic.InOut(ts.t);
        camera.position.set(
            mix(pCam.x, nCam.x, camEase),
            mix(pCam.y, nCam.y, camEase),
            mix(pCam.z, nCam.z, camEase)
        );

        nodes.forEach(function(node, i) {
            var pNode = states[ts.prev].nodes[i];
            var nNode = states[ts.next].nodes[i];


            node.foci = (i / nodes.length > ts.t) ? pNode.foci : nNode.foci;
            node.color.r = mix(pNode.color[0], nNode.color[0], colorT);
            node.color.g = mix(pNode.color[1], nNode.color[1], colorT);
            node.color.b = mix(pNode.color[2], nNode.color[2], colorT);
            if (showCircles)
                circleGeo.setSingleColor(i, node.color);
        });
    }

    function gotoState(sid) {
        currentState = sid;
        transState.prev = currentState; //previous state
        transState.next = currentState; // next state
        transState.t = 1;
        transStateUpdate.call(transState);
        textKeys.forEach(function(key) {
            var item = textObjects[key];
            var opacity = (states[sid].text.indexOf(key) >= 0) ? 1 : 0;
            item.material.uniforms.opacity.value = opacity;
            item.visible = (opacity > 0);
        });

    }


    function animateToState(next, prev, startTime) {

        //TODO: be more selective
        //TWEEN.removeAll();
        //transitioning from stated state, or current state
        var sState = (prev === undefined) ? transState : {};

        if (startTime === undefined) startTime = clock.getElapsedTime() * 1000;
        if (prev === undefined) prev = currentState;
        currentState = next;

        sState.t = 0;
        sState.prev = prev;
        sState.next = next;


        transTween = new TWEEN.Tween(sState)
            .onUpdate(transStateUpdate)
            //.onComplete(transStateUpdate)
            .to({
                t: 1
            }, 1200)
            .onStart(force.start)
            .start(startTime);

        var pText = (states[prev] || states.empty).text;
        var nText = (states[next] || states.empty).text;



        textKeys.forEach(function(key) {
            var item = textObjects[key];
            var nOpacity = (nText.indexOf(key) >= 0) ? 1 : 0;
            var pOpacity = (pText.indexOf(key) >= 0) ? 1 : 0;

            if (pOpacity && !nOpacity)
                textTweens.push(new TWEEN.Tween({
                    v: pOpacity
                }).to({
                    v: nOpacity
                }, 200).onUpdate(maybeHide(item)).start(startTime));
            if (!pOpacity && nOpacity)
                textTweens.push(new TWEEN.Tween({
                    v: pOpacity
                }).to({
                    v: nOpacity
                }, 500).delay(1100).onUpdate(maybeHide(item)).start(startTime));

        });


    }
    var stateIds = Object.keys(states);
    var curStateNum = 0;

    function nextState() {
        curStateNum = (curStateNum + 1) % stateIds.length;
        animateToState(stateIds[curStateNum]);

    }
    return {
      gotoState: gotoState,
      nextState: nextState,
      animateToState: animateToState
    };
};
