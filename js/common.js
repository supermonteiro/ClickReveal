
var activity_data = null;

jQuery.fn.extend({
	centerLabel: function() {
		$(this).css({
			'top': 'calc(50% - '+($(this).height()/2)+'px)'
		});
	}
});

$(function ($) {		
	getData('activity_data.json');
	initListeners();
});

function initActivity() {
	var delay = .1;
	
	TweenMax.set($('.circle-ico'), {opacity: 0});
	
	$.each($('.circle-ico p'), function(index, obj){
		var icon = $(this)
			/* .html() */
			.centerLabel();
		
		TweenMax.fromTo($(this), .25, {opacity: 0}, {delay: (delay*index), opacity: 1, ease: Power2.easeOut});
		
	});
}

function getData(call_data_file) {
	$.ajax({
		url: call_data_file,
		success: function(data) {
			activity_data = data;
			initActivity();
		}})
		.fail(function() { console.log( '*** load error: call_data.json ***'); });
}

function initListeners() {
	
	$(window).on('load resize orientationchange', function (e) {
		$.each($('.circle-ico p'), function(index, obj){
			$(this).centerLabel();
		});
	});
}

function getFontColor(hex) {
	var c = c.substring(1);      // strip #
	var rgb = parseInt(c, 16);   // convert rrggbb to decimal
	var r = (rgb >> 16) & 0xff;  // extract red
	var g = (rgb >>  8) & 0xff;  // extract green
	var b = (rgb >>  0) & 0xff;  // extract blue

	var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

	if (luma < 40) {
		return '#ffffff';
	}
	else {
		return '#3d3d3d';
	}
}






	