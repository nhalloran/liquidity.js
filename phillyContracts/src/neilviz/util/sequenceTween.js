module.exports = function(tween, index, count) {
	return Math.min(1, Math.max(0, (tween * count - (index * (1 - (1 / count))))));
};
