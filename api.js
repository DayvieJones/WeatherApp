const APIKEY = "key=5c3016d3b2b8455997f181757242301";
const BASEURL = "http://api.weatherapi.com/v1";
const fcDays = 7;
const weatherlocation = "Cologne";

const LOCAL_STORAGE_FORECAST = "forecastData";

async function getForecast() {
  const response = await fetch(
    BASEURL +
      "/forecast.json?" +
      APIKEY +
      "&q=" +
      weatherlocation +
      "&days=" +
      fcDays
  );
  const body = await response.json();
  console.log(body);
  await displayCurrentWeather(body);
  await displayForecastWeather(body);
}
async function loadForecast() {
  await getForecast();
}
