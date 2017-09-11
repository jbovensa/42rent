/// <reference path="../../reference/jquery/2.2.4/jquery.js" />
/// <reference path="../../reference/jquery-ui/1.12.1/jquery-ui.js" />
/// <reference path="../../reference/jquery.i18n/1.0.4/jquery.i18n.js" />
/// <reference path="../../reference/jquery.i18n/1.0.4/jquery.i18n.messagestore.js" />
/// <reference path="../../reference/jquery.i18n/1.0.4/jquery.i18n.emitter.bidi.js" />
/// <reference path="../../reference/jquery.i18n/1.0.4/languages/he.js" />
/// <reference path="../../reference/jquery-autocomplete/jquery.autocomplete.js" />

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

	$("#ddlLanguage").change(runI18n);
}

function initNumberFields() {

	$("#txtPrice").keypress(function (event) {
		if (["-", "e"].indexOf(event.key) >= 0)
			event.preventDefault();
	});
}

function fillDistricts() {

	var $ddlDistrict = $("#ddlDistrict");
	var $ddlDistrictID = $("#ddlDistrictID");

	$.getJSON("/api/Board/GetDistricts?language=" + $.i18n().locale, function (districts) {

		var districtItems = $.map(districts, function (el) {
			return { value: el.Name, data: el.DistrictID };
		});

		$ddlDistrict.devbridgeAutocomplete({
			lookup: districtItems,
			minChars: 0,
			onSelect: function (district) {
				if (district.data.toString() !== $ddlDistrictID.val()) {
					$ddlDistrictID.val(district.data);

					fillCities();
					fillNeighborhoods();
					fillStreets();
				}
			},
			onInvalidateSelection: function () {
				$ddlDistrictID.removeAttr("value");

				fillCities();
				fillNeighborhoods();
				fillStreets();
			}
		});
	});
}

function fillCities() {

	var $ddlCity = $("#ddlCity");
	var $ddlCityID = $("#ddlCityID");

	$ddlCity.val("");
	$ddlCityID.removeAttr("value");

	var districtID = $("#ddlDistrictID").val();
	var district = (districtID !== "") ? { DistrictID: districtID } : null;

	$.post("/api/Board/GetCities?language=" + $.i18n().locale, district, function (cities) {

		var cityItems = $.map(cities, function (el) {
			return { value: el.Name, data: el.CityID };
		});

		// Init DDL
		$ddlCity.devbridgeAutocomplete({
			lookup: cityItems,
			minChars: 0,
			onSelect: function (city) {
				if (city.data.toString() !== $ddlCityID.val()) {
					$ddlCityID.val(city.data);

					fillNeighborhoods();
					fillStreets();
				}
			},
			onInvalidateSelection: function () {
				$ddlCityID.removeAttr("value");

				fillNeighborhoods();
				fillStreets();
			}
		});
	});
}

function fillNeighborhoods() {

	var $ddlNeighborhood = $("#ddlNeighborhood");
	var $ddlNeighborhoodID = $("#ddlNeighborhoodID");

	$ddlNeighborhood.val("");
	$ddlNeighborhoodID.removeAttr("value");

	var cityID = $("#ddlCityID").val();

	if (cityID === "") {
		$ddlNeighborhood.devbridgeAutocomplete({
			lookup: []
		});
		return;
	}

	var city = { CityID: cityID };

	$.post("/api/Board/GetNeighborhoods?language=" + $.i18n().locale, city, function (neighborhoods) {

		var neighborhoodItems = $.map(neighborhoods, function (el) {
			return { value: el.Name, data: el.NeighborhoodID };
		});

		// Init DDL
		$ddlNeighborhood.devbridgeAutocomplete({
			lookup: neighborhoodItems,
			minChars: 0,
			onSelect: function (neighborhood) {
				$ddlNeighborhoodID.val(neighborhood.data);
			},
			onInvalidateSelection: function () {
				$ddlNeighborhoodID.removeAttr("value");
			}
		});
	});
}

