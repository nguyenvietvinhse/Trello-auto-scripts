// ==UserScript==
// @name        Trello
// @namespace   Trello
// @description User
// @include     https://trello.com/*
// @version     1
// @grant       none
// ==/UserScript==

$(window).load(function () {
	var d = new Date();
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	str = monthNames[d.getMonth()]+pad(d.getDate());
	unveil();
	imbue();
	console.log("Trello has been imbued with super power!");

	$( document ).ajaxComplete(function( event, xhr, settings ) {
		setTimeout(function () { 
			if(xhr && xhr.responseJSON && xhr.responseJSON.idShort) {
				$("span.card-short-id:contains('# ')").text('#'+xhr.responseJSON.idShort+ ' ');
			}
			unveil();
			imbue();
			if(settings && settings.url && settings.url == "/1/cards") {
				fillText();
			}
		}, 100);
	});

	function pad(num) { var str = num+''; if(num.length == 1) num='0'+num; return num; }

	// Fill text to textarea
	function fillText()  { 
		setTimeout(function () {
			$(".list-card-composer-textarea").text("["+str+"] ");
		}, 100); 
	}

	// reveal card ID 
	function unveil() {
		$('.card-short-id').removeClass("hide"); 
	}

	// Assign auto add string event for "Add a card" button
	function imbue() {
		var count = 0;
		var waitForAjaxFinishLoading = setInterval(function() {
			if($(".list-card-composer-textarea")) {
				fillText();
				$(".open-card-composer").on('click',fillText);
				if ($(".open-card-composer").length > 0) {
					var clickEvents = $._data($(".open-card-composer").get(0), "events").click;
					if(clickEvents.length > 1) {
						$(".open-card-composer").unbind("click");
						$(".open-card-composer").on('click',fillText);
					}
				}
				clearInterval(waitForAjaxFinishLoading);
			} else if (count > 100) {
				console.log("It's been too long, I'm off. Sorry, guys!");
				clearInterval(waitForAjaxFinishLoading);
			}
			count++;
		}, 200)
	}
})