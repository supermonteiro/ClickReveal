function createAnswers() {
	
	var iconsContainer = $('.icons-container').empty(),
		initCount = 0;
		
	$.each(activity_data.options, function(index, obj){		
		var answer = $('<div class="btn_reveal circle-ico">')
			.data({index: index, info: obj})
			.html(
				'<div class="center"><img src="'+(obj.icon)+'"></div>'+
				'<p class="label">'+obj.icon_label+'</p> </div>'
			)			
			.appendTo(iconsContainer);
	});
	
}
/*
setContent(0);

function setContent(index) {
	
		var title = $('.title-1')
			.html(activity_data.title);
		
		var question = $('.question')
			.html(activity_data.question);
		
		var instructions = $('.instructions')
			.html(activity_data.instructions);
}
*/
function initPage() {
	setTimeout(createAnswers, 2000);
}