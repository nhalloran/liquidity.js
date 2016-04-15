var THREE = require('three');
var extend = require('./util/extend');

var SDFMaterial = function(params){

  var color = (params.color !== undefined) ? params.color : 0xffffff;

  if (!params.map) console.warn('error: SDFMaterial requires map param');


  var uniforms = {

    color:     { type: "c", value: new THREE.Color( color ) },
    map:   { type: "t", value: params.map }	,
    opacity:   { type: "f", value: 1}	,
    epsilon:   { type: "f", value: 0.06}	,

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

      '				vec4 texColor = texture2D( map, vUv );',


      '				#ifdef GL_OES_standard_derivatives',
      '				float w = clamp( 200.0 * epsilon * ( abs( dFdx( vUv.x ) ) + abs( dFdy( vUv.y ) ) ), 0.0, 0.5 );',
      '				#else',
      '				float w = epsilon;',
      '				#endif',
    //  '       w = 0.02; ',
      '       float sdfa = smoothstep( 0.5 - w, 0.5 + w, texColor.r );',
  //    '				if (sdfa < 0.01) discard;',
      '				gl_FragColor = vec4( color, opacity * sdfa);',
  //    '				gl_FragColor = vec4( 0.0,0.0,0.0,1.0);',

      //

      "}"

		].join("\n");


    THREE.ShaderMaterial.call(this,{
      uniforms: uniforms,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      derivatives: true,
      transparent: true,
      name: 'sdf',  //??

    });

    this.envMap = params.envMap;






};

SDFMaterial.prototype =  Object.create( THREE.ShaderMaterial.prototype );

module.exports = SDFMaterial;
