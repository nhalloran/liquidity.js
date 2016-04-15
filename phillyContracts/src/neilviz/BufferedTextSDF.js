var extend = require('./util/extend');
var SDFMaterial = require('./SDFMaterial');
var BufferedPlanesGeometry = require('./BufferedPlanesGeometry');
var defaultFont = require('./textSpriteFont_AndoBold256.js');
var highRezFont = require('./textSpriteFont_AndoBold512.js');
var THREE = require('three');




var textures = {
  fontMapAndoBold: THREE.ImageUtils.loadTexture('/textures/ando_bold_256.png'),
  fontMapAndoBoldHighRez: THREE.ImageUtils.loadTexture('/textures/ando_bold_512.png')

};


var BufferedTextSDF = function(params){
// extends BufferedSprites
	params = extend({
		items : [{text:''}],
		fontSize : 5,
		color : 0xffffff,
		billboard: false,  // don't understand this
	},params) ;



  // TODO: font should be changed to parameter
	this.font = (params.highRez) ? highRezFont : defaultFont;

	this.fontSize = params.fontSize;
	this.letterSpacing = params.letterSpacing || 0;
	this.wordSpacing = params.wordSpacing || 0;
	this.color = params.color;
	this.items = params.items;





	this.fontScale = 1 / this.font.textureAtlasInfo.width *  6;

	var count = 0;


	this.items.forEach(function(item){
		if (item.text !== undefined) count += item.text.length;
	});





	var atlasParams = {};
	atlasParams.count = 5;
	atlasParams.uvs = [];

    for (var n = 0; n < atlasParams.count; n++){
		atlasParams.uvs.push([0,0,1,0,1,1,0,1]);
	}


  var material = new SDFMaterial({
    map:textures[this.font.textureId],
    epsilon:this.font.epsilon,
    color: this.color

  });



  var geometry = new BufferedPlanesGeometry({
    count: count

  });



	/*
  params = extend({},params, {
		count:count,
		texture: textures[this.font.textureId],
			//OBWW2.textures.fontMapAndoBoldHighRez
		//	: OBWW2.textures.fontMapAndoBold,
		initialPositionSet: new Float32Array(count * 3),
		amountDrawn:1, size:[1,1], color: this.color,
		atlas:true, atlasParams: atlasParams,
		SDF: true,
		epsilon:this.font.epsilon
		});

  */

	THREE.Mesh.call(this,geometry, material);



	this.setText();







};

BufferedTextSDF.prototype = Object.create( THREE.Mesh.prototype );

BufferedTextSDF.prototype.setText = function(){
	var width, index = 0;
	this.maxItemWidth = 0;
	for (var i = 0; i < this.items.length; i++){
		if(this.items[i].text !== undefined){
			var size  = this.getItemSize(this.items[i]);
			shiftX = 0;
			if (this.items[i].align === undefined || this.items[i].align.toLowerCase() === 'center' )
				shiftX = size.width * -0.5 ;
			width = this.setTextItem(this.items[i], index, shiftX, size.height * -0.5 );
			this.maxItemWidth = Math.max(width, this.maxItemWidth);
			index += this.items[i].text.length;
		}
	}
	for (i = index; i < this.count; i++){
    // make rest invisible?
		//this.geometry.renderSinglePositions(i,0,0);
	}

	this.geometry.attributes.uv.needsUpdate = true;
//	this.geometry.attributes.offset.needsUpdate = true;
	this.geometry.attributes.position.needsUpdate = true;
//	this.geometry.attributes.indivOpacity.needsUpdate = true;


};



BufferedTextSDF.prototype.setTextItem = function(item, startIndex, startX, startY){

	var dx = 0;
	var dy = 0;
	var sx = (startX !== undefined) ? startX : 0; //start?
	var sy = (startY !== undefined) ? startY : 0; //start?
	var sz = 0; //start?

	if (item.y !== undefined) sy += item.y;
	if (item.x !== undefined) sx += item.x;

	var opacity = (item.opacity !== undefined) ? item.opacity : 1;




	var fontSize = (item.fontSize !== undefined) ? item.fontSize : this.fontSize;

	fontSize *= this.fontScale;


	for (var i = 0; i < item.text.length; i++){


		var character = item.text[ i ];

		var ascii = character.charCodeAt( 0 );
		var glyphInfo = this.font.chars[ ascii ];

		// add empty space for glyphs which are not supported in the font

		if ( glyphInfo === undefined ) {

			dx += base * fontSize;
			lastCharacter = character;

      //make invisible..
      //this.geometry.renderSinglePositions(startIndex + i,0,0);


			continue;

		}

		// move to a new line if word's bounding box would go over the lineLength

		var spriteWidth = glyphInfo.width * fontSize;
		var spriteHeight = glyphInfo.height * fontSize;

		var xadvance = glyphInfo.xadvance * fontSize ;
		var xoffset  = glyphInfo.xoffset * fontSize;
		var yoffset  = glyphInfo.yoffset * fontSize;

		var x = sx + 0.5 * spriteWidth  + dx + xoffset;
		var y = sy + 0.5 * spriteHeight + dy + yoffset - spriteHeight;
		var z = sz;

	//	 + i

    //this.setSpritePosition( startIndex + i, x, y, z );
    //this.geometry.renderSinglePositions(startIndex + i, x, y, z); //

		this.setCharacterGeometry( startIndex + i, glyphInfo, this.font.textureAtlasInfo, fontSize,x,y,z);
		//this.setSpriteOpacity( startIndex + i, opacity);

		dx += xadvance + this.letterSpacing;
    if (character === ' ') dx += this.wordSpacing;
	}

	return dx;
}

