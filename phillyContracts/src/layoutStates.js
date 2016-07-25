var model = require('./model');
var extend = require('./neilviz/util/extend');

var radiusSquared = model.radiusSquared;
var radius = model.radius;


var catsById = model.catsById;
var depts = model.depts;
var cats = model.cats;
var dotValue = model.dotValue;
var totalDots = model.totalDots;
var nodes = model.nodes;

//TODO: move to util file
function hexToRgbArray(hex) {
    hex = Math.floor(hex);

    return [
        (hex >> 16 & 255) / 255,
        (hex >> 8 & 255) / 255,
        (hex & 255) / 255
    ];

}


//var textObjects = require('./textItems').objects;


var states = {};
//var textKeys = Object.keys(textObjects);





// *********************
//   Make each state...
//   Every state has:
//      1)  array of focis (points where balls gravitate towards)
//      2)  array of nodes, that correspond to balls and indicate which foci they are linked to
//      3)  array of text objects that
//   It's probably a good idea to makes states immutable, meaning they don't include functions
//   or refernces to other objects, which is why the nodes refernce the focis by numeric id
//   not actual refernces.
// *********************

/*states.empty = {
    focis: [],
    nodes: [],
    text: []
  };
*/

states.wholeCity = function() {

    // state
    var foci = {
        x: 0,
        y: 0,
        distSq: radiusSquared(model.totalBudget),
        reflect: 1
    };

    var state = {
        focis: [foci],
        nodes: [],
        text: ['phillyTotal'],
        camPos: {
            x: 0,
            y: 0,
            z: 300
        },
    };

    nodes.forEach(function(node, i) {
        state.nodes.push({
            foci: foci,
            nid: i,
            color: hexToRgbArray(0x333333)
        });
    });

    return state;

}();

states.wholeCityNoText = extend({}, states.wholeCity, { text: [] });




states.deptByCat = function() {
    // state
    var state = {
        focis: [],
        nodes: [],
        text: [],
        camPos: {
            x: 0,
            y: 0,
            z: 500
        },
    };



    var deptFoci = []; //for this state, assigns a foci to each dept

    cats.forEach(function(cat) {
        cat.depts.sort(function(a, b) {
            return b.t - a.t;
        });
        yC = 200;
        cat.depts.forEach(function(dept) {

            state.text.push('dept_t_' + dept.did);
            state.text.push('dept_n_' + dept.did);

            yC -= radius(dept.t);



            var foci = {
                x: cat.x,
                y: yC,
                distSq: radiusSquared(dept.t),
                did: dept.did,
                reflect: 1


            };


            state.focis.push(foci);
            deptFoci[dept.did] = state.focis.length - 1;
            yC -= radius(dept.t) + model.deptNameScale(dept.t) * 2 + 10;
        });
    });

    nodes.forEach(function(node, i) {
        state.nodes.push({
            nid: i,
            foci: state.focis[deptFoci[node.did]],
            color: hexToRgbArray(depts[node.did].cat.color),
            fid: deptFoci[node.did],

        });
    });

    return state;
}();

states.catTotals = function() {
    // state
    var state = {
        focis: [],
        nodes: [],
        text: [],
        camPos: {
            x: 0,
            y: 100,
            z: 500
        },
    };

    var catFoci = []; //for this state, assigns a foci to each dept

    cats.forEach(function(cat) {

        state.text.push('cat_t_' + cat.cid);
        state.text.push('cat_n_' + cat.cid);

        var foci = {
            x: cat.x,
            y: 200 - radius(cat.t),
            distSq: radiusSquared(cat.t),
            cid: cat.cid,
            reflect: 1


        };
        state.focis.push(foci);
        catFoci[cat.cid] = foci;

        //temp
        /*if (textObjects['cat_t_' + cat.cid]){
          textObjects['cat_t_' + cat.cid].position.x = cat.x;
          textObjects['cat_t_' + cat.cid].position.y = 10;
          textObjects['cat_n_' + cat.cid].position.x = cat.x;
          textObjects['cat_n_' + cat.cid].position.y = 10;

        }
        */
    });


    nodes.forEach(function(node, i) {
        state.nodes.push({
            nid: i,
            foci: catFoci[depts[node.did].cat.cid],
            color: hexToRgbArray(depts[node.did].cat.color)
        });
    });

    return state;
}();


//deptByCatHeaders
states.deptByCatHeaders = extend({}, states.deptByCat);
states.deptByCatHeaders.text = states.deptByCatHeaders.text.slice(0);

states.catTotals.text.forEach(function(txt) {
    if (txt.substring(0, 5) === 'cat_n') states.deptByCatHeaders.text.push(txt);
});



