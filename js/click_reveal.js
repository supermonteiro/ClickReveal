

var launchpad = $('.launchpad').length,
	showIndex = 0,
	showTimer;

function createTiles() {
	
	var tileContainer = $('.launchpad .tiles-container').empty(),
		initCount = 0;
		
	$.each(platform_data.launchpad, function(index, obj){
		obj.duration = Math.round(Math.random()*18)+1;
		obj.playhead = Math.round(Math.random()*100);
		
		var tile = $('<div class="tile '+index+' disabled">')
			.data({index: index, info: obj})
			.html(
				'<p class="head">'+obj.head+'</p>'+
				'<p class="percentage">'+obj.percentage+'% of calls</p>'
			)
			.css({
				opacity: 0,
				'background-image': 'url('+obj.poster+')'
			})
			.appendTo(tileContainer);
		
		if(obj.percentage.length === 0)
			tile.find('.percentage').remove();
	});
	
	$.each($('.launchpad .tile'), function(index, obj){
		TweenMax.fromTo($(this), .250, {opacity: 0}, {delay: .1*(index+2), opacity: 1, ease: Power2.easeOut, onComplete: function() {
			initCount++;
			if(initCount === platform_data.launchpad.length) {
				console.log('disabled');
				$('.launchpad .tile').toggleClass('disabled', false);
			}
		}});
		/* $(this).toggleClass('hidden', false); */
		
	});
	
	$('body').css({ 'background-color': '#005498'});
	$('html').css({ 'background-color': '#005498'});
}

function initPage() {
	setTimeout(createTiles, 500);
}

function previewDisplay(self) {
	
	var data = self.data('info'),
		dashboard = platform_data.dashboard[data.dashboard],
		slideWidth = $('.tiles-container').innerWidth() * .3333,
		slideHeight = slideWidth*(9/16),
		interval = 2*1000;
	
	var preview = $('#preview').width(slideWidth);
		preview.children('.head').html(data.head);
		
	var slideshow = preview.children('.slideshow')
		.css({
			height: slideHeight
		});
		
	var thumbs = slideshow.children('.inner')
		.empty()
		.css({
			width: slideWidth,
			height: slideHeight
		});
	
	
	$.each(dashboard, function(index, obj){
		
		var thumb = $('<img class="thumb '+index+'" src='+obj.poster+'>')
			.data({
				head: obj.head,
				duration: obj.duration,
				playhead: obj.playhead,
				summary: obj.summary
			})
			.css({
				width: slideWidth,
				left: (slideWidth*index)
			})
			.appendTo(thumbs);
	});
	
	setContent(0);
	
	preview.toggleClass('hidden', false);
	
	showTimer = setTimeout(function() {
		tweenSlideshow();
	},interval);
	
	function setContent(index) {
		var img = thumbs.children('img:eq('+index+')');
		
		var title = slideshow.children('.title')
			.html(img.data().head);
		
		
		var info = preview.children('.info-bar');
			info.find('.duration').html(img.data().duration);
			info.find('.playhead').html(img.data().playhead);
		
		var summary = preview.children('.summary')
			.html(img.data().summary);
	}
	
	function tweenSlideshow() {
		if (!preview.is(':visible')) return;
		
		showIndex = (showIndex+1)%dashboard.length;
		setContent(showIndex);
		
		var target_x = showIndex < dashboard.length ? (slideWidth*showIndex)*-1+'px' : '0px';
		
		TweenMax.set(slideshow.children('.title'), {opacity: 0});
		
		TweenMax.fromTo(slideshow.children('.title'), .5, {opacity: 0}, {opacity: 1, delay: .75, ease: Power2.easeOut});
		TweenMax.fromTo(preview.children('.info-bar > p'), .5, {opacity: 0}, {opacity: 1, delay: 0, ease: Power2.easeOut});
		TweenMax.fromTo(preview.children('.summary'), .5, {opacity: 0}, {opacity: 1, delay: 0, ease: Power2.easeOut});
		
		slideshow.tween = TweenMax.to(thumbs, .5, {left: target_x, delay: 0, ease: Power2.easeOut, onComplete: function() {
			showTimer = setTimeout(function() {
				tweenSlideshow();
			},interval);
		}});
	}
}

function previewInit(self) {
		var preview = $('#preview'),
			padding = 0,
			width = preview.outerWidth()+padding,
			height = preview.outerHeight()+padding,
			leftSide = self.offset().left,
			leftPosition = leftSide - width,
			rightSide = leftSide + self.outerWidth(),
			rightMargin =  $(document).outerWidth() - rightSide,
			top = self.offset().top//(self.offset().top + height) < $(window).height() ? self.offset().top : $(window).height() - height;
			left = rightMargin < width ? leftPosition : rightSide;
		
		preview
			.css({
				top: top,
				left: left
			})
			.toggleClass('left', (rightMargin < width))
			.toggleClass('right', (rightMargin > width));
		
		previewDisplay(self);
}

function previewKill() {
	$('#preview').toggleClass('hidden', true);
	TweenMax.set($('#preview .slideshow > .inner'), {left: 0});
	TweenMax.killAll();
	showIndex = 0;
	clearTimeout(showTimer);
}







