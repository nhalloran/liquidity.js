var THREE = require('three');
var MarchingCubes = require('./MarchingCubes');
var config = require('./config');


//test
// MARCHING CUBES

      var material = new THREE.MeshPhongMaterial({color:0xffffff, side: THREE.BackSide, vertexColors: THREE.VertexColors });

      var resolution = config.metaballResolution;
    //  var numBlobs = 10;

      var effect = new MarchingCubes( resolution, material, true, true );

      var scaleFix = 2000;
      var posFix = {x:0.5,y:0.5, z:0.5}

      effect.position.set( -posFix.x, -posFix.y, -posFix.z );
      effect.scale.set( scaleFix/2, scaleFix/2, scaleFix/2 );

      effect.enableUvs = false;
    //  effect.enableColors = false;


      /*function updateCubes( object, time, numblobs ) {

  			object.reset();

  			// fill the field with some metaballs

  			var i, ballx, bally, ballz, subtract, strength;

  			subtract = 3;
  			strength = 0.001 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 );

  			for ( i = 0; i < numblobs; i ++ ) {

  				ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5;
  				bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77; // dip into the floor
  				ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;

  				object.addBall(ballx, bally, ballz, strength, subtract);

  			}

  		}
      */
      effect.update = function( nodes ) {

  			effect.reset();

  			// fill the field with some metaballs

  			var i, ballx, bally, ballz, subtract, strength;

  			//subtract = 12;
  			subtract = 40;
  			strength = 0.13 * 0.1 * 1.2 / ( ( Math.sqrt( nodes.length ) - 1 ) / 4 + 1 );

  			for ( i = 0; i < nodes.length; i ++ ) {
          var node = nodes[i];
  				effect.addBall(node.x/scaleFix + posFix.x, node.y/scaleFix + posFix.y, posFix.z, strength, subtract);

  			}


  		};



    //  updateCubes( effect, 0, numBlobs);


module.exports = effect;
