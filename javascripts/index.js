const currentWeatherEl = document.querySelector(".currentWeather");
const forecastWeatherEl = document.querySelector(".forecast7Days");
const hourlyForecastWrapperEl = document.querySelector(
  ".hourlyForecastWrapper"
);
const hourlyForecastHeaderEl = document.querySelector(".hourlyForecastHeader");
const weatherAppEl = document.querySelector(".weather-app");

const searchIconEl = document.getElementById("searchIcon");
const searchExecuteEl = document.getElementById("searchExecute");

const searchInputEl = document.getElementById("searchInput");
const closeButtonEl = document.getElementById("closeButton");
const myNavEl = document.getElementById("myNav");
const footerEl = document.querySelector(".footer");
const buttonToUnmarkEl = document.getElementById("buttonToUnmark");
const buttonToMarkEl = document.getElementById("buttonToMark");
const bookmarksEl = document.getElementById("bookmarks");

function displayCurrentWeather(currentData) {
  let html = `
      <div class="locationHeader">${currentData.location.name}</div>
      <div class="currentTemperature">${currentData.current.temp_c}°C</div>
      <div class="currentCondition">${currentData.current.condition.text}</div>
      <div class="currentTemperatureRange">
        <div class="currentMaxTemperature">H: ${currentData.forecast.forecastday[0].day.maxtemp_c}°C</div>
        <div class="currentMinTemperature">L: ${currentData.forecast.forecastday[0].day.mintemp_c}°C</div>
      </div>`;
  currentWeatherEl.innerHTML = html;
}

function displayHourlyForecastWeather(hourlyForecastData) {
  const forecastHour = hourlyForecastData.forecast.forecastday[0].hour;
  const forecastAstro = hourlyForecastData.forecast.forecastday[0].astro;

  hourlyForecastHeaderEl.textContent = `Sunrise: ${forecastAstro.sunrise}   |   Sunset: ${forecastAstro.sunset}`;

  let html = ``;

  forecastHour.forEach((forecastHour) => {
    html += `
  <div class="hourlyForecast">
  <div class="hourForecast">${getTimeByEpoche(forecastHour.time_epoch)}</div>
  <img src="${
    forecastHour.condition.icon
  }" alt=" weather icon" class="weatherIcon">
  <div class="hourlyTemp">${forecastHour.temp_c}°C</div>
</div>`;
  });
  hourlyForecastWrapperEl.innerHTML = html;
}

function displayForecastWeather(forecastData) {
  const forecast = forecastData.forecast.forecastday;

  let html = `<div class="forecastHeader">3-DAY FORECAST</div>`;

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
  forecastWeatherEl.innerHTML = html;
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

//TODO: implementiere Funktion zum suchen von Städten DONE
//TODO: Overlay Menü + Favorit Bookmarking
//TODO: SCSS click input and keep width DONE

async function updateDisplay(location) {
  const result = await fetchForecast(location);
  displayCurrentWeather(result);
  displayHourlyForecastWeather(result);
  displayForecastWeather(result);
  displayBackground(result);
}

function loadDataFromLocalStorage() {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_DATA)) || [];
}

function saveDataInLocalStorage() {
  localStorage.setItem(LOCALSTORAGE_DATA, JSON.stringify());
}

function checkWeatherCondition(condition) {
  const weatherCondition = condition.current.condition.text.toLowerCase();

  switch (true) {
    case weatherCondition.includes("clear"):
      return "ClearlySky";
    case weatherCondition.includes("sunny"):
      return "SunnySky";
    case weatherCondition.includes("cloud"):
      return "CloudySky";
    case weatherCondition.includes("overcast"):
      return "CloudySky";
    case weatherCondition.includes("mist"):
      return "FoggySky";
    case weatherCondition.includes("fog"):
      return "FoggySky";
    case weatherCondition.includes("storm"):
      return "StormySky";
    case weatherCondition.includes("thunder"):
      return "ThunderySky";
    case weatherCondition.includes("rain"):
      return "RainySky";
    default:
      return "ClearlySky"; // Defaultwert, falls keine Übereinstimmung gefunden wurde
  }
}

//function to check if it's day or night for setting the background
function checkIncludesDay(currentCondition) {
  const DayOrNightIcon = currentCondition.current.condition.icon;
  let valDay = true;
  if (DayOrNightIcon.includes("day")) {
    valDay = "Day";
  } else {
    valDay = "Night";
  }
  return valDay;
}

function displayBackground(result) {
  const valDay = checkIncludesDay(result);
  const valBackground = checkWeatherCondition(result);

  // console.log(valDay, valBackground);

  clearBackgroundAll();

  weatherAppEl.classList.add("background" + valBackground + valDay);
}

function clearBackgroundAll() {
  weatherAppEl.classList.remove(
    "backgroundSunnySkyDay",
    "backgroundSunnySkyNight",
    "backgroundClearSkyDay",
    "backgroundClearSkyNight",
    "backgroundCloudySkyDay",
    "backgroundCloudySkyNight",
    "backgroundRainySkyDay",
    "backgroundRainySkyNight",
    "backgroundStormySkyDay",
    "backgroundStormySkyNight",
    "backgroundFoggySkyDay",
    "backgroundFoggySkyNight",
    "backgroundThunderySkyDay",
    "backgroundThunderySkyNight"
  );
}

function showBookmarkIcon() {
  buttonToMarkEl.classList.remove("iconShow");
  buttonToMarkEl.classList.add("iconHide");

  buttonToUnmarkEl.classList.remove("iconHide");
  buttonToUnmarkEl.classList.add("iconShow");
}

function hideBookmarkIcon() {
  buttonToMarkEl.classList.add("iconShow");
  buttonToMarkEl.classList.remove("iconHide");

  buttonToUnmarkEl.classList.add("iconHide");
  buttonToUnmarkEl.classList.remove("iconShow");
}

//Event to change svg bookmark from unfilled to filled
let filled = false;

function toggleButtonVisibility() {
  filled = !filled;
  if (filled) {
    buttonToMarkEl.classList.remove("iconHide");
    buttonToUnmarkEl.classList.add("iconHide");
  } else {
    buttonToMarkEl.classList.add("iconHide");
    buttonToUnmarkEl.classList.remove("iconHide");
  }
}

toggleButtonVisibility();

//BOOKMARK

/*
Überlegung ist, eine Liste zu erstellen. Diese Liste wird die Bookmark Objekte
Die Bookmarks werden aus und in der LocalStorage geladen.
Wenn kein Bookmark enthalten ist wird default geladen.
Wird ein Bookmark hinzugefügt, kommt es an die nächste Stelle.
Als dummy werden Felder in der Reihe erscheinen. Wird das Feld angeklickt wird das Bookmark geladen.

edit: TODO: VH anpassen, ist aktuell scrollbar
*/

const bookmarkList = [];
const bookmark = {
  id: 1,
  location: "Frankfurt",
  bookmark: false,
};

function addBookmarkPage() {}

//EVENTLISTENER
//TODO styles eher über klassen regeln DONE

searchIconEl.addEventListener("click", () => {
  openNav();
});

closeButtonEl.addEventListener("click", () => {
  closeNav();
  clearInput();
});

//Event to close nav while clicking on
weatherAppEl.addEventListener("click", (event) => {
  if (
    event.target.id !== "myNav" &&
    event.target.parentElement.id !== "searchIcon"
  ) {
    closeNav();
  }
});

//Event to show bookmark icon
buttonToMarkEl.addEventListener("click", (event) => {
  toggleButtonVisibility();
});

buttonToUnmarkEl.addEventListener("click", (event) => {
  toggleButtonVisibility();
});
