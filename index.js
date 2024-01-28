const currentWeatherElement = document.querySelector(".currentWeather");
const forecastWeatherElement = document.querySelector(".forecast7Days");
const hourlyForecastElement = document.querySelector(".hourlyForecastSection");

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

async function displayHourlyForecastWeather(hourlyForecastData) {
  const forecastHour = hourlyForecastData.forecast.forecastday[0].hour;
  const forecastAstro = hourlyForecastData.forecast.forecastday[0].astro;

  let html = `<div class="hourlyForecastHeader">Sunrise: ${forecastAstro.sunrise}   |   Sunset: ${forecastAstro.sunset}
  </div>`;

  forecastHour.forEach((forecastHour) => {
    html += `
<div class="hourlyForecastWrapper">
<div class="hourlyForecast">
  <div class="hourForecast">${getTimeByEpoche(forecastHour.time_epoch)}</div>
  <img src="${
    forecastHour.condition.icon
  }" alt=" weather icon" class="weatherIcon">
  <div class="hourlyTemp">${forecastHour.temp_c}°C</div>
</div>`;
  });
  hourlyForecastElement.innerHTML = html;
}

async function displayForecastWeather(forecastData) {
  const forecast = forecastData.forecast.forecastday;

  let html = `<div class="forecastHeader">10-DAY FORECAST</div>`;

  forecast.forEach((forecastDay) => {
    html += `    
      <div class="forecast">
      <div class="forecastDay">${getDayOfWeekFromEpoch(
        forecastDay.date_epoch * 1000
      )}</div>

      <img src="${
        forecastDay.day.condition.icon
      }" alt=" weather icon" class="weatherIcon"/>
     <div class="forecastTemp">
        <div class="forecastTempMin">${parseFloat(
          forecastDay.day.mintemp_c
        ).toFixed(0)}°C</div>
        <div class="forecastTempMax">${parseFloat(
          forecastDay.day.maxtemp_c
        ).toFixed(0)}°C</div>
      </div>
      </div>
`;
  });
  forecastWeatherElement.innerHTML = html;
}

function getDayOfWeekFromEpoch(timestamp) {
  const daysOfWeek = ["Sun", "Mon", "Tu", "Wed", "Thu", "Fr", "Sat"];
  const date = new Date(timestamp);
  const dayIndex = date.getDay();

  return daysOfWeek[dayIndex];
}

//TODO: timeByEpoche so abändern, dass die aktuelle Stunde als erstes gerendert wird, danach die darauf folgenden Stunden
function getTimeByEpoche(timestamp) {
  const date = new Date(timestamp * 1000); // Umrechnung von Sekunden zu Millisekunden
  let hours = date.getHours();
  const period = hours < 12 ? "AM" : "PM";

  // Konvertiere die Stunden ins 12-Stunden-Format
  hours = hours % 12 || 12;

  return `${hours} ${period}`;
}
loadForecast();
