
var activity_data = null;
var correctIcons = 0;

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
	
	/* randomly re-order the icons and labels*/
	if (activity_data.randomize_options) {
		activity_data.options.sort(function(a, b){return 0.5 - Math.random()});	
	}	
	
	var iconsContainer = $('.icons-container').empty(),
			initCount = 0;
	
	var labelsContainer = $('.icons-labels-container').empty(),
			initCount = 0;
	
	var answersContainer = $('.answers-container').empty(),
			initCount = 0;
	
	$.each(activity_data.options, function(index, obj){
		/* populate icons */		
		var icons = $('<div class="btn_reveal circle-ico draggable" id="'+obj.icon_label+'">')
			.data({index: "answer"+index, info: obj})
			.html('<div class="center"><img src="'+(obj.icon)+'"><i class="grade" aria-hidden="true"></i></div></div>')		
			.appendTo(iconsContainer);
		
		var icon = $('.circle-ico:eq('+index+')');				
		icon.children('.center').css({
			'background-image': 'url('+obj.icon+')'
		});
		
		$('.draggable').draggable({
		  containment: '.main',
		  stack: '#icons div',
		  cursor: 'move',
		  revert: true
		});				
		
		/* populate labels */
		var labels = $('<div class="icons-labels"><p id="ico-label-'+(index)+'">'+obj.icon_label+'</p> </div>')			
			.appendTo(labelsContainer);
		
		/* populate answers */		
		var answers = $('<div class="answer">')
			.data({answer: index, info: obj})
			.html(
				'<div id="answer'+index+'" class="btn_reveal circle-ico-answer droppable"> <div class="center"></div> </div>' +
				'<p class="answer-description">'+obj.target_text+'</p>')			
			.appendTo(answersContainer);
		$('.droppable').droppable({
			accept: '#icons div',      		
    		drop: handleDropEvent
  		} );
		
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

function handleDropEvent( event, ui ) {
	var draggable = ui.draggable;  	
	var answerId = $(this).attr('id');	
  	var iconIndex = ui.draggable.data('index');
	
	ui.draggable.draggable( 'disable' );
    $(this).droppable( 'disable' );
	ui.draggable.position( { of: $(this), my: 'center center', at: 'center center' } );
	ui.draggable.draggable( 'option', 'revert', false );
	
	if (answerId == iconIndex) {
		ui.draggable.addClass( 'correct' ); 		
    	correctIcons++;
	} else {
		ui.draggable.addClass( 'wrong' );
	}
}

function gradeMarks() {
	$.each($('.correct'), function(index, obj) {		
		$('.correct i').addClass('fa fa-check right-mark');
		//$('.correct').removeClass('correct');
	});
	$.each($('.wrong'), function(index, obj) {
		$('.wrong i').addClass('fa fa-times wrong-mark');
	});
	
	if (correctIcons < 5) {		
		$('#retryBtn').removeClass('hidden');	
	} else {
		$('#successBtn').removeClass('hidden');
	}
	$('#submitBtn').addClass('hidden');	
}

function retry(event, ui) {
	/*
	$.each($('.ui-draggable-disabled'), function(index, obj) {				
		$('.ui-draggable-disabled').removeClass('ui-draggable-disabled');
		ui.draggable.draggable( 'option', 'revert', 'invalid' );		
	});
	
	$.each($('.ui-droppable-disabled'), function(index, obj) {				
		$('.ui-droppable-disabled').removeClass('ui-droppable-disabled');
	});
	
	$.each($('.correct'), function(index, obj) {		
		$('.correct i').removeClass('fa fa-check right-mark');
		$('.correct').removeClass('correct');
	});
	
	$.each($('.wrong'), function(index, obj) {		
		$('.wrong i').removeClass('fa fa-times wrong-mark');
		$('.wrong').removeClass('wrong');
	});
	
	correctIcons = 0;
	$('#submitBtn').removeClass('hidden');	
	$('#retryBtn').addClass('hidden');
	*/
	location.reload();
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






	