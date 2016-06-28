module.exports = function(params) {
    var objects = params.objects;
    var layoutTransitions = params.layoutTransitions;
    var camPos = objects.camera.position;

    var updates = {
        camZ: function() {
            camPos.z = this.val;
        },
        cam: function() {
            camPos.z = this.camX;
            camPos.y = this.camY;
            camPos.z = this.camZ;
        },
        layout: function(){
          layoutTransitions.gotoMovieState(this.val);
        },
        forceStart: layoutTransitions.forceStart




    };
    return updates;
};