//by department, contracts colored
states.deptByCatByContract = extend({}, states.deptByCat);
//clone focis, with counter for nodes needing colored
var focisC = states.deptByCatByContract.focis.map(function(foci) {
    var dept = depts[foci.did];
    return { cc: Math.round(dept.tc / dotValue) };
});

var bhFid;
states.deptByCatByContract.focis.forEach(function(foci, fid) {
    if (foci.did === model.behavioralHealthDid) bhFid = fid;
});


var bhColor = hexToRgbArray(0x010101);
var nodesC = states.deptByCatByContract.nodes.map(function(n) {
    var node = extend({}, n);
    var fociC = focisC[node.fid];
    if (fociC.cc > 0) {
        node.color = bhColor;
        fociC.cc--;
    } else if (node.fid === bhFid) {
        node.yy = -0.2;

    }
    return node;
});
states.deptByCatByContract.nodes = nodesC;

//pull up BH

//by department, contracts colored
states.behavioralHealth = extend({}, states.deptByCatByContract);
states.behavioralHealth.focis = states.behavioralHealth.focis.slice(0);



var oldFoci = extend({}, states.behavioralHealth.focis[bhFid]);
var newBhFoci = extend({}, states.behavioralHealth.focis[bhFid]);
//newBhFoci.reflect = 1;
oldFoci.distSq = 100;
oldFoci.y = oldFoci.y - 20;
newBhFoci.y = newBhFoci.y + 100;
states.behavioralHealth.focis.push(newBhFoci);
states.behavioralHealth.focis[bhFid] = oldFoci;
states.behavioralHealth.nodes = states.behavioralHealth.nodes.map(function(node) {
    if (node.fid === bhFid && node.color === bhColor) return extend({}, node, { foci: newBhFoci });
    if (node.fid === bhFid) return extend({}, node, { foci: oldFoci });
    return node;
});
states.behavioralHealth.text = states.behavioralHealth.text.filter(function(txt) {
    return txt !== 'dept_t_' + model.behavioralHealthDid;
});
states.behavioralHealth.text.push('bh_ct');
states.behavioralHealth.text.push('bh_nct');

// make bh reflective
states.behavioralHealthPhoto = extend({}, states.behavioralHealth);
var bhPhotoFoci = extend({}, newBhFoci, { reflect: 1 });
states.behavioralHealthPhoto.nodes = states.behavioralHealthPhoto.nodes.map(function(node) {
    if (node.fid === bhFid && node.color === bhColor) return extend({}, node, { foci: bhPhotoFoci });
    return node;
});


//by department, contracts colored

states.contractNonContract = function() {
    var cFoci = {
        y: 0,
        x: 180,
        distSq: radiusSquared(model.contractTotal),
        reflect:1
    };

    var nFoci = {
        y: 0,
        x: -180,
        distSq: radiusSquared(model.nonContractTotal),
        reflect:1

    };

    var nodes = states.behavioralHealth.nodes.map(function(node) {
        var foci = (node.color === bhColor) ? cFoci : nFoci;
        return extend({}, node, { foci: foci, yy: 0 });
    });

    var state = {
        focis: [cFoci, nFoci],
        nodes: nodes,
        text: ['con_t_0', 'con_t_1', 'con_n_0', 'con_n_1'],
    };

    return state;

}();

states.contractProcurement = function() {
    var cFoci = {
        y: 0,
        x: 180,
        distSq: radiusSquared(model.contractTotal - model.procurementTotal),
        reflect: 0

    };

    var cpFoci = {
        y: 0,
        x: 400,
        distSq: radiusSquared(model.procurementTotal),
        reflect: 1
    };

    var nFoci = {
        y: 0,
        x: -180,
        distSq: radiusSquared(model.nonContractTotal),
        reflect: 0
    };

    pCount = Math.round(model.procurementTotal / model.dotValue);

    var nodes = states.behavioralHealth.nodes.map(function(node) {
        var foci;
        if (node.color !== bhColor) foci = nFoci;
        else if (pCount <= 0) foci = cFoci;
        else {
            pCount--;
            foci = cpFoci;
        }




        return extend({}, node, { foci: foci });
    });




    var state = {
        focis: [cFoci, cpFoci, nFoci],
        nodes: nodes,
        text: [] //['proc_t_0','proc_n_0', 'proc_s_0','proc_t_1','proc_n_1', 'proc_s_1','proc_t_2','proc_n_2'],
    };

    return state;

}();


states.contractProfessional = extend({}, states.contractProcurement);
states.contractProfessional.focis = states.contractProfessional.focis.map(function(foci) {
    var reflect = 1 - (foci.reflect || 0);
    return extend({}, foci, { reflect: reflect });
});
states.contractProfessional.nodes = states.contractProfessional.nodes.map(function(node) {
    var fi = states.contractProcurement.focis.indexOf(node.foci);
    return extend({}, node, { foci: states.contractProfessional.focis[fi] });
});









module.exports = states;
