var config = require('./config');
var sequenceTween = require('./neilviz/util/sequenceTween');

module.exports = function(params) {
    var objects = params.objects;
    var layoutTransitions = params.layoutTransitions;
    var camPos = objects.camera.position;
    var camRot = objects.camera.rotation;



    var pCircles = ([1,2,3,4]).map(function(n){return objects.revealObjects['circleP' + n];});
    var sCircles = ([1,2,3,4,5,6]).map(function(n){return objects.revealObjects['circleS' + n];});

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
        revealLowestPrice: function(){
          objects.revealObjects.lowestPrice.material.uniforms.revealed.value = this.val;
        },
        revealRfp: function(){
          objects.revealObjects.rfp.material.uniforms.revealed.value = this.val;
        },
        revealBidders: function(){
          objects.revealObjects.bidders.material.uniforms.revealed.value = this.val;
        },
        revealWinner: function(){
          objects.revealObjects.winnerCircle.material.uniforms.revealed.value = Math.min(1,this.val);
          objects.revealObjects.winnerCircle.material.uniforms.opacity.value = Math.min(1,2-this.val);
        },
        revealBulbs: function(){
          objects.revealObjects.bulbs.material.uniforms.revealed.value = Math.min(1,this.val);
          objects.revealObjects.bulbs.material.uniforms.opacity.value = Math.min(1,2-this.val);
        },
        revealCurses: function(){
          objects.revealObjects.curses.material.uniforms.revealed.value = Math.min(1,this.val);
          objects.revealObjects.curses.material.uniforms.opacity.value = Math.min(1,2-this.val);
        },
        revealDothis: function(){
          objects.revealObjects.dothis.material.uniforms.revealed.value = Math.min(1,this.val);
          objects.revealObjects.dothis.material.uniforms.opacity.value = Math.min(1,2-this.val);
        }




    };
    return updates;
};
