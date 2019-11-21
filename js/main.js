/* ===================================
--------------------------------------
  ProxyStrike HTML Template
  Version: 1.0
  Author: Shamim Hossain
  Email: hossains159@gmaill.com
  Facebook: facebook.com/shamscorner
--------------------------------------
======================================*/

"use strict";

$(window).on("load", function() {
  /*------------------
		Preloder
	--------------------*/
  $(".loader").fadeOut();
  $("#preloder")
    .delay(400)
    .fadeOut("slow");
});

(function($) {
  Circle(".round");
})(jQuery);

function Circle(el) {
  $(el)
    .circleProgress({
      size: 80,
      fill: { color: "#ff5c5c" }
    })
    .on("circle-animation-progress", function(event, progress, stepValue) {
      $(this)
        .find("strong")
        .text(String(stepValue.toFixed(2)).substr(2) + "%");
    });
}
