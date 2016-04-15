var reduceGeo = function(geo){

  var count = geo.positions.length / 3;
  newCount = 0;




  var newGeo = {
    positions: new Float32Array(count * 3),
    normals: new Float32Array(count * 3),
    colors: new Float32Array(count * 3),
    indices: new Uint32Array(count)

  };

  var i, j, match;

  function copyPoint(fromGeo, toGeo, fromIndex, toIndex){
    if (toIndex === undefined)
      toIndex = newCount;
    for (var n = 0; n < 3; n++){
      toGeo.positions[toIndex * 3 + n] = fromGeo.positions[fromIndex * 3  + n];
      toGeo.normals[toIndex * 3  + n] = fromGeo.normals[fromIndex * 3  + n];
      toGeo.colors[toIndex * 3  + n] = fromGeo.colors[fromIndex * 3  + n];
    }
  }
  for (i = 0; i < count; i++ ){
    match = -1;
    for (j = 0; j < newCount; j++ ){
      if (
            geo.positions[i * 3 + 0] === newGeo.positions[j * 3  + 0] &&
            geo.positions[i * 3  + 1] === newGeo.positions[j * 3  + 1] &&
            geo.positions[i * 3  + 2] === newGeo.positions[j * 3  + 2] &&
            geo.normals[i * 3 + 0] === newGeo.normals[j * 3  + 0] &&
            geo.normals[i * 3  + 1] === newGeo.normals[j * 3  + 1] &&
            geo.normals[i * 3  + 2] === newGeo.normals[j * 3  + 2]
        )
          match = j;

    }
    if (match === -1){
      copyPoint(geo, newGeo, i);
      newGeo.indices[i] = newCount;
      newCount ++;
      //new position_offset
    }
    else {
      newGeo.indices[i] = match;
    }

  }

  var finalGeo = {
      positions: new Float32Array(newCount * 3),
      normals: new Float32Array(newCount * 3),
      colors: new Float32Array(newCount * 3),
      indices: new Uint16Array(newGeo.indices)

  };
  for (i = 0; i < newCount; i++){
    copyPoint(newGeo,finalGeo,i,i);
  }

  return finalGeo;



};

module.exports = reduceGeo;