function fillStreets() {

	var $ddlStreet = $("#ddlStreet");
	var $ddlStreetID = $("#ddlStreetID");

	$ddlStreet.val("");
	$ddlStreetID.removeAttr("value");

	var cityID = $("#ddlCityID").val();

	if (cityID === "") {
		$ddlStreet.devbridgeAutocomplete({
			lookup: []
		});
		return;
	}

	var city = { CityID: cityID };

	$.post("/api/Board/GetStreets?language=" + $.i18n().locale, city, function (streets) {

		var streetItems = $.map(streets, function (el) {
			return { value: el.Name, data: el.StreetID };
		});

		// Init DDL
		$ddlStreet.devbridgeAutocomplete({
			lookup: streetItems,
			minChars: 0,
			onSelect: function (street) {
				$ddlStreetID.val(street.data);
			},
			onInvalidateSelection: function () {
				$ddlStreetID.removeAttr("value");
			}
		});
	});
}

function fillPropertyTypes() {

	var $ddlPropertyType = $("#ddlPropertyType");
	var $ddlPropertyTypeID = $("#ddlPropertyTypeID");

	$.getJSON("/api/Board/GetPropertyTypes?language=" + $.i18n().locale, function (propertyTypes) {

		var propertyTypeItems = $.map(propertyTypes, function (el) {
			return { value: el.Name, data: el.PropertyTypeID };
		});

		// Init DDL
		$ddlPropertyType.devbridgeAutocomplete({
			lookup: propertyTypeItems,
			minChars: 0,
			onSelect: function (propertyType) {
				$ddlPropertyTypeID.val(propertyType.data);
			},
			onInvalidateSelection: function () {
				$ddlPropertyTypeID.removeAttr("value");
			}
		});
	});
}

function fillCurrencies() {

	var $ddlCurrency = $("#ddlCurrency");
	var $ddlCurrencyID = $("#ddlCurrencyID");

	$.getJSON("/api/Board/GetCurrencies", function (currencies) {

		var currencyItems = $.map(currencies, function (el) {
			return { value: el.Symbol, data: el.CurrencyID };
		});

		// Init DDL
		$ddlCurrency.devbridgeAutocomplete({
			lookup: currencyItems,
			minChars: 0,
			onSelect: function (currency) {
				$ddlCurrencyID.val(currency.data);
			},
			onInvalidateSelection: function () {
				$ddlCurrencyID.removeAttr("value");
			}
		});
	});
}

// Enable debug
//$.i18n.debug = true;

$(document).ready(function () {

	runI18n();

	initNumberFields();

	fillDistricts();

	fillCities();

	fillPropertyTypes();

	fillCurrencies();

	$("#btnSubmit").click(function (event) {
		var immobileNotice = {
			Title: $("#txtTitle").val(),
			Address: {
				District: {
					DistrictID: $("#ddlDistrictID").val(),
					Name: $("#ddlDistrict").val()
				},
				City: {
					CityID: $("#ddlCityID").val(),
					Name: $("#ddlCity").val()
				},
				Neighborhood: {
					NeighborhoodID: $("#ddlNeighborhoodID").val(),
					Name: $("#ddlNeighborhood").val()
				},
				Street: {
					StreetID: $("#ddlStreetID").val(),
					Name: $("#ddlStreet").val()
				},
				BuildingNumber: $("#txtBuilding").val(),
				ApartmentNumber: $("#txtApartment").val()
			},
			PropertyType: {
				PropertyTypeID: $("#ddlPropertyTypeID").val(),
				Name: $("#ddlPropertyType").val()
			},
			Price: {
				Amount: $("#txtPrice").val(),
				Currency: {
					CurrencyID: $("#ddlCurrencyID").val(),
					Symbol: $("#ddlCurrency").val()
				}
			}
		};
		$.post("/api/Rentee/PostImmobileNotice?language=" + $.i18n().locale, immobileNotice, function (result) {

		});
	});
});