BufferedTextSDF.prototype.getItemSize = function(item){

	var fontSize = (item.fontSize !== undefined) ? item.fontSize : this.fontSize;
	var size = {width:0, height:fontSize};

	fontSize *= this.fontScale;

	for (var i = 0; i < item.text.length; i++){

		var character = item.text[ i ];

		var ascii = character.charCodeAt( 0 );
		var glyphInfo = this.font.chars[ ascii ];


		if ( glyphInfo !== undefined ) {
			size.width += glyphInfo.xadvance * fontSize + this.letterSpacing;
		}else {
			size.width += this.font.textureAtlasInfo.base * fontSize + this.letterSpacing;
		}


	}

  size.width -= this.letterSpacing;
	return size;

};



BufferedTextSDF.prototype.setCharacterGeometry = function (index, t, a, fontSize,x,y,z) {
    var r = a.width,
        i = a.height,
        o = (a.base, t.width),
        n = t.height,
        s = t.x,
        l = t.y,
        h = s / r,
        d = (i - l) / i,
        c = (s + o) / r,
        u = (i - (l + n)) / i,
        f = (s + o) / r,
        p = (i - l) / i,
        m = s / r,
        v = (i - (l + n)) / i,
        g = o,
        S = n,
        G = fontSize, //x[y],
        M = fontSize; //x[y + 1];
        G = g * G, M = S * M;

    this.setSpriteUV(index, m, v, h, d, c, u, f, p);
    this.geometry.renderSinglePositionAndScale(index,x,y,z,G, M);
    //this.geometry.renderSinglePositions(index,{x:x,y:y,z:z},20);
    //this.geometry.renderSinglePositions(index,{x:0,y:0,z:0},20);
};

BufferedTextSDF.prototype.setSpriteScale = function (e, t, a) {
    var r = this.geometry.attributes.position.array,
        i = 12 * e;
    r[i] = t*-.5, r[i + 1] = a*-.5, r[i + 3] = t*.5, r[i + 4] = a*-.5, r[i + 6] = t*.5, r[i + 7] = a*.5, r[i + 9] = t*-.5, r[i + 10] = a*.5
};
BufferedTextSDF.prototype.setSpriteUV_ = function (e, t, a, r, i, o, n, s, l) {
    var h = this.geometry.attributes.uv.array,
        d = 8 * e;
    h[d] = t, h[d + 1] = a, h[d + 2] = o, h[d + 3] = n, h[d + 4] = s, h[d + 5] = l, h[d + 6] = r, h[d + 7] = i;

};
BufferedTextSDF.prototype.setSpriteUV = function (index, x0, y3, x3, y2, x1, y1, x2, y0) {
    var h = this.geometry.attributes.uv.array,
        d = 8 * index;
    h[d] = x0, h[d + 1] = y0, h[d + 2] = x2, h[d + 3] = y2, h[d + 4] = x3, h[d + 5] = y3, h[d + 6] = x1, h[d + 7] = y1;

};
BufferedTextSDF.prototype.setSpriteOpacity = function (index, opacity) {
    var h = this.geometry.attributes.indivOpacity.array,
        i = 4 * index;
    h[i] = opacity, h[i + 1] = opacity, h[i + 2] = opacity, h[i + 3] = opacity;
};
BufferedTextSDF.prototype.setSpritePosition = function (e, t, a, r) {
    var i = this.geometry.attributes.offset.array,
        o = 12 * e;
    i[o] = t, i[o + 1] = a, i[o + 2] = r, i[o + 3] = t, i[o + 4] = a, i[o + 5] = r, i[o + 6] = t, i[o + 7] = a, i[o + 8] = r, i[o + 9] = t, i[o + 10] = a, i[o + 11] = r;
};




module.exports = BufferedTextSDF;
