// require("dotenv").config();
const BASE_URL = "http://api.weatherapi.com/v1";
const fcDays = 10;
const weatherlocation = "Cologne";
const LOCAL_STORAGE_FORECAST = "forecastData";

// console.log(process.env);

async function getForecast(weatherlocation = "Cologne", fcDays = 10) {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${weatherlocation}&days=${fcDays}`
  );
  const body = await response.json();
  console.log(body);

  await displayCurrentWeather(body);
  await displayHourlyForecastWeather(body);
  await displayForecastWeather(body);
}

async function loadForecast() {
  await getForecast(weatherlocation, fcDays);
}
