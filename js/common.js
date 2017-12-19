
var activity_data = null;
var data_answers = null;
var correctIcons = 0;
var primary_color = null,
	border_color_1= null,
	border_color_2= null,
	accent_color_1 = null,
	accent_color_2 = null;

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
	
	/* dinamically colored buttons */
	primary_color = activity_data.primary_color;
	border_color_1 = activity_data.border_color_1;
	border_color_2 = activity_data.border_color_2;
	accent_color_1 = activity_data.accent_color_1;	
	accent_color_2 = activity_data.accent_color_2;
	
	$(".btn").css({
		'background': primary_color			
	});
							
	$(".btn").bind('mouseover', function() {		
		$(this)[0].style.backgroundColor = accent_color_2;

		$(".btn").bind('mouseout', function () {
			$(this)[0].style.backgroundColor = primary_color;
        });
	});	
	
	css().bind(".title-1", {	
		"color": accent_color_1			
	});
	
	css().bind(".instructions", {	
		"color": accent_color_1			
	});
	
	css().bind(".circle-ico", {	  
	  "background-color" : border_color_1
	});
	
	css().bind(".circle-ico:hover", {	  
	  "background-color" : border_color_2
	});
	
	css().bind(".circle-ico .center", {	  
	  "background-color" : primary_color
	});
	
	css().bind(".circle-ico:hover .center ", {
        "background-color" : accent_color_2
    });
	
	css().bind(".circle-ico-answer:hover", {	  
	  "border-color" : accent_color_2
	});
	
	css().bind(".icons-labels", {	  
	  "color" : primary_color
	});
	
	css().bind(".right-mark", {	  
	  "border-color" : primary_color
	});
	
	css().bind(".wrong-mark", {	  
	  "border-color" : primary_color
	});
	
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
		var answerCode = null;
		switch(obj.icon_label) {
			case "Floors":
				answerCode = "answer0"
				break;
			case "Trash":
				answerCode = "answer1"
				break;
			case "Bathrooms":
				answerCode = "answer2"
				break;
			case "Windows":
				answerCode = "answer3"
				break;
			case "Tables":
				answerCode = "answer4"
				break;
			default:
				answerCode = 0
		} 
		
		var icons = $('<div class="circle-ghost-ico"> </div><div class="btn_reveal circle-ico draggable" id="'+obj.icon_label+'">')
			.data({index: answerCode, info: obj})
			.html('<div class="center"><i class="grade" aria-hidden="true"></i></div>')		
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
									
		TweenMax.fromTo(icon, .25, {opacity: 0}, {delay: (delay*index), opacity: 1, ease: Power2.easeOut});
	});
		
	$.each(data_answers, function(index, obj){				
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
  		});
	});
		
	$('.title-1').html(activity_data.title);
	$('.question').html(activity_data.question);
	$('.instructions').html(activity_data.instructions);
	
	if (activity_data.allow_reset) {
		$('#resetBtn').removeClass('hidden');
		$('#resetBtnDis').addClass('hidden');
	}
	
}

function getData(call_data_file) {
	$.ajax({
		url: call_data_file,
		success: function(data) {
			activity_data = data;
			data_answers = activity_data.options.slice().sort();
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






	