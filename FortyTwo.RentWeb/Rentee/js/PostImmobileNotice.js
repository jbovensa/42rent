/// <reference path="../../js/jquery/2.2.4/jquery.js" />
/// <reference path="../../js/jquery-ui/1.12.1/jquery-ui.js" />
/// <reference path="../../js/jquery.i18n/1.0.4/jquery.i18n.js" />
/// <reference path="../../js/jquery.i18n/1.0.4/jquery.i18n.messagestore.js" />
/// <reference path="../../js/jquery.i18n/1.0.4/jquery.i18n.emitter.bidi.js" />
/// <reference path="../../js/jquery.i18n/1.0.4/languages/he.js" />

"use strict";

function runI18n() {
	var i18n = $.i18n();

	i18n.locale = $("#ddlLanguage").val();

	// Set html direction by language
	var selectedLangugeName = $("#ddlLanguage option:selected").text();
	var dir = i18n.parser.emitter.strongDirFromContent(selectedLangugeName);
	$("html").attr("dir", dir);
	
	// Load localization file
	i18n.load("i18n/PostImmobileNotice." + i18n.locale + ".json", i18n.locale).done(
		function () {
			$("html").i18n();
		});

	fillDistricts();
}

function fillDistricts() {

	var $ddlDistrict = $("#ddlDistrict");

	$.getJSON("/api/Board/GetDistricts?language=" + $.i18n().locale, function (districts) {

		var districtItems = $.map(districts, function (el) {
			return { value: el.DistrictID, label: el.Name };
		});

		// Init Districts DDL
		$ddlDistrict.autocomplete({
			source: districtItems,
			minLength: 0,
			select: function (event, ui) {
				// Set hidden field value by selection
				event.preventDefault();
				$ddlDistrict.val(ui.item.label);
				$("#ddlDistrictID").val(ui.item.value);
			},
			change: function (event, ui) {
				// If new item reset hidden field value
				if (ui.item === null)
					$("#ddlDistrictID").removeAttr("value");
			},
			focus: function (event, ui) {
				// Show label on focus, not value
				event.preventDefault();
				$ddlDistrict.val(ui.item.label);
			}
		});

		//var wasOpen = false;
		//$("#ddlDistrictShow").mousedown(function () {
		//	wasOpen = $ddlDistrict.autocomplete("widget").is(":visible");
		//}).click(function () {
		//	$ddlDistrict.trigger("focus");

		//	if (wasOpen) {
		//		return;
		//	}

		//	$ddlDistrict.autocomplete("search", "");
		//});

		//$(data).each(function (i, el) {
		//	$("#ddlDistrict").append($("<option>", {
		//		value: el.DistrictID,
		//		text: el.Name
		//	}));
		//});
	});
}

function fillCities() {

	var $ddlCity = $("#ddlCity");

	$.getJSON("/api/Board/GetDistricts?language=" + $.i18n().locale, function (districts) {

		var districtItems = $.map(districts, function (el) {
			return { value: el.DistrictID, label: el.Name };
		});

		// Init Districts DDL
		$ddlDistrict.autocomplete({
			source: districtItems,
			minLength: 0,
			select: function (event, ui) {
				// Set hidden field value by selection
				event.preventDefault();
				$ddlDistrict.val(ui.item.label);
				$("#ddlDistrictID").val(ui.item.value);
			},
			change: function (event, ui) {
				// If new item reset hidden field value
				if (ui.item === null)
					$("#ddlDistrictID").removeAttr("value");
			},
			focus: function (event, ui) {
				// Show label on focus, not value
				event.preventDefault();
				$ddlDistrict.val(ui.item.label);
			}
		});
	});
}

// Enable debug
//$.i18n.debug = true;

$(document).ready(function () {
	runI18n();

	$("#ddlLanguage").change(runI18n);
});