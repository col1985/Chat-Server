/*
 * Author:  Colum Bennett 
 * Name: CK- Chat Server clinet-main.js
 */


/*
 * Chat Toolbar jQuery Styling
 */
$(document).ready(function()
{
	// Hide all the tooltips
	$("#toolbar li").each(function() {
		$("a strong", this).css("opacity", "0");
	});
	
	$("#toolbar li").hover(function() { // Mouse over
		$(this)
			.stop().fadeTo(500, 1)
			.siblings().stop().fadeTo(500, 0.4);
			
		$("a strong", this)
			.stop()
			.animate({
				opacity: 1,
				top: "-10px"
			}, 300);
		
	}, function() { // Mouse out
		$(this)
			.stop().fadeTo(500, 1)
			.siblings().stop().fadeTo(500, 1);
			
		$("a strong", this)
			.stop()
			.animate({
				opacity: 0,
				top: "-1px"
			}, 300);
	});
	
	// Show users menu
	$("#server-btn").click(function() {
		$("#main").toggleClass("use-sidebar");
	});	
	
	// Refresh Client browser from cache, place true as argument to reload from server
	$("#refresh-btn").click(function() {
		window.reload();
	});

});

/*
 * Show Users 
 */
 
