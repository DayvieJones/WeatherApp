const currentWeatherElement = document.querySelector(".currentWeather");
const forecastWeatherElement = document.querySelector(".forecast7Days");

async function displayCurrentWeather(currentData) {
  let html = `
      <div class="locationHeader">${currentData.location.name}</div>
      <div class="currentTemperature">${currentData.current.temp_c}°C</div>
      <div class="currentCondition">${currentData.current.condition.text}</div>
      <div class="currentTemperatureRange">
        <div class="currentMaxTemperature">H: ${currentData.forecast.forecastday[0].day.maxtemp_c}°C</div>
        <div class="currentMinTemperature">L: ${currentData.forecast.forecastday[0].day.mintemp_c}°C</div>
      </div>`;

  currentWeatherElement.innerHTML = html;
}
async function displayForecastWeather(forecastData) {
  let html = "";
  const forecast = forecastData.forecast.forecastday;
  //TODO: Den code in eine Schleife umändern
  forecast.forEach((forecastDay) => {
    html += `
    <div class="forecast">
      <div class="forecastTempMin">${forecastDay.day.mintemp_c}C</div>
      <div class="forecastTempMax">${forecastDay.day.maxtemp_c}C</div>
      <img src="${forecastDay.day.condition.icon}" alt="Weather Icon" />

    </div>
`;
  });
  forecastWeatherElement.innerHTML = html;
}
// const tempDataC = body.forecast.forecastday[0].day.maxtemp_c;
// const tempDataC = body.forecast.forecastday[0].day.mintemp_c;
// <div id="forecastTempMinMo">${forecastData.forecast.forecastday[0].day.mintemp_c}C</div>
// <div id="forecastTempMaxMo">${forecastData.forecast.forecastday[0].day.maxtemp_c}C</div>
{
  /* <img src="${forecastData.forecast.forecastday[6].condition.icon}" alt="Weather Icon" /> */
}
