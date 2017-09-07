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

	$("#ddlLanguage").change(runI18n);
}

function fillDistricts() {

	var $ddlDistrict = $("#ddlDistrict");
	var $ddlDistrictID = $("#ddlDistrictID");

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
				$ddlDistrictID.val(ui.item.value);
			},
			change: function (event, ui) {
				if (ui.item === null) {
					// Try to get districtID by name
					var districtName = $ddlDistrict.val();
					$.getJSON("/api/Board/GetDistrictByName?language=" + $.i18n().locale + "&name=" + districtName, null, function (district) {
						if (district !== null) {
							$ddlDistrictID.val(district.DistrictID);
						}
						else {
							$ddlDistrictID.removeAttr("value");
						}

						fillCities();
						fillNeighborhoods();
						fillStreets();
					});
				}
				else {
					fillCities();
					fillNeighborhoods();
					fillStreets();
				}
			},
			focus: function (event, ui) {
				// Show label on focus, not value
				event.preventDefault();
				$ddlDistrict.val(ui.item.label);
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
			return { value: el.CityID, label: el.Name };
		});

		// Init Districts DDL
		$ddlCity.autocomplete({
			source: cityItems,
			minLength: 0,
			select: function (event, ui) {
				// Set hidden field value by selection
				event.preventDefault();
				$ddlCity.val(ui.item.label);
				$ddlCityID.val(ui.item.value);
			},
			change: function (event, ui) {
				if (ui.item === null) {
					// Try to get cityID by name
					var cityName = $ddlCity.val();
					$.getJSON("/api/Board/GetCityByName?language=" + $.i18n().locale + "&name=" + cityName, null, function (city) {
						if (city !== null) {
							$ddlCityID.val(city.CityID);
						}
						else {
							$ddlCityID.removeAttr("value");
						}

						fillNeighborhoods();
						fillStreets();
					});
				}
				else {
					fillNeighborhoods();
					fillStreets();
				}
			},
			focus: function (event, ui) {
				// Show label on focus, not value
				event.preventDefault();
				$ddlCity.val(ui.item.label);
			},
			search: function (event, ui) {
				//TODO: load full list of cities after typed 3 characters
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
		$ddlNeighborhood.autocomplete("option", { source: [] });
		return;
	}

	var city = { CityID: cityID };

	$.post("/api/Board/GetNeighborhoods?language=" + $.i18n().locale, city, function (neighborhoods) {

		var neighborhoodItems = $.map(neighborhoods, function (el) {
			return { value: el.NeighborhoodID, label: el.Name };
		});

		// Init Districts DDL
		$ddlNeighborhood.autocomplete({
			source: neighborhoodItems,
			minLength: 0,
			select: function (event, ui) {
				// Set hidden field value by selection
				event.preventDefault();
				$ddlNeighborhood.val(ui.item.label);
				$ddlNeighborhoodID.val(ui.item.value);
			},
			change: function (event, ui) {
				if (ui.item === null) {
					// Try to get neighborhoodID by name
					var neighborhoodName = $ddlNeighborhood.val();
					$.getJSON("/api/Board/GetNeighborhoodByName?language=" + $.i18n().locale + "&name=" + neighborhoodName, null, function (neighborhood) {
						if (neighborhood !== null) {
							$ddlNeighborhoodID.val(neighborhood.NeighborhoodID);
						}
						else {
							$ddlNeighborhoodID.removeAttr("value");
						}
					});
				}
			},
			focus: function (event, ui) {
				// Show label on focus, not value
				event.preventDefault();
				$ddlNeighborhood.val(ui.item.label);
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
		$ddlStreet.autocomplete("option", { source: [] });
		return;
	}

	var city = { CityID: cityID };

	$.post("/api/Board/GetStreets?language=" + $.i18n().locale, city, function (streets) {

		var streetItems = $.map(streets, function (el) {
			return { value: el.StreetID, label: el.Name };
		});

		// Init Districts DDL
		$ddlStreet.autocomplete({
			source: streetItems,
			minLength: 0,
			select: function (event, ui) {
				// Set hidden field value by selection
				event.preventDefault();
				$ddlStreet.val(ui.item.label);
				$ddlStreetID.val(ui.item.value);
			},
			change: function (event, ui) {
				if (ui.item === null) {
					// Try to get streetID by name
					var streetName = $ddlStreet.val();
					$.getJSON("/api/Board/GetStreetByName?language=" + $.i18n().locale + "&name=" + streetName, null, function (street) {
						if (street !== null) {
							$ddlStreetID.val(street.StreetID);
						}
						else {
							$ddlStreetID.removeAttr("value");
						}
					});
				}
			},
			focus: function (event, ui) {
				// Show label on focus, not value
				event.preventDefault();
				$ddlStreet.val(ui.item.label);
			}
		});
	});
}

//function initPositiveIntegerFields() {

//  $("#txtBuilding").keypress(function (event) {
//    if ([".", "-", "e"].indexOf(event.key) >= 0)
//      event.preventDefault();
//  });

//  $("#txtApartment").keypress(function (event) {
//    if ([".", "-", "e"].indexOf(event.key) >= 0)
//      event.preventDefault();
//  });
//}

// Enable debug
//$.i18n.debug = true;

$(document).ready(function () {

	runI18n();

	fillDistricts();

	fillCities();

	$("#btnSubmit").click(function (event) {
		var immobileNotice = {
			Title: "Hello",
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
			}
		};
		$.post("/api/Rentee/PostImmobileNotice?language=" + $.i18n().locale, immobileNotice, function (result) {

		});
	});
});