import jQuery from "jquery";
import { db } from "../backend/app_backend";
import Swal from "sweetalert2";
import Thunder from "./../assets/static/thunder.svg";
import Day from "./../assets/static/day.svg";
import Drizzle from "./../assets/static/rainy-5.svg";
import Rainy from "./../assets/static/rainy-7.svg";
import FreezingRain from "./../assets/static/freezing-rain.svg";
import Misty from "./../assets/static/mist.svg";
import BrokenClouds from "./../assets/static/broken-clouds.svg";
import OvercastClouds from "./../assets/static/overcast-clouds.svg";
import ScatteredClouds from "./../assets/static/scattered-clouds.svg";
import FewClouds from "./../assets/static/few-clouds.svg";
import Haze from "./../assets/static/haze.svg";
import { getCurrentDate } from "../inc/scripts/utilities";

export const closeUtilityComponent = () => {
	jQuery(($) => {
		$.noConflict();
		$(".cmp").addClass("d-none");
		$(".utility-component").removeClass("add-utility-component-height");
	});
};
export const API_KEY = "80c3e3fb21d8114b20bcc26e19d820d1";

export const WEATHER_UNIT = db.get("WEATHER_UNIT") || "metric";

export const scrollToElement = (elementId) => {
	document
		.getElementById(`${elementId}`)
		.scrollIntoView({ behaviour: "smooth" });
};

export const checkWeatherUnitDeg = () => {
	let result;
	if (db.get("WEATHER_UNIT")) {
		switch (db.get("WEATHER_UNIT")) {
			case "celsius":
				result = "c";
				break;

			case "farenheit":
				result = "f";
				break;

			case "kelvin":
				result = "k";
				break;

			default:
				result = "c";
		}
	} else {
		db.create("WEATHER_UNIT", "celsius");
		result = "c";
	}

	return result;
};

export const handleWeatherForm = (e, search) => {
	e.preventDefault();

	let userSearch = jQuery("#searchWeather").val() || search;

	getCurrentWeather(userSearch.trim());

	scrollToElement("weatherContainer");
	jQuery(($) => {
		$("#searchWeather").val("");
	});
};

export const findCity = (searchTerm,updateDataArray)=> {
	
	const XAPIKEY = "lNhOELJHDMrwCwm40hFvwA==teZv2EboEGJfonOC";
	jQuery(($)=>{
		console.log("Ajax sent")
		$.ajax({
			url: `https://api.api-ninjas.com/v1/city?name=${searchTerm}&limit=4`,
			processData: false,

			headers: {
				'X-Api-Key':XAPIKEY
			},
			success: (result, status, xhr) => {
				if (xhr.status != 200) {
					Swal.fire({
						toast: true,
						position: "top",
						text: "Something went wrong!",
						icon: "info",
						showConfirmButton: false,
						timer: 1000,
					});
				} else {
					console.log(result)
					updateDataArray(result)
				}
			},
			error: (xhr, status, error) => {
				$("#searchWeather").val(" ");
				console.log("Error")

				if (error == "") {
					Swal.fire({
						toast: true,
						text: "Network Error!",
						icon: "info",
						timer: 1000,
						position: "top",
						showConfirmButton: false,
					}).then((willProceed) => {
						scrollToElement("weatherContainer");
					});
				} else {
					Swal.fire({
						toast: true,
						text: error,
						icon: "warning",
						timer: 1000,
						position: "top",
						showConfirmButton: false,
					}).then((willProceed) => {
						scrollToElement("weatherContainer");
					});
				}
			},
		})

	})
}

export let weatherSvg;
export const checkWeatherCode = (code) => {
	if (code >= 200 && !(code >= 300)) {
		weatherSvg = Thunder;
	} else if (code >= 300 && !(code != 400)) {
		weatherSvg = Drizzle;
	} else if (code >= 500 && code != 511 && !(code >= 600)) {
		weatherSvg = Rainy;
	} else if (code >= 700 && code != 701 && !(code >= 800)) {
		weatherSvg = Haze;
	} else if (code == 701) {
		weatherSvg = Misty;
	} else if (code == 511) {
		weatherSvg = FreezingRain;
	} else if (code == 800) {
		weatherSvg = Day;
	} else if (code == 803) {
		weatherSvg = BrokenClouds;
	} else if (code == 804) {
		weatherSvg = OvercastClouds;
	} else if (code == 801) {
		weatherSvg = FewClouds;
	} else if (code == 802) {
		weatherSvg = ScatteredClouds;
	} else {
		weatherSvg = "";
	}

	return weatherSvg;
};

export const updateReactDom = (result) => {
	jQuery(($) => {
		$.noConflict();
		$("#searchWeather").val(" ");
		scrollToElement("weatherContainer");
		$("#weatherLocation").html(`${result.name} ${result.sys.country}`);
		$("#currentDeg").html(Math.ceil(result.main.temp));
		$("#weatherDes").html(result.weather[0].description);
		$("#currentDate").html(getCurrentDate());
		checkWeatherCode(result.weather[0].id);
		$("#main-weather-icon-container").html(
			`<img src=${weatherSvg} alt="main-weather-icon" width="64" height="64"/>`
		);
		$("#wind-value").html(`${result.wind.speed} m/s` );
		$("#humidity-value").html(`${result.main.humidity} %`);
		$("#pressure-value").html(`${result.main.pressure} hPa`)
		db.create("WEATHER_LOCATION", `${result.name} ${result.sys.country}`);
		db.create("WEATHER_DEG", result.main.temp);
		db.create("WEATHER_DESCRIPTION", result.weather[0].description);
		db.create("WEATHER_CODE", result.weather[0].id);
		db.create("SUB_WEATHER_WIND_VALUE", `${result.wind.speed} m/s`);
		db.create("SUB_WEATHER_HUMIDITY_VALUE", `${result.main.humidity} %`);
		db.create("SUB_WEATHER_PRESSURE_VALUE", `${result.main.pressure} hPa`);
	});
};
export const getCurrentWeather = (location) => {
	jQuery(($) => {
		let userSearch = location;

		const SEARCH_URL = `https://api.openweathermap.org/data/2.5/weather?q=${userSearch}&appid=${API_KEY}&units=${WEATHER_UNIT}`;

		$.ajax({
			url: SEARCH_URL,
			processData: false,
			success: (result, status, xhr) => {
				if (xhr.status != 200) {
					Swal.fire({
						toast: true,
						position: "top",
						text: "Something went wrong!",
						icon: "info",
						showConfirmButton: false,
						timer: 1000,
					});
				} else {
					if (result.cod === 200) {
						
						updateReactDom(result);
					}
				}
			},
			error: (xhr, status, error) => {
				$("#searchWeather").val(" ");
				if (error == "") {
					Swal.fire({
						toast: true,
						text: "Network Error!",
						icon: "info",
						timer: 1000,
						position: "top",
						showConfirmButton: false,
					}).then((willProceed) => {
						scrollToElement("weatherContainer");
					});
				} else {
					Swal.fire({
						toast: true,
						text: error,
						icon: "warning",
						timer: 1000,
						position: "top",
						showConfirmButton: false,
					}).then((willProceed) => {
						scrollToElement("weatherContainer");
					});
				}
			},
		});
	});
};
