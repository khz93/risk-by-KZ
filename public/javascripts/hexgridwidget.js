/*global $, document*/
$.fn.hexGridWidget = function (radius, columns, rows, cssClass, hexy, userHover) {
	'use strict';
	var createSVG = function (tag) {
		return $(document.createElementNS('http://www.w3.org/2000/svg', tag || 'svg'));
	};
	return $(this).each(function () {
		var element = $(this),
			hexClick = function () {
				var hex = $(this);
				element.trigger($.Event('hexclick', hex.data()));
			},
			height = Math.sqrt(3) / 2 * radius,
			svgParent = createSVG('svg').attr('tabindex', 1).appendTo(element).css({
				width: (1.5 * columns + 0.5) * radius,
				height: (2 * rows + 1) * height
			}),
			column, row, center,
			toPoint = function (dx, dy) {
				return Math.round(dx + center.x) + ',' + Math.round(dy + center.y);
			};
		var iter = 0;
		for (column = 0; column < columns; column++) {
			for (row = 0; row < rows; row++) {
				var color = hexy[iter].color,
					coords = hexy[iter].coords,
					nghbrs = hexy[iter].nghbrs,
				center = {
					x: Math.round((1 + 1.5 * column) * radius),
					y: Math.round(height * (1 + row * 2 + (column % 2)))
				};
				createSVG('polygon')
					.attr({
						'id': iter,
						points: [
							toPoint(-1 * radius / 2, -1 * height),
							toPoint(radius / 2, -1 * height),
							toPoint(radius, 0),
							toPoint(radius / 2, height),
							toPoint(-1 * radius / 2, height),
							toPoint(-1 * radius, 0)
						].join(' '),
						'class': cssClass + ' ' + color,
					})
					.appendTo(svgParent)
					.data({
						_id: iter,
						color: color,
						coords: coords,
						nghbrs: nghbrs,
						owner: userHover[color]
					})
					.on('click', hexClick)
					.hover(function(event){
						$('#popup').text($(this).data('owner'))
						$('#popup').css({"position":"absolute","left":event.clientX ,"top":event.clientY }).show()
					}, function(){
						$('#popup').text('')
						$('#popup').hide();
					})
				iter++;
			}
		}
	});
};