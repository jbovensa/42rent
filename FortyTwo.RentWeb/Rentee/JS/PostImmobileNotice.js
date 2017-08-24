'use strict';

function updateText() {
	var i18n = $.i18n();

	i18n.locale = 'he';
	i18n.load('I18N/PostImmobileNotice-' + i18n.locale + '.json', i18n.locale).done(
		function () {
			$('body').i18n();
		});
}

// Enable debug
$.i18n.debug = true;

$(document).ready(function () {
	updateText();
});