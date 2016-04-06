module.exports= function(obj, opacity) {
	obj.material.uniforms.opacity.value = opacity;
	obj.visible = (opacity > 0.001);
};
