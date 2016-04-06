var THREE = require('three');
var extend = require('./util/extend');

var CircleMaterial = function(params){

  params = params || {};

  var color = (params.color) ? params.color : 0xffffff;


  var uniforms = {

    color:     { type: "c", value: new THREE.Color( color ) },
    opacity:   { type: "f", value: 1}	,
    epsilon:   { type: "f", value: 0.02}	,

};








  var vertexShader = [

			"#define SDF",

      "varying vec2 vUv;",

  		"void main() {",

  		"vUv = uv;",
  		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

  		"}"

		].join("\n");


    var fragmentShader =  [

			"uniform vec3 color;",
      "uniform sampler2D map;",
      "uniform float epsilon;",
      "uniform float opacity;",
      "varying vec2 vUv;",

			"void main() {",


      "vec4 rgba = texture2D(map,  vUv);",
      //"vec4 reveal = texture2D(revealMap,  vUv);",


      '				#ifdef GL_OES_standard_derivatives',
      '				float w = clamp( 50.0 * epsilon * ( abs( dFdx( vUv.x ) ) + abs( dFdy( vUv.y ) ) ), 0.0, 0.5 );',
      '				#else',
      '				float w = epsilon;',
      '				#endif',
      '       float r2 = (vUv.x - 0.5) * (vUv.x - 0.5) +  (vUv.y - 0.5) * (vUv.y - 0.5) ;',
    //  '       w = 0.02; ',
      '       float sdfa = smoothstep( 0.25, 0.25 -w, r2);',
      '				if (sdfa < 0.01) discard;',
      '				gl_FragColor = vec4( color, opacity * sdfa);',

      //

      "}"

		].join("\n");


    THREE.ShaderMaterial.call(this,{
      uniforms: uniforms,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      derivatives: true,
      transparent: true,
      name: 'circle',  //??

    });







};

CircleMaterial.prototype =  Object.create( THREE.ShaderMaterial.prototype );

module.exports = CircleMaterial;
