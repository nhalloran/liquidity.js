var THREE = require('three');

var urls = {
  AndoBold256: '/textures/ando_bold_256.png'
};

var promises = {};

Object.keys(urls).forEach(function(key){
  promises[key] = new Promise(function(resolve) {
    var loader = new THREE.TextureLoader();
      loader.load(urls[key],
        function(texture) {
          resolve(texture);
        },
        function(xhr) {
          //  console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        function(xhr) {
          console.log('An error happened loading texture');
        }
      );

    });

});

module.exports = promises;
