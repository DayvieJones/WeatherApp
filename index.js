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
  //   console.log(forecastData.forecast.forecastday[6].condition.icon);
  let html = `
  <div class="forecast7Days">
    <div id="forecastMo">
          <div id="forecastDayMo">Monday</div>
          <div id="forecastTempMinMo">${forecastData.forecast.forecastday[0].day.mintemp_c}C</div>
          <div id="forecastTempMaxMo">${forecastData.forecast.forecastday[0].day.maxtemp_c}C</div>
          <i id="forecastIconMo"></i>
        </div>
        <div id="forecastTu">
          <div id="forecastDayTu">Tuesday</div>
          <div id="forecastTempMinTu">${forecastData.forecast.forecastday[1].day.mintemp_c}C</div>
          <div id="forecastTempMaxTu">${forecastData.forecast.forecastday[1].day.maxtemp_c}C</div>
          <i id="forecastIconTu"></i>
        </div>
        <div id="forecastWed">
          <div id="forecastDayWed">Wednesday</div>
          <div id="forecastTempMinWed">${forecastData.forecast.forecastday[2].day.mintemp_c}C</div>
          <div id="forecastTempMaxWed">${forecastData.forecast.forecastday[2].day.maxtemp_c}C</div>
          <i id="forecastIconWed"></i>
        </div>
        <div id="forecastThu">
          <div id="forecastDayThu">Thursday</div>
          <div id="forecastTempMinThu">${forecastData.forecast.forecastday[3].day.mintemp_c}C</div>
          <div id="forecastTempMaxThu">${forecastData.forecast.forecastday[3].day.maxtemp_c}C</div>
          <i id="forecastIconThu"></i>
        </div>
        <div id="forecastFr">
          <div id="forecastDayFr">Friday</div>
          <div id="forecastTempMinFr">${forecastData.forecast.forecastday[4].day.mintemp_c}C</div>
          <div id="forecastTempMaxFr">${forecastData.forecast.forecastday[4].day.maxtemp_c}C</div>
          <i id="forecastIconFr"></i>
        </div>
        <div id="forecastSa">
          <div id="forecastDaySa">Saturday</div>
          <div id="forecastTempMinSa">${forecastData.forecast.forecastday[5].day.mintemp_c}C</div>
          <div id="forecastTempMaxSa">${forecastData.forecast.forecastday[5].day.maxtemp_c}C</div>
          <i id="forecastIconSa"></i>
        </div>
        <div id="forecastSu">
          <div id="forecastDaySu">Sunday</div>
          <div id="forecastTempMinSu">${forecastData.forecast.forecastday[6].day.mintemp_c}C</div>
          <div id="forecastTempMaxSu">${forecastData.forecast.forecastday[6].day.maxtemp_c}C</div>
          
        </div>
        </div>`;
  forecastWeatherElement.innerHTML = html;
}
// const tempDataC = body.forecast.forecastday[0].day.maxtemp_c;
// const tempDataC = body.forecast.forecastday[0].day.mintemp_c;

{
  /* <img src="${forecastData.forecast.forecastday[6].condition.icon}" alt="Weather Icon" /> */
}
