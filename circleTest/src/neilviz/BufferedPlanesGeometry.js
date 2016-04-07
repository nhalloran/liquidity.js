var THREE = require('three');


var BufferedPlanesGeometry = function(params) {

  THREE.BufferGeometry.call(this);

  var gridX = Math.floor(params.widthSegments) || 1;
  var gridY = Math.floor(params.heightSegments) || 1;
  var gridX1 = gridX + 1;
  var gridY1 = gridY + 1;

  this.count = Math.floor(params.count) || 1;

  this.indivColors = !!params.indivColors;


  this.verticesPerPlane = gridX1 * gridY1;
  this.indicesPerPlane = gridX * gridY * 6;


  var vertices = new Float32Array(this.verticesPerPlane * this.count * 3);
  var normals = new Float32Array(this.verticesPerPlane * this.count * 3);
  var uvs = new Float32Array(this.verticesPerPlane * this.count * 2);
  var indices = new((vertices.length / 3) > 65535 ? Uint32Array : Uint16Array)(this.indicesPerPlane * this.count);


  this.setIndex(new THREE.BufferAttribute(indices, 1));
  this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
  this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  if (this.indivColors) {
    var colors = new Float32Array(this.verticesPerPlane * this.count * 3);
    this.addAttribute('colors', new THREE.BufferAttribute(vertices, 3));
  }

};

BufferedPlanesGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
//BufferedPlanesGeometry.prototype.constructor = BufferedPlanesGeometry;


BufferedPlanesGeometry.prototype.mergeIndex = function(geometry, offset) {
  if (this.index) {


    var indices = this.index.array;
    var indicesNew = geometry.index.array;


    for (var i = 0, j = this.indicesPerPlane * offset; i < this.indicesPerPlane; i++, j++) {
      indices[j] = this.verticesPerPlane * offset + indicesNew[i];
    }



  }
};

BufferedPlanesGeometry.prototype.renderSinglePositions = function(index, center, size) {
  //TODO: make size allow a abject array to specify width+ height
  var t = BufferedPlanesGeometry.positionsTemplat;
  var c = [center.x || 0, center.y || 0, center.z || 0];
  var i, j;

  var vertices = this.attributes.position.array;

  for (i = 0, j = this.verticesPerPlane * index; i < this.verticesPerPlane; i++, j++) {
    vertices[j * 3 + 0] = t[i * 3 + 0] * size + center.x;
    vertices[j * 3 + 1] = t[i * 3 + 1] * size + center.y;
    vertices[j * 3 + 2] = t[i * 3 + 2] * size + center.z;
  }

  this.attributes.position.needsUpdate = true;



};

BufferedPlanesGeometry.prototype.setSingleColor = function(index, color) {

  if (this.indivColors && color) {

    var colors = this.attributes.colors.array;

    for (i = 0, j = this.verticesPerPlane * index; i < this.verticesPerPlane; i++, j++) {
      colors[j * 3 + 0] = color.r;
      colors[j * 3 + 1] = color.g;
      colors[j * 3 + 2] = color.b;
    }
    this.attributes.colors.needsUpdate = true;

  }
  this.attributes.colors.needsUpdate = true;

};



BufferedPlanesGeometry.positionsTemplat = [-0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0];

module.exports = BufferedPlanesGeometry;
