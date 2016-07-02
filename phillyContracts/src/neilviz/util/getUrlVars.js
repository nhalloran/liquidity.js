module.exports = function getUrlVars() {
  var vars = {};
  if (typeof window !== 'undefined'){
    var parts = window.location.href.replace(/[?&#]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
      });
  }
  return vars;
};
