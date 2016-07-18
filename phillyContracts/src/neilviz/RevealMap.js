var THREE = require('three');
var extend = require('./util/extend');
var deepExtend = require('./util/deepExtend');


var RevealMap = function(params) {


    var material = new THREE.ShaderMaterial({

        uniforms: (params.map) ?
            deepExtend({}, RevealMapShader.uniformsWithMap) :
            deepExtend({}, RevealMapShader.uniforms),
        vertexShader: RevealMapShader.vertexShader,
        fragmentShader: (params.map) ?
            RevealMapShader.fragmentShaderWithMap :
            RevealMapShader.fragmentShader,
        depthTest: false,
        transparent: true
    });

    material.uniforms.revealMap.value = params.revealMap;
    if (params.map) material.uniforms.map.value = params.map;
    if (params.epsilon) material.uniforms.epsilon.value = params.epsilon;



    THREE.Mesh.call(this,
        new THREE.PlaneBufferGeometry(params.width, params.height),
        material
    );

    this.matrixAutoUpdate = false;
    this.position.set(params.x ||0, params.y || 0, params.z || 0);

    this.updateMatrix();


};

RevealMap.prototype = Object.create(THREE.Mesh.prototype);

var RevealMapShader = {

    uniforms: {


        "revealMap": {
            type: "t",
            value: null
        },
        "epsilon": {
            type: "f",
            value: 0.03
        },
        "revealed": {
            type: "f",
            value: 1
        },
        "opacity": {
            type: "f",
            value: 1
        }

    },

    uniformsWithMap: {

        "map": {
            type: "t",
            value: null
        },
        "revealMap": {
            type: "t",
            value: null
        },
        "epsilon": {
            type: "f",
            value: 0.03
        },
        "revealed": {
            type: "f",
            value: 1
        },
        "opacity": {
            type: "f",
            value: 1
        }

    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join("\n"),

    fragmentShader: [

        //"uniform sampler2D map;",
        "uniform sampler2D revealMap;",
        "uniform float epsilon;",
        "uniform float revealed;",
        "uniform float opacity;",

        "varying vec2 vUv;",


        "void main() {",

        "vec4 reveal = texture2D(revealMap,  vUv);",
        "vec4 rgba = vec4(1.0,1.0,1.0,reveal.a);",

        "rgba.a *=  opacity * smoothstep(1.0 - revealed - epsilon, 1.0 - revealed + epsilon, (reveal.r + reveal.g + reveal.b)/3.0);",


        "gl_FragColor = rgba;",

        "}"

    ].join("\n"),

    fragmentShaderWithMap: [

        "uniform sampler2D map;",
        "uniform sampler2D revealMap;",
        "uniform float epsilon;",
        "uniform float revealed;",
        "uniform float opacity;",

        "varying vec2 vUv;",


        "void main() {",

        "vec4 rgba = texture2D(map,  vUv);",
        "vec4 reveal = texture2D(revealMap,  vUv);",
        "rgba.a *=  opacity * smoothstep(1.0 - revealed - epsilon, 1.0 - revealed + epsilon, (reveal.r + reveal.g + reveal.b)/3.0);",


        "gl_FragColor = rgba;",

        "}"

    ].join("\n")

};

module.exports = RevealMap;
