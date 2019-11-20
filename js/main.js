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
  /*------------------
		pricing plan section
  --------------------*/
  const pricingData = {
    monthly: {
      starter: {
        gigabyte: 2,
        amount: 32
      },
      growth: {
        gigabyte: 5,
        amount: 68
      },
      pro: {
        gigabyte: 10,
        amount: 112
      }
    },
    annually: {
      starter: {
        gigabyte: 25,
        amount: 250
      },
      growth: {
        gigabyte: 50,
        amount: 435
      },
      pro: {
        gigabyte: 100,
        amount: 590
      }
    }
  };

  // by default monthly is checked
  checkInitial($("#monthly"));
  moveEarchIcon($("#switch-image"), "left");

  // when monthly planned
  $("#monthly").click(function() {
    //alert("monthly");
    var elem = $("#monthly");
    removeInitial($("#annually"));
    checkInitial(elem);
    // move the earth icon to left
    moveEarchIcon($("#switch-image"), "left");
    // update the ui
    updatePricingUi(pricingData.monthly, "month");
  });

  // when annually planned
  $("#annually").click(function() {
    //alert("annually");
    var elem = $("#annually");
    removeInitial($("#monthly"));
    checkInitial(elem);
    // move the earth icon to right
    moveEarchIcon($("#switch-image"), "right");
    // update the ui
    updatePricingUi(pricingData.annually, "year");
  });
})(jQuery);

function moveEarchIcon(element, position) {
  element.css("margin", 0);
  element.css("margin-" + position, -15);
}
function checkInitial(element) {
  element.css("color", "#008fc3");
}
function removeInitial(element) {
  element.css("color", "#f1f1f1");
}
function updatePricingUi(data, type) {
  // for the starter pack
  $("#starter-usage").text(data.starter.gigabyte + " Gigabytes / " + type);
  $("#starter-amount").text("$" + data.starter.amount);
  // for the growth pack
  $("#growth-usage").text(data.growth.gigabyte + " Gigabytes / " + type);
  $("#growth-amount").text("$" + data.growth.amount);
  // for the pro pack
  $("#pro-usage").text(data.pro.gigabyte + " Gigabytes / " + type);
  $("#pro-amount").text("$" + data.pro.amount);
  if (type == "year") {
    $(".billed").text("Billed Annually");
  } else {
    $(".billed").text("Billed Monthly");
  }
}
