//from underscore's pick
// Return a copy of the object only containing the whitelisted properties.

// Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
// This accumulates the arguments passed into an array, after a given index.
 /*var restArgs = function(func, startIndex) {
   startIndex = startIndex == null ? func.length - 1 : +startIndex;
   return function() {
     var length = Math.max(arguments.length - startIndex, 0);
     var rest = Array(length);
     for (var index = 0; index < length; index++) {
       rest[index] = arguments[index + startIndex];
     }
     switch (startIndex) {
       case 0: return func.call(this, rest);
       case 1: return func.call(this, arguments[0], rest);
       case 2: return func.call(this, arguments[0], arguments[1], rest);
     }
     var args = Array(startIndex + 1);
     for (index = 0; index < startIndex; index++) {
       args[index] = arguments[index];
     }
     args[startIndex] = rest;
     return func.apply(this, args);
   };
 };


module.exports = restArgs(function(obj, keys) {
  var result = {}, iteratee = keys[0];
  if (obj == null) return result;
  if (_.isFunction(iteratee)) {
    if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
    keys = _.allKeys(obj);
  } else {
    iteratee = keyInObj;
    keys = flatten(keys, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (iteratee(value, key, obj)) result[key] = value;
  }
  return result;
});

*/

module.exports =  function(object,keys){
  var result = {};
  keys.forEach(function(key){
    if (object[key] !== undefined)
      result[key] = object[key];
  });
  return result;


};
