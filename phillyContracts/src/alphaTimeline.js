//timeline of force layout's alpha variable

var timeline = [
  {t:0, a:0.005},
  {t:SPLIT_TO_DEPTS_START -1200, a:0.005}, //slow ripple buildup
  {t:SPLIT_TO_DEPTS_START + 1000, a:0.05},
  {t:SPLIT_TO_DEPTS_START + 1800, a:0.05},
  {t:GROUP_BY_CAT_START +200, a:0.01},
  {t:GROUP_BY_CAT_START + 600, a:0.06},
  {t:GROUP_BY_CAT_START + 1600, a:0.06},
  {t:BACK_TO_DEPTS_START, a:0.01},
  {t:BACK_TO_DEPTS_START + 600, a:0.05},
  {t:BACK_TO_DEPTS_START + 2000, a:0.05},
  {t:BACK_TO_DEPTS_START + 6000, a:0.05},
  {t:BEHAVIORAL_HEALTH_START, a:0.01},
  {t:BEHAVIORAL_HEALTH_START + 300, a:0.04},
  {t:BEHAVIORAL_HEALTH_START + 8000, a:0.01},
  {t:CONSTRACT_NONCONTRACT_START + 300, a:0.01},
  {t:CONSTRACT_NONCONTRACT_START + 600, a:0.05},
  {t:CONSTRACT_NONCONTRACT_START + 3600, a:0.05},
  {t:CONSTRACT_NONCONTRACT_START + 8000, a:0.01},
  {t:PROCUREMENT_START, a:0.01},
  {t:PROCUREMENT_START + 300, a:0.04},
  {t:PROCUREMENT_START + 1300, a:0.04},
  {t:PROCUREMENT_START + 5000, a:0.01},

];


function aAtT(tl,t){
//  var ps = upperYs;
  if(t <= tl[0].t) return tl[0].a;
  if(t >= tl[tl.length-1].t) return tl[tl.length-1].a;
  var low = 0;
  var high;
  for (var i = 0; i < tl.length; i++){
    high = i;
    if (tl[high].t > t) break;
    else low = i;
  }
  var ratio = (t - tl[low].t) / (tl[high].t - tl[low].t);
  return tl[low].a + (tl[high].a - tl[low].a) * ratio;
}


var getAlpha = function(time){
  return aAtT(timeline,time);
};

module.exports = {
  getAlpha: getAlpha
};
