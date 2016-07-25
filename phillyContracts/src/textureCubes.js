var THREE = require('three');
var config = require('./config');

var loader = new THREE.CubeTextureLoader();

/*
var filenames = ["xpos.png", "xneg.png",
  "ypos.png", "yneg.png",
  "zpos.png", "zneg.png"
];
*/

var texture6 = function(filename){
  var arr = [];
  for (var i = 0 ; i <6; i++){
    arr.push('/textures/' + filename);
  }
  return arr;
};
var filenames = ["philly_singleSquare.jpg","philly_singleSquare.jpg","philly_singleSquare.jpg","philly_singleSquare.jpg","philly_singleSquare.jpg","philly_singleSquare.jpg",];

var urlSets = {
  philly: texture6("philly_singleSquare.jpg"),
  nurseBloodPressure: texture6("photo_nurseBloodPressure.jpg"),
  procurementItems: texture6("photo-paper-sandwiches.jpg"),
  constructionPlan: texture6("photo-construction-plan.jpg"),

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
