var config = require('./config');

module.exports = function(params) {
    var objects = params.objects;
    var layoutTransitions = params.layoutTransitions;
    var camPos = objects.camera.position;
    var camRot = objects.camera.rotation;

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
        }




    };
    return updates;
};
