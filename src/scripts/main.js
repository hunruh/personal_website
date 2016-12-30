//function thanks to: http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
function isScrolledIntoView(elem) {
    var doc_view_top = $(window).scrollTop();
    var doc_view_bottom = doc_view_top + $(window).height();

    var elem_top = $(elem).offset().top;
    var elem_bottom = elem_top + $(elem).height();

    return ((elem_bottom <= doc_view_bottom) && (elem_top >= doc_view_top));
}

function adjustStats() {
	var init_state = $('.stat-icon').first().css("display");
	var flags = 0;
	var total = 0;
	$('.stat').each( function() {
		total += 1;
		var req_width = $(this).children('.stat-hdr').width() + $(this).children('.stat-num').width() + 98;
		if (req_width > $(this).width() && init_state === "block") {
			$('.stat').each( function() {
				$(this).children('.stat-icon').css("display", "none");
				$(this).children('.stat-hdr').css("float", "none");
				$(this).children('.stat-hdr').css("padding-left", "0px");
				$(this).children('.stat-hdr').css("padding-right", "0px");
				$(this).children('.stat-num').css("float", "none");
				$(this).children('.stat-num').css("right", "0px");
			});
			
			return false;
		}
		else if (req_width <= $(this).width() && init_state === "none")
			flags += 1;
	});

	//all must be able to display the image in order to trigger a display
	if (flags > 0 && flags == total) {
		$('.stat').each( function() {
			$(this).children('.stat-icon').css("display", "block");
			$(this).children('.stat-hdr').css("float", "left");
			$(this).children('.stat-hdr').css("padding-left", "10px");
			$(this).children('.stat-hdr').css("padding-right", "20px");
			$(this).children('.stat-num').css("float", "right");
			$(this).children('.stat-num').css("right", "10px");
		});
	}
}

function loadSkills() {
	$('.skill-pnts').each( function() {
		if (isScrolledIntoView(this) && $(this).attr("data-visible") === "false") {
			$(this).attr("data-visible", "true");
			var delay_ctr = 0;
			$(this).children().each( function() {
				$(this).delay(delay_ctr).fadeTo(100, 1);
				delay_ctr += 100;
			});
		}
	});

	$('.stat-num').each( function() {
		if (isScrolledIntoView(this) && $(this).attr("data-visible") === "false") {
			$(this).attr("data-visible", "true");
			var num = 0;
			var sep = '';
			var suffix = '';
			var value = $(this).data("val").toString();

			if (value.endsWith('+')) {
				suffix = '+'
				num = parseInt(value.substr(0, value.length - 1));
			}
			else
				num = parseInt(value)

			if (num > 999)
				sep = ','

			var comma_step = $.animateNumber.numberStepFactories.separator(sep, 3, suffix);	
			$(this).animateNumber({ number: num, numberStep: comma_step }, 1000);
		}
	});
}

$(document).ready( function() {
	$('.skill-pnts').each( function() {
		$(this).attr("data-visible", "false");
		var totalpnts = $(this).data("val");
		for (i = 0; i < 10; i++) {
			if (i < totalpnts)
				$(this).append('<span class="pnt"></span>');
			else
				$(this).append('<span class="no-pnt"></span>');
		}
	});

	//end pre-load

	loadSkills();
	adjustStats();
	if($(document).scrollTop() >= $('#about').position().top - $('header').height() - 2)
		$('header').slideDown(200);

	$('.hamburger').click(function() {
		if($(this).hasClass('is-active')) {
			$(this).removeClass('is-active');
			$('#watermark').slideDown(200);
			$('#nav-links').slideUp(200);
		}
		else {
			$(this).addClass('is-active');
			$('#watermark').slideUp(200);
			$('#nav-links').slideDown(200);
		}
	});
	$('#inquiry-submit').click(function() {
			$('#inquiry-notify').slideDown();
	});
	$('.nav-button').click(function() {
		var offset = $('header').height();
		if($(window).width() < 550) {
			$('#nav-links').slideUp(200);
			$('#watermark').slideDown(200);
			offset = 60;
		}
		$('html,body').animate({scrollTop:$('#' + $(this).data("href")).position().top - offset}, 'slow');
		$('.hamburger').removeClass('is-active');
	});
	$('.project').click(function() {
		$('#project-grid').slideUp();
		$('#' + $(this).data("id")).slideDown();
	});
	$('.return').click(function() {
		$(this).parent().slideUp();
		$('#project-grid').slideDown();
	});

	$(window).on('scroll',function(event){
		loadSkills();

		$('.hdr-nav').each( function() {
			$(this).css("color", "#595959");
		});
		if($(document).scrollTop() > $('#contact').position().top - $('header').height() - 2) {
			$('#nav-contact').css("color", "#FE7676");
		}
		else if($(document).scrollTop() > $('#projects').position().top - $('header').height() - 2) {
			$('#nav-projects').css("color", "#FE7676");
		}
		else if($(document).scrollTop() > $('#work').position().top - $('header').height() - 2) {
			$('#nav-work').css("color", "#FE7676");
		}
		else if($(document).scrollTop() > $('#about').position().top - $('header').height() - 2) {
			$('#nav-about').css("color", "#FE7676");
		}

		var offset = 39;
		if($(window).width() < 550)
			offset = 60;
		if($(document).scrollTop() >= $('#about').position().top - offset - 2)
			$('header').slideDown(200);
		else
			$('header').slideUp(200);
	});

	$(window).resize(function() {
		adjustStats();

		if($(window).width() < 550) {
			if(!$('.hamburger').hasClass('is-active'))
				$('#nav-links').css("display", "none");
		}
		else {
			$('#nav-links').css("display", "block");
			$('#watermark').css("display", "block");
			$('.hamburger').removeClass('is-active');
		}
	});
});