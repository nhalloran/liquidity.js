var TextSprites = require('./neilviz/TextSprites');


var model = require('./model');
var cats = model.cats;
var depts = model.depts;

var textItems ={
  phillyTotal: new TextSprites({items:[{text: '$ ' + (model.totalBudget/1000000000).toFixed(1) , y:40,fontSize:80},
                                {text: 'BILLION', y:-30, fontSize:50}]})
};

cats.forEach(function(cat){
  scale = Math.sqrt(cat.t/1000000000);
  textItems['cat_t_' + cat.cid] =  new TextSprites({items:[{text: '$ ' + (cat.t/1000000).toFixed(0) , y:20* scale,fontSize:30 * scale},
                                {text: 'MILLION', y:-10* scale, fontSize:20* scale}]});
  textItems['cat_n_' + cat.cid] =  new TextSprites({items:[{text: cat.name.substring(0,22) , y:-72* scale,fontSize:18 * scale}],color:0x000000});

});
depts.forEach(function(dept){
  scale = Math.sqrt(dept.t/1000000000);
  textItems['dept_t_' + dept.did] =  new TextSprites({items:[{text: '$ ' + (dept.t/1000000).toFixed(0) , y:20* scale,fontSize:30 * scale},
                                {text: 'MILLION', y:-10* scale, fontSize:20* scale}]});
  textItems['dept_n_' + dept.did] =  new TextSprites({items:[{text: dept.n.substring(0,22) , y:-72* scale,fontSize:18 * scale}],color:0x000000});

});


module.exports = textItems;
