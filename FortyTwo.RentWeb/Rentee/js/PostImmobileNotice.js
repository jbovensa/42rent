/// <reference path="../../js/jquery/3.2.1/jquery.js" />
/// <reference path="../../js/i18n/1.0.4/jquery.i18n.js" />
/// <reference path="../../js/i18n/1.0.4/jquery.i18n.messagestore.js" />
/// <reference path="../../js/i18n/1.0.4/languages/he.js" />
/// <reference path="../../js/i18n/1.0.4/jquery.i18n.parser.js" />
/// <reference path="../../js/i18n/1.0.4/jquery.i18n.language.js" />
/// <reference path="../../js/i18n/1.0.4/jquery.i18n.fallbacks.js" />
/// <reference path="../../js/i18n/1.0.4/jquery.i18n.emitter.js" />
/// <reference path="../../js/i18n/1.0.4/jquery.i18n.emitter.bidi.js" />

'use strict';

function runI18n() {
	var i18n = $.i18n();

	i18n.locale = $("#ddlLanguage").val();
	
	i18n.load('i18n/PostImmobileNotice.' + i18n.locale + '.json', i18n.locale).done(
		function () {
			$('body').i18n();
		});
}

// Enable debug
$.i18n.debug = true;

$(document).ready(function () {
	runI18n();

	$('#ddlLanguage').change(runI18n);
});