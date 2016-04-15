var BufferedTextSDF = require('./neilviz/BufferedTextSDF');


var model = require('./model');
var cats = model.cats;
var depts = model.depts;

var textItems ={
  phillyTotal: new BufferedTextSDF({items:[{text: '$ ' + (model.totalBudget/1000000000).toFixed(1) , y:40,fontSize:80},
                                {text: 'BILLION', y:-30, fontSize:50}]})
};

cats.forEach(function(cat){
  scale = Math.sqrt(cat.t/1000000000);
  textItems['cat_t_' + cat.cid] =  new BufferedTextSDF({items:[{text: '$ ' + (cat.t/1000000).toFixed(0) , y:20* scale,fontSize:30 * scale},
                                {text: 'MILLION', y:-10* scale, fontSize:20* scale}]});
  textItems['cat_n_' + cat.cid] =  new BufferedTextSDF({items:[{text: cat.name.substring(0,22) , y:-72* scale,fontSize:18 * scale}],color:0x000000});

});
depts.forEach(function(dept){
  var scale = Math.sqrt(dept.t/1000000000);
  var underScale = Math.max(0.6,scale);
  textItems['dept_t_' + dept.did] =  new BufferedTextSDF({items:[{text: '$ ' + (dept.t/1000000).toFixed(0) , y:20* scale,fontSize:30 * scale},
                                {text: 'MILLION', y:-10* scale, fontSize:20* scale}]});
  textItems['dept_n_' + dept.did] =  new BufferedTextSDF({items:[{text: dept.dn.substring(0,22) , y:-72* scale,fontSize:18 * underScale}],color:0x000000});

});


module.exports = textItems;
