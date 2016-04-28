//var THREE = require('three');
var BufferedTextSDF = require('./neilviz/BufferedTextSDF');


var model = require('./model');
var states = require('./states');
var cats = model.cats;
var depts = model.depts;


var objects = null;
var allPromises = [];



var params = {
  phillyTotal: {items:[{text: '$ ' + (model.totalBudget/1000000000).toFixed(1) , y:40,fontSize:80},
                                {text: 'BILLION', y:-30, fontSize:50}]}
};

var focisByCid = [];
states.catTotals.focis.forEach(function(foci){
  focisByCid[foci.cid] = foci;
});


cats.forEach(function(cat){
  scale = Math.sqrt(cat.t/1000000000);
  var foci = focisByCid[cat.cid];
  params['cat_t_' + cat.cid] =  {items:[{text: '$ ' + (cat.t/1000000).toFixed(0) , y:20* scale,fontSize:30 * scale},
                                  {text: 'MILLION', y:-10* scale, fontSize:20* scale}], x:foci.x, y:foci.y};
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
  params['dept_t_' + dept.did] =  {items:[{text: '$ ' + (dept.t/1000000).toFixed(0) , y:20* scale,fontSize:30 * scale},
                                {text: 'MILLION', y:-10* scale, fontSize:20* scale}], x:foci.x, y:foci.y};
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
