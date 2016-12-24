//function thanks to: http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
function isScrolledIntoView(elem) {
    var doc_view_top = $(window).scrollTop();
    var doc_view_bottom = doc_view_top + $(window).height();

    var elem_top = $(elem).offset().top;
    var elem_bottom = elem_top + $(elem).height();

    return ((elem_bottom <= doc_view_bottom) && (elem_top >= doc_view_top));
}

function loadSkills() {
	$('.skill-pnts').each( function() {
		if (isScrolledIntoView(this) && $(this).attr("data-visible") === "false") {
			$(this).attr("data-visible", "true");
			var delay_ctr = 0;
			$(this).children().each( function() {
				$(this).delay(delay_ctr).fadeTo(400, 1);
				delay_ctr += 50;
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

	jQuery(window).on('scroll',function(event){
		loadSkills();
	});

	jQuery(window).resize(function() {
		var init_state = $('.stat-icon').first().css("display");
		var flags = 0;
		var total = 0;
		$('.stat').each( function() {
			total += 1;
			var req_width = $(this).children('.stat-hdr').width() + $(this).children('.stat-num').width() + 88;
			if (req_width > $(this).width() && init_state === "block") {
				$('.stat').each( function() {
					$(this).children('.stat-icon').css("display", "none");
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
			});
		}
	});
});