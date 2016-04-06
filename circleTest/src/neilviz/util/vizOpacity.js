module.exports =  function(obj, opacity) {
	obj.material.opacity = opacity;
	obj.visible = (opacity > 0.001);
};
