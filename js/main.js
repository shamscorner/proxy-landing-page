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


(function($) {
  // initiate everything for the circular progressbar
  Circle(".round");

  // select order and update list of proxies
  $("#selectOrder").change(function() {
    // get the selected order id
    var selectedOrder = $(this)
      .children("option:selected")
      .val();
    //alert("selected order: " + selectedOrder);

    // get the proxies list
    // updateListProxies($(".list-proxies"), ["a", "b", "c"]);
    console.log($(this).children("option:selected").attr('id'))
    loadDom($(this).children("option:selected").attr('id'))
  });
})(jQuery);

// for the circular progressbar
function Circle(el,value) {
  $(el)
  .circleProgress({
  value: value,
  size: 80,
  fill: { color: "#ff5c5c" }
  })
  .on("circle-animation-progress", function(event, progress, stepValue) {
    var val = "";
    if (stepValue == 0 || stepValue == 1) {
    val = String(stepValue);
    } else {
    val = String(stepValue.toFixed(2)).substr(2);
    }
    
    $(this)
    .find("strong")
    //.text(String(stepValue.toFixed(2)).substr(2) + "%");
    .text(val + "%");
    });
    }
// update the proxies list items
function updateListProxies(el, orders) {
  el.html("<li>" + orders[0] + "</li>");

  for (var i = 1; i < orders.length; i++) {
    el.append("<li>" + orders[i] + "</li>");
  }
}


