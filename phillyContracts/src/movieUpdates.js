var config = require('./config');
var sequenceTween = require('./neilviz/util/sequenceTween');

module.exports = function(params) {
    var objects = params.objects;
    var layoutTransitionsRev = params.layoutTransitionsRev;
    var layoutTransitionsPop = params.layoutTransitionsPop;
    var camPos = objects.camera.position;
    var camRot = objects.camera.rotation;



    var pCircles = ([1,2,3,4]).map(function(n){return objects.revealObjects['circleP' + n];});
    var sCircles = ([1,2,3,4,5,6]).map(function(n){return objects.revealObjects['circleS' + n];});

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
          layoutTransitionsRev.gotoMovieState(this.val);
        },
        layoutPop: function(){
          layoutTransitionsPop.gotoMovieState(this.val);
        },
        revOpacity: function(){
          objects.revDots.visible =  (this.val > 0);
          objects.metaballs.visible =  objects.revDots.visible || objects.popDots.visible ;

        },
        popOpacity: function(){
          objects.popDots.visible =  (this.val > 0);
          objects.metaballs.visible =  objects.revDots.visible || objects.popDots.visible ;

        },
  /*      forceStart: layoutTransitions.forceStart,
        highlightPoverty: function(){
          objects.backdrop.highlights.states.poverty.reveal = this.val;
            objects.backdrop.highlights.update();
        },
      */
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
        revealDashedCircle: updateRevealGen('dashedCircle'),
        revealResourcesNetwork: function(){
          objects.revealObjects.moneyArms.material.uniforms.revealed.value = Math.min(1,Math.max(0,this.val*4));
          objects.revealObjects.moneyBills.material.uniforms.revealed.value = Math.min(1,Math.max(0,this.val*4 -0.1));
          objects.revealObjects.network.material.uniforms.revealed.value = Math.min(1,Math.max(0,this.val*4 -2));

          objects.revealObjects.moneyArms.visible = this.val <= 1;
          objects.revealObjects.moneyBills.visible = this.val <= 1;
          objects.revealObjects.network.visible = this.val <= 1;

        }




    };
    return updates;
};
