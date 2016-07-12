//var THREE = require('three');
var BufferedTextSDF = require('./neilviz/BufferedTextSDF');
var textures = require('./textures').textures;
var extend = require('./neilviz/util/extend');




var model = require('./model');
var layoutStates = require('./layoutStates');
var cats = model.cats;
var depts = model.depts;


var objects = null;
var allPromises = [];

var sizeChecker = new BufferedTextSDF({ textures: textures });

var numToTextItems = function(num, scale) {
    scale = scale || 1;
    var label, div, pr;
    if (num >= 1000000000) {
        div = 1000000000;
        pr = 1;
        label = 'BILLION';
    } else if (num >= 100000000) {
        div = 1000000;
        pr = 0;
        label = 'MILLION';
    } else if (num >= 1000000) {
        div = 1000000;
        pr = 1;
        label = 'MILLION';
    }
    var numItem = { text: (num / div).toFixed(pr), x: 14 * scale, y: 50 * scale, fontSize: 115 * scale };

    var numWidth = sizeChecker.getItemSize(numItem).width; //132
    numItem.x = numWidth * 0.08;
    return [
        { text: '$', x: 0 * scale - numWidth * 0.53, y: 55 * scale, fontSize: 60 * scale },
        numItem,
        { text: label, y: -35 * scale, fontSize: 50 * scale }
    ];
};



var params = {
    phillyTotal: { items: numToTextItems(model.totalBudget) }
};

var focisByCid = [];
layoutStates.catTotals.focis.forEach(function(foci) {
    focisByCid[foci.cid] = foci;
});


cats.forEach(function(cat) {
    scale = Math.sqrt(cat.t / 1000000000);
    var foci = focisByCid[cat.cid];
    params['cat_t_' + cat.cid] = { items: numToTextItems(cat.t, 0.11 + cat.t / 5000000000), x: foci.x, y: foci.y };
    //params['cat_n_' + cat.cid] =  {items:[{text: cat.name.substring(0,22) , y:-72* scale,fontSize:18 * scale}],color:0x000000, x:foci.x, y:foci.y};
    var nScale = (0.7 + scale * 0.3);
    var items = cat.name.split('|').reverse().map(function(txt, i) {
        return { text: txt.toUpperCase(), y: i * 20 };

    });
    //params['cat_n_' + cat.cid] =  {items:[{text: cat.name.toUpperCase().substring(0,22) , y: 8 * nScale,fontSize:16 * nScale}],color:0x000000, x:foci.x, y:210};
    params['cat_n_' + cat.cid] = { items: items, color: 0x000000, x: foci.x, y: 230, fontSize: 20, opacity: 0.5 };

});
var focisByDid = [];
layoutStates.deptByCat.focis.forEach(function(foci) {
    focisByDid[foci.did] = foci;
});

depts.forEach(function(dept) {
    var radius = model.radius(dept.t);
    var textScale = model.deptNameScale(dept.t);
    var foci = focisByDid[dept.did];
    params['dept_t_' + dept.did] = { items: numToTextItems(dept.t, 0.09 + dept.t / 4400000000), x: foci.x, y: foci.y };
    params['dept_n_' + dept.did] = {
        items: [{ text: dept.dn.substring(0, 22) }],
        color: 0x000000,
        x: foci.x,
        y: foci.y - radius - textScale * 0.5 - 3,
        fontSize: textScale,
        opacity_: 0.55
    };

});


//behavioral Health
var bhFoci;
layoutStates.behavioralHealth.focis.forEach(function(foci) {
    if (foci.did === model.behavioralHealthDid) bhFoci = foci;
});
params.bh_ct = { items: numToTextItems(model.BHContractTotal, 0.09 + model.BHContractTotal / 4400000000), x: bhFoci.x, y: bhFoci.y };
var bhNonContractTotal = depts[model.behavioralHealthDid].t - model.BHContractTotal;
params.bh_nct = { items: numToTextItems(bhNonContractTotal, 0.09 + bhNonContractTotal / 4400000000), x: bhFoci.x, y: bhFoci.y - 100 };

//

var bigCircleParamGenerator = function(genParams){

  var valId = genParams.valId;
  return function(foci, id) {
    var total = genParams.totals[id];
    var radius = model.radius(total);
    var textScale = model.deptNameScale(total);
    var name = genParams.names[id];
    var subtext = (genParams.subtexts) ? genParams.subtexts[id] : '';
  //  var tParams = {};
    params[valId + '_t_' + id] = { items: numToTextItems(total, 0.13 + total / 8000000000), x: foci.x, y: foci.y };
    params[valId + '_n_' + id] = {
        items: [{ text: name }],
        color: 0x000000,
        x: foci.x,
        y: foci.y - radius - textScale * 2,
        fontSize: textScale * 1,
        opacity_: 0.55
    };
    if (subtext)
      params[valId + '_s_' + id] = {
          items: [{ text: subtext }],
          color: 0x000000,
          x: foci.x,
          y: foci.y - radius - textScale * 3.2,
          fontSize: textScale * 0.9,
          opacity: 0.55
        };

  };


};

var contractNonFunction = bigCircleParamGenerator({
  totals: [model.contractTotal, model.nonContractTotal],
  names: ['CONTRACTS' , 'NON-CONTRACTS'],
  valId: 'con'
});

var contractProcurementFunction = bigCircleParamGenerator({
  totals: [model.contractTotal, model.procurementTotal, model.nonContractTotal],
  names: ['CONTRACTS', 'CONTRACTS', 'NON-CONTRACTS'],
  subtexts: ['Professional Services', 'Procurement', ''],
  valId: 'proc'
});


layoutStates.contractNonContract.focis.forEach(contractNonFunction);
layoutStates.contractProcurement.focis.forEach(contractProcurementFunction);




var keys = Object.keys(params);
var allPromises = [];


function getObjects() {

    if (objects !== null)
        return objects;

    objects = {};
    keys.forEach(function(key) {
        params[key].textures = textures;
        objects[key] = new BufferedTextSDF(params[key]);
        objects[key].visible = false;
        objects[key].material.uniforms.opacity.value = 0;
        objects[key].opFactor = params[key].opacity || 1;
        objects[key].position.set(params[key].x || 0, params[key].y || 0, 6);
        allPromises.push(objects[key].loadedPromise);
    });

    return objects;

}
//start out w zero opacity

// Contract v nonContractTotal







module.exports = {

    params: params,
    getObjects: getObjects,
};
