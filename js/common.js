
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
	activity_data.options.sort(function(a, b){return 0.5 - Math.random()});
	
	$.each(activity_data.options, function(index, obj){
		var icon = $('.circle-ico:eq('+index+')');
		var label = $('#ico-label-'+index).html(obj.icon_label);
		icon.children('.center').css({
			'background-image': 'url('+obj.icon+')'
		});
		var answer = $('#answer-'+index)
		.data({index: index, info: obj})
		.html(
			'<div class="btn_reveal circle-ico-answer"> <div class="center"></div> </div>' +
			'<p class="answer-description">'+obj.target_text+'</p>'
		);
		TweenMax.fromTo(icon, .25, {opacity: 0}, {delay: (delay*index), opacity: 1, ease: Power2.easeOut});
	});
	
	$('.title-1').html(activity_data.title);
	$('.question').html(activity_data.question);
	$('.instructions').html(activity_data.instructions);
	
	if (!activity_data.allow_reset) {
		$('.btn-reset').removeClass('btn_reveal');
		$('.btn-reset').addClass('disabled');
	} else {
		$('.btn-reset').removeClass('disabled');
		$('.btn-reset').addClass('btn_reveal');
	}
	
	/* code for dinamic icons
		var icon = $('<div class="combo">')
			.data({index: index, info: obj})
			.html(
				'<div class="btn_reveal circle-ico " id="ico-label-'+(index+1)+'">'+
				'<div class="center"><img src="'+(obj.icon)+'"></div></div> '+
				'<div class="icons-labels"><p id="ico-label-'+(index+1)+'">'+obj.icon_label+'</p> </div>'
			)			
			.appendTo(iconsContainer);
		
		var labels = $()			
			.appendTo(iconsContainer);
		*/
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
		$.each($('.icons-labels'), function(index, obj){
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






	