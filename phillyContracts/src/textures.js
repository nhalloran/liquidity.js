var THREE = require('three');

//organize by category... bakdrop first?

var urls = {
  'PTSansNarrowBold256': '/textures/ptsansnarrow_bold_256.png',
  'PTSansNarrowRegular256': '/textures/ptsansnarrow_regular_256.png',
};


var textureLoader = new THREE.TextureLoader();

var allLoaded = null;
var promises = {};
var promisesArray = [];
var textures = {};

function onError() {
  //debugger;
}


var load = function() {


  if (allLoaded === null) {

    allLoaded = new Promise(function(allLoadedResolve) {



      var keys = Object.keys(urls);

      keys.forEach(function(key) {
        promises[key] = new Promise(function(tResolve) {
          textures[key] = textureLoader.load(urls[key], tResolve);
        });
        promisesArray.push(promises[key]);
      });
      Promise.all(promisesArray).then(allLoadedResolve);

    });

  }

  return allLoaded;



};

module.exports = {
  load: load,
  textures: textures,
  promises: promises,
  //allLoaded: allLoaded
};
