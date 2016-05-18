//var THREE = require('three');
var BufferedTextSDF = require('./neilviz/BufferedTextSDF');
var textures = require('./textures').textures;



var model = require('./model');
var states = require('./states');
var cats = model.cats;
var depts = model.depts;


var objects = null;
var allPromises = [];

var sizeChecker = new BufferedTextSDF({textures:textures});

var numToTextItems = function (num, scale){
  scale = scale || 1;
  var label, div, pr;
  if (num >= 1000000000){
    div = 1000000000;
    pr = 1;
    label = 'BILLION';
  }
  else if (num >= 100000000){
    div = 1000000;
    pr = 0;
    label = 'MILLION';
  }
  else if (num >= 1000000){
    div = 1000000;
    pr = 1;
    label = 'MILLION';
  }
  var numItem = {text: (num/div).toFixed(pr), x:14*scale, y:50*scale, fontSize:115*scale};

  var numWidth = sizeChecker.getItemSize(numItem).width; //132
  numItem.x =  numWidth * 0.08;
  return [
    {text: '$', x:0 * scale - numWidth * 0.53, y:55*scale, fontSize:60*scale},
    numItem,
    {text: label, y:-35*scale, fontSize:50*scale}
  ];
};



var params = {
  phillyTotal: {items:numToTextItems(model.totalBudget)}
};

var focisByCid = [];
states.catTotals.focis.forEach(function(foci){
  focisByCid[foci.cid] = foci;
});


cats.forEach(function(cat){
  scale = Math.sqrt(cat.t/1000000000);
  var foci = focisByCid[cat.cid];
  params['cat_t_' + cat.cid] =  {items:numToTextItems(cat.t, 0.11 + cat.t/5000000000), x:foci.x, y:foci.y};
  params['cat_n_' + cat.cid] =  {items:[{text: cat.name.substring(0,22) , y:-72* scale,fontSize:18 * scale}],color:0x000000, x:foci.x, y:foci.y};

});
var focisByDid = [];
states.deptByCat.focis.forEach(function(foci){
  focisByDid[foci.did] = foci;
});

depts.forEach(function(dept){
  var scale = Math.sqrt(dept.t/1000000000);
  var underScale = Math.max(0.6,scale);
  var foci = focisByDid[dept.did];
  params['dept_t_' + dept.did] =  {items:numToTextItems(dept.t, 0.09 + dept.t/4400000000), x:foci.x, y:foci.y};
  params['dept_n_' + dept.did] =  {items:[{text: dept.dn.substring(0,22) , y:-72* scale,fontSize:18 * underScale}],
                    color:0x000000, x:foci.x, y:foci.y};

});



var keys = Object.keys(params);
var allPromises = [];


function getObjects(){

  if (objects !== null)
    return objects;

  objects = {};
  keys.forEach(function(key){
    params[key].textures = textures;
    objects[key] = new BufferedTextSDF(params[key]);
    objects[key].visible = false;
    objects[key].material.uniforms.opacity.value = 0;
    objects[key].position.set(params[key].x || 0, params[key].y || 0, 6);
    allPromises.push(objects[key].loadedPromise);
  });

  return objects;

}
//start out w zero opacity



module.exports = {

  params: params,
  getObjects: getObjects,
};
