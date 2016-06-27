var THREE = require('three');
var config = require('./config');

var loader = new THREE.CubeTextureLoader();

/*
var filenames = ["xpos.png", "xneg.png",
  "ypos.png", "yneg.png",
  "zpos.png", "zneg.png"
];
*/
var filenames = ["philly_singleSquare.jpg","philly_singleSquare.jpg","philly_singleSquare.jpg","philly_singleSquare.jpg","philly_singleSquare.jpg","philly_singleSquare.jpg",];

var urlSets = {
  philly: filenames.map(function(img) {
    return '/textures/'+ img;
  }),
/*  dark: filenames.map(function(img) {
    return '/textures/dark_skybox/' + img;
  }),
  redblue: filenames.map(function(img) {
    return '/textures/redblue_skybox/' + img;
  })
*/
};

var textureCubes = {};
var promises = [];
var allLoaded = null;

function load() {
  if (allLoaded === null) {

    allLoaded = new Promise(function(allLoadedResolve) {

  //    window.addEventListener("load", function(event) {
        var keys = Object.keys(urlSets);

        keys.forEach(function(key) {
          promises.push(new Promise(function(tResolve) {
            textureCubes[key] = loader.load(urlSets[key], tResolve);
          }));
        });
        Promise.all(promises).then(allLoadedResolve);

      });
  //  });

  }
  return allLoaded;
}

module.exports = {
  load: load,
  textureCubes:textureCubes
};
