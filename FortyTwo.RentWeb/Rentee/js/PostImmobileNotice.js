'use strict';

function runI18n() {
	var i18n = $.i18n();

	i18n.locale = $("#ddlLanguage").val();

	i18n.load('I18N/PostImmobileNotice.' + i18n.locale + '.json', i18n.locale).done(
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