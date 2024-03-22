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

const bookmarkList = [];
let currentSelectedBookmarkID = null;
let currentSelectedBookmarkLocation = undefined;
let filled = false;

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

async function updateDisplay(location) {
  const result = await fetchForecast(location);
  displayCurrentWeather(result);
  displayHourlyForecastWeather(result);
  displayForecastWeather(result);
  displayBackground(result);
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

//Method to check if it's day or night for setting the background
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

//BOOKMARK

function getBookmarks() {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_BOOKMARKS)) || [];
}

function saveBookmarksToLocalStorage() {
  localStorage.setItem(LOCALSTORAGE_BOOKMARKS, JSON.stringify(bookmarkList));
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

function getNextId() {
  const bookmarks = getBookmarks();

  const sortedBookmarks = bookmarks.sort(
    (bookmarkA, bookmarkB) => bookmarkA.id - bookmarkB.id
  );

  let nextId = 1;

  for (let bookmark of sortedBookmarks) {
    if (nextId < bookmark.id) break;

    nextId = bookmark.id + 1;
  }
  return nextId;
}

function addBookmarkPage() {
  const locationHeaderEl = document.querySelector(".locationHeader");

  const locationHeader = locationHeaderEl.innerHTML;
  let bookmarked = undefined;

  if (!buttonToUnmarkEl.classList.contains("iconHide")) {
    bookmarked = true;
  } else {
    bookmarked = false;
  }

  let currentId = undefined;

  const currentlySelectedBookmarkEl = getCurrentlySelectedBookmark();

  if (currentlySelectedBookmarkEl) currentId = currentlySelectedBookmarkEl.id;

  saveBookmark(locationHeader, bookmarked, Number(currentId));
}

function saveBookmark(location, bookmarked, id = undefined) {
  //creating the Bookmark Object
  if (!id) {
    const newBookmark = {
      id: getNextId(),
      location,
      bookmarked,
    };
    bookmarkList.push(newBookmark);
    appendBookmark(newBookmark);
  } else {
    const indexOfNoteWithId = bookmarkList.findIndex((note) => note.id === id);

    if (indexOfNoteWithId > -1) {
      bookmarkList[indexOfNoteWithId] = {
        id,
        location,
        bookmarked,
      };
    }
    getCurrentlySelectedBookmark().remove();
    appendBookmark(bookmarkList[indexOfNoteWithId]);
  }
  saveBookmarksToLocalStorage();
}

function appendBookmark(newBookmark) {
  const bookmarkPagesDiv = document.querySelector(".bookmarkPages");

  //Create new bookmark element
  const bookmarkElement = document.createElement("div");
  bookmarkElement.classList.add("bookmarkPage", "dummy", "isBookmarked");
  bookmarkElement.id = newBookmark.id;
  bookmarkElement.innerText = "O";

  bookmarkPagesDiv.appendChild(bookmarkElement);

  //Event listener to respond to bookmark element clicks
  bookmarkElement.addEventListener("click", () => {
    selectBookmark(newBookmark.id);
  });
}

function selectBookmark(id) {
  const selectedBookmarkEl = document.querySelector(
    `.bookmarkPage[id="${id}"]`
  );

  if (selectedBookmarkEl.classList.contains("selectedBookmark")) return;

  removeSelectedClassFromAllPages();

  selectedBookmarkEl.classList.add("selectedBookmark");

  const selectedBookmark = bookmarkList.find(
    (bookmark) => bookmark.id == Number(id)
  );

  if (!selectedBookmark) return;

  currentSelectedBookmarkID = selectedBookmark.id;
  currentSelectedBookmarkLocation = selectedBookmark.location;

  updateDisplay(currentSelectedBookmarkLocation);
}

function removeSelectedClassFromAllPages() {
  const bookmarks = document.querySelectorAll(".isBookmarked");

  bookmarks.forEach((bookmark) => {
    bookmark.classList.remove("selectedBookmark");
  });
}

function getCurrentlySelectedBookmark() {
  return document.querySelector(".selectedBookmark");
}

function checkBookmarkedButton() {}

toggleButtonVisibility();

//EVENTLISTENER
//TODO styles eher über klassen regeln DONE

//Event to show the Nav
searchIconEl.addEventListener("click", () => {
  openNav();
});

//Event to hide the Nav
closeButtonEl.addEventListener("click", () => {
  closeNav();
  clearInput();
});

//Event to close nav while clicking on black background or out of nav
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
  addBookmarkPage();
});

//Event to hide bookmark icon
buttonToUnmarkEl.addEventListener("click", () => {
  toggleButtonVisibility();
});
