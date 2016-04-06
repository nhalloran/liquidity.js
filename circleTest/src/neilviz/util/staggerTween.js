
//could make faster with a precalc
module.exports = function(tween, index, count, staggerRatio) {
	var preScaleTotal = 1 + ((count - 1) * staggerRatio);
	return Math.min(1, Math.max(0, (tween * preScaleTotal - (index * staggerRatio))));
};
