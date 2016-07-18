var THREE = require('three');
var reveals = require('./reveals');

//organize by category... bakdrop first?

var urls = {
  'PTSansNarrowBold256': '/textures/ptsansnarrow_bold_256.png',
  'PTSansNarrowRegular256': '/textures/ptsansnarrow_regular_256.png',
  'paperNormal': '/textures/609-normal-water-color-paper.jpg',
};

for (var revealId in reveals.params){
  urls['reveal_' + revealId + '_fill'] = reveals.params[revealId].mapUrl;
  urls['reveal_' + revealId + '_reveal'] = reveals.params[revealId].revealMapUrl;
}




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
