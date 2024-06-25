import React, { useState, useRef, useEffect } from "react";
import jQuery from "jquery";
import Button from "./../components/button";
import WeatherCard from "../components/WeatherCard";
import navigate from "../inc/scripts/utilities";
import Spinner from "../components/spinner";
import * as formHandler from "./../apis/getCurrentWeather";
import { db } from "../backend/app_backend";
import getGeolocation from "../apis/getGeolocation";
import { getCurrentDate } from "../inc/scripts/utilities";
import Day from "./../assets/static/day.svg";
import SearchBar from "../components/SearchBar";
import WeatherDetails from "../components/WeatherDetails";

const WeatherApp = (props) => {
	if (!db.get("HOME_PAGE_SEEN")) {
		navigate("/");
	}
	const [componentToInsert, setComponentToInsert] = useState("");
	const [weatherInput, setWeatherInput] = useState();
	let savedLocation;

	savedLocation = db.get("USER_DEFAULT_LOCATION");

	const addUtilityComponentHeight = () => {
		jQuery(($) => {
			$.noConflict();
			$(".cmp").removeClass("d-none");
			$(".utility-component").toggleClass("add-utility-component-height");
		});
	};

	const navigateToForecast = () => {
		navigate("/forecast");
	}
	class MappedSavedDataTemplate {
		constructor(id, time, icon, unit) {
			this.id = id;
			this.time = time;
			this.icon = icon;
			this.unit = unit;
		}
	}

	const mapDbSavedData = () => {
		const count = 8;

		let weatherData = [];

		for (let i = 0; i < count; i++) {
			const FORECAST_TIME = db.get(`WEATHER_FORECAST_TIME_${i}`) || "12pm";
			const FORECAST_ICON = db.get(`WEATHER_FORECAST_ICON_${i}`) || "800";
			const FORECAST_UNIT = db.get(`WEATHER_FORECAST_UNIT_${i}`) || "26";

			weatherData.push(
				new MappedSavedDataTemplate(
					i,
					FORECAST_TIME,
					formHandler.checkWeatherCode(parseInt(FORECAST_ICON)),
					FORECAST_UNIT
				)
			);
		}

		const uiData = weatherData.map((data, index) => {
			const handleElementClick = () => {
				navigate("/forecast");
			}
			return (
				<WeatherCard
					key={data.id}
					time={data.time}
					icon={data.icon}
					weatherUnit={data.unit}
					onClick={handleElementClick}
				/>
			);
		});

		return uiData;
	};

	const SearchComponent = () => {
		const [searchValue, setSearchValue] = useState("");
		return (
			<section className="cmp d-flex align-items-center justify-content-center flex-column my-5">
				<form
					id="searchWeatherForm"
					onSubmit={(e) => {
						formHandler.handleWeatherForm(e);
						setWeatherInput();
					}} onChange={(e) => {
						setSearchValue(e.target.value)
					}}>
					<label htmlFor="searchWeather" className="py-2 text-capitalize ">
						search city
					</label>
					<input
						type="text"
						name="searchWeather"
						id="searchWeather"
						placeholder="Enter the name of city"
						value={weatherInput}
						className="form-control search-input p-3 brand-small-text w-100"
						onChange={(e) => {
							setWeatherInput(e.target.value);
						}}
						autoComplete="off"
						autoFocus={true}
					/>
					<p
						className="error-holder text-danger py-3 fs-6 brand-small-text text-center d-none"
						id="searchErrorLog">
						city not found
					</p>

					<section className="d-none "></section>
					<SearchMenuComponent search={searchValue} />
					<Button
						text="track saved location!"
						className="shadow brand-btn-3-secondary toggle-width-3 my-5 text-dark text-capitalize p-2"
						id="searchSavedLocationWeather"
						onClick={(e) => {
							formHandler.handleWeatherForm(e, savedLocation);
							setWeatherInput();
						}}
					/>
				</form>
			</section>
		);
	};

	const SearchMenuComponent = ({ search }) => {
		const [dataArray, changeDataArray] = useState([]);
		useEffect(() => {
			if (search.length > 3) {
				formHandler.findCity(search, changeDataArray)
			}
		}, [search])

		function clickHandler(e) {
			jQuery("#searchWeather").val(e.target.textContent)
			formHandler.handleWeatherForm(e, savedLocation);
			setWeatherInput()
		}

		return (
			<section className="cmp d-flex align-items-center justify-content-start bg-white px-2 mt-2 rounded">
				<ul className="m-0 p-0">
					{dataArray.map((data, ind) => <li key={ind} onClick={clickHandler} style={{ cursor: "pointer" }}><p className="text-dark text-left m-0" style={{ fontSize: "14px" }}>{data.name}</p></li>)}
				</ul>
			</section>
		)
	}

	const testSearch = () => {
		addUtilityComponentHeight();
		setComponentToInsert(<SearchComponent />);
	};

	return (
		<React.Fragment>
			<Spinner />
			<div
				className="container-fluid d-flex flex-column py-2 px-0 width-toggle-5 m-auto"
				id="weatherContainer">
				<section className="app-header d-flex justify-content-center flex-row-reverse gap-new mb-new mt-2">
					<section className="d-flex align-items-center justify-content-center">
						<Button
							text="current location"
							className="brand-btn-new width-toggle-new"
							onClick={getGeolocation}
						/>
					</section>
					<SearchBar />

				</section>
				<section className="current-weather-container d-flex justify-content-around px-2 mb-4 mt-3">
					<section className="current-weather-value-container">
						<section className="d-flex ">
							<h1
								className="current-weather-value fw-bold brand-large-text"
								id="currentDeg">
								{Math.ceil(db.get("WEATHER_DEG")) || 30}
							</h1>

							<sup className="fw-bold brand-medium-text current-weather-unit">
								o
							</sup>
						</section>
						<p className="text-muted text-capitalize" id="weatherDes">
							{db.get("WEATHER_DESCRIPTION") || "clear sky"}
						</p>
					</section>
					<section className="app-header d-flex justify-content-between px-2 flex-row-reverse ">
						<section className="city-location">
							<h5 className="fw-bold fs-5" id="weatherLocation">
								{db.get("WEATHER_LOCATION") || "Lagos 9ja"}
							</h5>
							<p className="date-time text-muted brand-small-text text-capitalize">
								{getCurrentDate()}
							</p>
						</section>
					</section>
					<section
						className="current-weather-icon my-4 mx-3 px-3"
						id="main-weather-icon-container">
						<img
							src={formHandler.checkWeatherCode(db.get("WEATHER_CODE")) || Day}
							width={64}
							height={64}
							alt="main weather icon"
							id="main-weather-icon"
						/>
					</section>
				</section>
				<WeatherDetails/>
				<section className="future-weather-days d-flex align-items-center justify-content-start">
					<section role="button" className="today-section d-flex mx-2 flex-column align-items-center justify-content-center">
						<p className="brand-small-text text-capitalize fw-bold">today</p>
						<div className="future-weather-notch-active"></div>
					</section>
					<section role="button" className="week-section d-flex mx-2 flex-column align-items-center justify-content-center" onClick={navigateToForecast}>
						<p className="brand-small-text text-capitalize">next</p>
						<div className="future-weather-notch"></div>
					</section>
				</section>
				<section
					className="future-weather-forecast my-4 d-flex align-items-center justify-content-between "
					style={{ overflowX: "scroll" }}>
					{mapDbSavedData()}
				</section>
			</div>
		</React.Fragment>
	);
};

export default WeatherApp;
