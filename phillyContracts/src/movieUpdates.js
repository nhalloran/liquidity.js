var config = require('./config');
var sequenceTween = require('./neilviz/util/sequenceTween');

module.exports = function(params) {
    var objects = params.objects;
    var layoutTransitions = params.layoutTransitions;
    var camPos = objects.camera.position;
    var camRot = objects.camera.rotation;



    var pCircles = ([1,2,3,4]).map(function(n){return objects.revealObjects['circleP' + n];});
    var sCircles = ([1,2,3,4,5,6]).map(function(n){return objects.revealObjects['circleS' + n];});
    function updateReveal(id,val){
      objects.revealObjects[id].material.uniforms.revealed.value = Math.min(1,val);
      objects.revealObjects[id].material.uniforms.opacity.value = Math.min(1,2-val);
      objects.revealObjects[id].visible = (val > 0) && (val < 2);
    }
    function updateRevealGen(id){
      //faster version of above
      var obj = objects.revealObjects[id];
      var objR = obj.material.uniforms.revealed;
      var objO = obj.material.uniforms.opacity;
      return function(){
        objR.value = Math.min(1,this.val);
        objO.value = Math.min(1,2-this.val);
        obj.visible = (this.val > 0) && (this.val < 2);
      };

    }

    var updates = {
        camX: function() {
          camPos.x = this.val;
        },
        camZ: function() {
            camPos.z = this.val;
        },
        camY: function() {
            camPos.y = this.val;
        },
        camRotX: function() {
            camRot.x = this.val;
        },
        cam: function() {
            camPos.x = this.camX;
            camPos.y = this.camY;
            camPos.z = this.camZ;
        },
        reflect: function() {
            if (config.showMetaBalls)
              objects.metaballs.material.reflectivity = this.val;
        },
        reflectPhoto: function(){
          objects.metaballs.setPhoto(Math.round(this.val));
        },
        layout: function(){
          layoutTransitions.gotoMovieState(this.val);
        },
        forceStart: layoutTransitions.forceStart,
        highlightPoverty: function(){
          objects.backdrop.highlights.states.poverty.reveal = this.val;
            objects.backdrop.highlights.update();
        },
        highlightSecurity: function(){
          objects.backdrop.highlights.states.security.reveal = this.val;
            objects.backdrop.highlights.update();
        },
        highlightEpsilon: function(){
          var epsilon = this.val;
          objects.backdrop.highlights.circles.forEach(function(circle){
            circle.material.uniforms.epsilon.value = epsilon;
          });
        },
        lightI: function(){
          objects.pointLight.intensity = this.val * config.lightIFactor;
        },
        revealPCircles: function(){
          var val = this.val;
          pCircles.forEach(function(circle,i){
            circle.material.uniforms.revealed.value = Math.min(1,sequenceTween(val,i,pCircles.length));
            circle.material.uniforms.opacity.value = Math.min(1,2-val);
          });
        },
        revealSCircles: function(){
          var val = this.val;
          sCircles.forEach(function(circle,i){
            circle.material.uniforms.revealed.value = Math.min(1,sequenceTween(val,i,sCircles.length));
            circle.material.uniforms.opacity.value = Math.min(1,2-val);
          });
        },
        revealLowestPrice: updateRevealGen('lowestPrice'),
        revealRfp: updateRevealGen('rfp'),
        revealBidders: updateRevealGen('bidders'),
        revealWinner: updateRevealGen('winnerCircle'),
        revealBulbs: updateRevealGen('bulbs'),
        revealCurses: updateRevealGen('curses'),
        revealDothis: updateRevealGen('dothis'),
        revealResourcesNetwork: function(){
          updateReveal('moneyArms',Math.min(1,Math.max(0,this.val*4)));
          updateReveal('moneyBills',Math.min(1,Math.max(0,this.val*4 -0.1)));
          updateReveal('network',Math.min(1,Math.max(0,this.val*4 -2)));
        }




    };
    return updates;
};
