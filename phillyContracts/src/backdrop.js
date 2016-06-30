var THREE = require('three');
var highlights = require('./highlights');

var mat = new THREE.MeshPhongMaterial({color:0xf1f1f1});

var geo = new THREE.PlaneBufferGeometry(5000, 5000);

var backdrop = new THREE.Mesh(geo,mat);
backdrop.position.z = -30;

highlights.position.z = 2;
backdrop.add(highlights);

module.exports= backdrop;
