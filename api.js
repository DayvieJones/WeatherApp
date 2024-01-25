const BASE_URL = "http://api.weatherapi.com/v1";
const fcDays = 7;
const weatherlocation = "Cologne";

const LOCAL_STORAGE_FORECAST = "forecastData";

async function getForecast(weatherlocation = "Cologne", fcDays = 7) {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${weatherlocation}&days=${fcDays}`
  );
  const body = await response.json();
  console.log(body);

  await displayForecastWeather(body);
}

async function loadForecast() {
  await getForecast();
}
