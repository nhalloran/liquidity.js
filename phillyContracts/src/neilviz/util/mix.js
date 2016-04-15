module.exports = function(val1, val2, blend) {
	//modeled after glsl mix function
	blend = Math.min(1, Math.max(0, blend));
	return val1 + (val2 - val1) * blend;
};
