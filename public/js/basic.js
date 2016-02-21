var height = $(window).height();
var width = $(window).width();

_checkIE();

function _checkIE() {
	var browser = navigator.appName;
	var b_version = navigator.appVersion;
	if (b_version.indexOf(';') == -1) {
		return false;
	}
	var version = b_version.split(";");
	var trim_Version = version[1].replace(/[ ]/g, "");
	if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
		//alert("IE 6.0"); 
		_showNotAllow();
	} else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
		//alert("IE 7.0"); window.location.href="http://xxxx.com";
		_showNotAllow();
	} else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
		//alert("IE 8.0"); 
		_showNotAllow();
	} else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
		//alert("IE 9.0"); 
		_showNotAllow();
	} else {
		//your code goes here
	}
}

function _showNotAllow() {
	alert("对不起，您的浏览器版本过低，请升级IE或改用其他浏览器访问！");
	window.location = "/page/ieupdate.html";
}

function toLocation(page) {
	window.location = page;
}

var url = window.location.href;

$(function() {
	/*
	$('nav ul li:eq(4),nav ul li:eq(5)').bind('click', function() {
		if ($(this).find('dl').css('display') == 'none') {
			$(this).find('dl').show();
		} else {
			$(this).find('dl').hide();
		}
	});
	*/
	computerByRatio();
	$('.select').select2();
});

window.onresize = function () {
	width = $(window).width();
	height = $(window).height();
	computerByRatio();
}

function computerByRatio(){
	$('.table').css('width',width - 190 - 50);
	$('.div_auto').css('width',width - 190 - 40).css('height',height - 55 - 60);
	$('.div_auto_short').css('width',width - 190 - 40).css('height',height - 55 - 260);
}