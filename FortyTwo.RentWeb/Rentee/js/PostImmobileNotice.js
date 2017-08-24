/// <reference path="../../js/jquery/3.2.1/jquery.js" />
/// <reference path="../../js/jquery.i18n/1.0.4/jquery.i18n.js" />
/// <reference path="../../js/jquery.i18n/1.0.4/jquery.i18n.messagestore.js" />
/// <reference path="../../js/jquery.i18n/1.0.4/jquery.i18n.emitter.bidi.js" />
/// <reference path="../../js/jquery.i18n/1.0.4/languages/he.js" />

'use strict';

function runI18n() {
	var i18n = $.i18n();

	i18n.locale = $("#ddlLanguage").val();

	var selectedLangugeName = $("#ddlLanguage option:selected").text();
	var dir = i18n.parser.emitter.strongDirFromContent(selectedLangugeName);
	$('html').attr("dir", dir);
	
	i18n.load('i18n/PostImmobileNotice.' + i18n.locale + '.json', i18n.locale).done(
		function () {
			$('body').i18n();
		});
}

function fillDistricts() {
  $.getJSON("http://boardapi.42rent.com/api/Board/GetDistricts?language=" + $.i18n().locale, function (data) {
    alert(data);
  });
}

// Enable debug
$.i18n.debug = true;

$(document).ready(function () {
	runI18n();

	$('#ddlLanguage').change(runI18n);

	fillDistricts();
});