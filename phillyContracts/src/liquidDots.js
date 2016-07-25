var THREE = require('three');
var d3ForceLayout = require('./d3ForceLayout');
var BufferedPlanesGeometry = require('./neilviz/BufferedPlanesGeometry');
var CircleMaterial = require('./neilviz/CircleMaterial');




function build(params) {


    var nodes = params.nodes;
    var width = params.width; //960,
    var height = params.height; // 500;
    var dotRadius = params.dotRadius;


    var circleGeo = new BufferedPlanesGeometry({
        count: nodes.length,
        indivColors: true
    });

    var circleMat = new CircleMaterial({
      color: 0xff0000,
      indivColors: true
    });



    var dotIndex = 0;
    nodes.forEach(function(node) {


        var geo = new THREE.PlaneBufferGeometry(1, 1);
      //  var dept = depts[node.did];

        circleGeo.merge(geo, dotIndex * 4);
        circleGeo.mergeIndex(geo, dotIndex);
      //  circleGeo.setSingleColor(dotIndex, dept.cat.colorObj);

        dotIndex++;


    });







    var circles = new THREE.Mesh(circleGeo, circleMat);

    circleGeo.computeBoundingSphere();
    circleGeo.boundingSphere.radius = Infinity;





    var force = d3ForceLayout()
        .nodes(nodes)
        .links([])
        .gravity(0)

    .charge(-80)
        //.theta(0.2)
        .chargeDistance(dotRadius * 0.8)
        .size([width, height])
        .on("tick", tick);



    function tick(e) {
        var k = 0.1 * e.alpha;





        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            //if(i/nodes.length < transState.t){
            var foci = o.foci;
            var distSq = (foci.y - o.y) * (foci.y - o.y) + (foci.x - o.x) * (foci.x - o.x);
            //less than 20,000 should start to taper
            var innerPull = 0.1 * Math.max(0, Math.min(1, (15 - foci.distSq / 1000)));
            var antidense = (distSq > foci.distSq) ? 1 : innerPull;
            //test

            o.y += (foci.y - o.y) * k * antidense;
            o.x += (foci.x - o.x) * k * antidense;

            if (o.yy) {
                if (o.y > foci.y - Math.sqrt(distSq) * 0.8)
                    o.y += o.yy;
            }
            //}
        });


        nodes.forEach(function(node, i) {
            circleGeo.renderSinglePositions(i, node, dotRadius);
        });


    }

    force.start();
    circles.force = force;

    return circles;
}

module.exports = {
    build: build
};
