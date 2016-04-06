module.exports = function(edge0,edge1,x){
  return Math.max(0,Math.min(1,(x - edge0) / (edge1 - edge0)));
   //from glsl:
   //var t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
   //return t * t * (3.0 - 2.0 * t);
};
