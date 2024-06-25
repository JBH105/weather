import React, { useEffect, useState } from "react";
import jQuery from "jquery";
import * as formHandler from "./../apis/getCurrentWeather";
import { db } from "../backend/app_backend";

let savedLocation;

savedLocation = db.get("USER_DEFAULT_LOCATION");

const SearchBar = (props) => {
    const [searchValue, setSearchValue] = useState("");
    const [weatherInput, setWeatherInput] = useState();

    return (
        <section className="cmp d-flex align-items-center justify-content-center flex-column mt-2">
          <form
        id="searchWeatherForm"
        onSubmit={(e) => {
          formHandler.handleWeatherForm(e);
          setWeatherInput();
        }}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        style={{ position: "relative", width: "100%" }}
      >
        <div style={{ display: "flex", position: "relative", width: "100%" }}>
          <input
            type="text"
            className="width-toggle-new-2 brand-small-text"
            placeholder="Enter the name of city"
            name="searchWeather"
            value={weatherInput}
            onChange={(e) => {
              setWeatherInput(e.target.value);
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "30px",
              width: "100%",
              border: "none",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            }}
            autoComplete="off"
            autoFocus={true}
            id="searchWeather"
          />
          <div
            className="footer-icons footer-settings-svg-section d-flex align-items-center justify-content-center my-2"
            onClick={(e) => {
              formHandler.handleWeatherForm(e, savedLocation);
              setWeatherInput("");
            }}
            style={{
              position: "absolute",
              right: "17px",
              top: "30%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={"20px"}
              height={"20px"}
              className="footer-svgs text-center m-auto"
              fill="#00000"
              viewBox="0 0 512 512"
              style={{ color: "black" }}
            >
              <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
            </svg>
          </div>
        </div>
        <p
          className="error-holder text-danger py-3 fs-6 brand-small-text text-center d-none"
          id="searchErrorLog"
        >
          city not found
        </p>
        <SearchMenuComponent search={searchValue} />
      </form>
        </section>
    );
};

export default SearchBar;
const SearchMenuComponent = ({ search }) => {
    const [weatherInput, setWeatherInput] = useState();


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
