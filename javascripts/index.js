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
const markedBookmarkButtonEl = document.getElementById("markedBookmarkButton");
const unmarkedBookmarkButtonEl = document.getElementById(
  "unmarkedBookmarkButton"
);
const bookmarksEl = document.getElementById("bookmarks");

let currentSelectedBookmarkID = null;
let currentSelectedBookmarkLocation = undefined;
let filled = false;

loadBookmarksFromLocalStorage();

toggleButtonVisibility();

function displayCurrentWeather(currentData) {
  let weatherHtml = `
      <div class="locationHeader">${currentData.location.name}</div>
      <div class="currentTemperature">${currentData.current.temp_c}°C</div>
      <div class="currentCondition">${currentData.current.condition.text}</div>
      <div class="currentTemperatureRange">
        <div class="currentMaxTemperature">H: ${currentData.forecast.forecastday[0].day.maxtemp_c}°C</div>
        <div class="currentMinTemperature">L: ${currentData.forecast.forecastday[0].day.mintemp_c}°C</div>
      </div>`;
  currentWeatherEl.innerHTML = weatherHtml;
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

function displayBackground(result) {
  const valDay = checkIncludesDay(result);
  const valBackground = checkWeatherCondition(result);

  clearBackgroundAll();

  weatherAppEl.classList.add("background" + valBackground + valDay);
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

function getNextId() {
  const bookmarkList = getBookmarks();

  const sortedBookmarks = bookmarkList.sort(
    (bookmarkA, bookmarkB) => bookmarkA.id - bookmarkB.id
  );

  let nextId = 1;

  for (let bookmark of sortedBookmarks) {
    if (nextId < bookmark.id) break;

    nextId = bookmark.id + 1;
  }
  return nextId;
}

//BOOKMARK SECTION
function getBookmarks() {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_BOOKMARKS)) || [];
}

function showBookmarkIcon() {
  unmarkedBookmarkButtonEl.classList.remove("iconShow");
  unmarkedBookmarkButtonEl.classList.add("iconHide");

  markedBookmarkButtonEl.classList.remove("iconHide");
  markedBookmarkButtonEl.classList.add("iconShow");
  filled = false;
}

function hideBookmarkIcon() {
  unmarkedBookmarkButtonEl.classList.add("iconShow");
  unmarkedBookmarkButtonEl.classList.remove("iconHide");

  markedBookmarkButtonEl.classList.add("iconHide");
  markedBookmarkButtonEl.classList.remove("iconShow");
  filled = true;
}

//Event to change svg bookmark from unfilled to filled
function toggleButtonVisibility() {
  filled = !filled;
  if (filled) {
    unmarkedBookmarkButtonEl.classList.remove("iconHide");
    markedBookmarkButtonEl.classList.add("iconHide");
  } else {
    unmarkedBookmarkButtonEl.classList.add("iconHide");
    markedBookmarkButtonEl.classList.remove("iconHide");
  }
}

function addBookmarkPage(location) {
  let bookmarked = false;

  if (!markedBookmarkButtonEl.classList.contains("iconHide")) {
    bookmarked = true;
  } else {
    bookmarked = false;
  }

  let currentId = undefined;

  const currentlySelectedBookmarkEl = getCurrentlySelectedBookmark();

  if (currentlySelectedBookmarkEl) currentId = currentlySelectedBookmarkEl.id;

  saveBookmark(location, bookmarked, Number(currentId));
}

//Creating the bookmark object
function saveBookmark(location, bookmarked, id = undefined) {
  const bookmarkList = getBookmarks();
  if (!id) {
    bookmarkList.push({
      id: getNextId(),
      location,
      bookmarked,
    });
  } else {
    const indexOfPageWithId = bookmarkList.findIndex((page) => page.id === id);
    if (indexOfPageWithId > -1) {
      bookmarkList[indexOfPageWithId] = {
        id,
        location,
        bookmarked,
      };
    }
    getCurrentlySelectedBookmark().remove();
  }

  saveBookmarksToLocalStorage(bookmarkList);
  loadBookmarksFromLocalStorage();
}

function clearExistingDivBookmarks(newBookmarkList) {
  const bookmarkPagesEl = document.querySelector(".bookmarkPages");
  bookmarkPagesEl.replaceChildren(...newBookmarkList);
}

function createBookmarkEl(newBookmark) {
  //Create new bookmark element
  const bookmarkElement = document.createElement("div");
  bookmarkElement.classList.add("bookmarkPage", "isBookmarked");
  bookmarkElement.id = newBookmark.id;
  bookmarkElement.innerText = "O";

  //Event listener to respond to bookmark element clicks
  bookmarkElement.addEventListener("click", () => {
    selectBookmark(newBookmark.id);
  });
  return bookmarkElement;
}

function selectBookmark(id) {
  const bookmarkList = getBookmarks();

  const selectedBookmarkEl = document.querySelector(
    `.bookmarkPage[id="${id}"]`
  );

  if (selectedBookmarkEl.classList.contains("selectedBookmark")) return;

  removeSelectedClassFromAllPages();

  selectedBookmarkEl.classList.add("selectedBookmark");

  const selectedBookmark = bookmarkList.find((page) => page.id === Number(id));

  if (!selectedBookmark) return;

  if (selectedBookmarkEl.classList.contains("isBookmarked")) {
    showBookmarkIcon();
  }

  currentSelectedBookmarkID = selectedBookmark.id;
  currentSelectedBookmarkLocation = selectedBookmark.location;

  updateDisplay(currentSelectedBookmarkLocation);
}

function checkBookmarkContent() {
  //Check the bookmark list to ensure that two locations can't be added at the same time
  const location = document.querySelector(".locationHeader").innerHTML;
  const checkedList = getBookmarks().find((page) => page.location === location);

  if (checkedList) return;
  addBookmarkPage(location);
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

function deleteSelectedBookmark() {
  const bookmarkList = getBookmarks();

  // Remove the selected bookmark from the DOM
  const selectedBookmarkEl = document.querySelector(".selectedBookmark");
  if (selectedBookmarkEl) selectedBookmarkEl.remove();

  // Remove the selected bookmark from the bookmarkList array
  const filterdBookmarkList = bookmarkList.filter(
    (bookmark) => bookmark.id !== currentSelectedBookmarkID
  );
  // Save the updated list of bookmarks in localStorage
  saveBookmarksToLocalStorage(filterdBookmarkList);

  // Reset the currently selected bookmark ID
  currentSelectedBookmarkID = null;
}

function saveBookmarksToLocalStorage(bookmarkList) {
  localStorage.setItem(LOCALSTORAGE_BOOKMARKS, JSON.stringify(bookmarkList));
}

function loadBookmarksFromLocalStorage() {
  const bookmarkLists = getBookmarks();
  console.log();
  const newBookmarkList = bookmarkLists.map((pages) => createBookmarkEl(pages));
  clearExistingDivBookmarks(newBookmarkList);
}

async function updateDisplay(location) {
  const result = await fetchForecast(location);
  displayCurrentWeather(result);
  displayHourlyForecastWeather(result);
  displayForecastWeather(result);
  displayBackground(result);
}

// EVENTLISTENER

//Event to show the Nav
searchIconEl.addEventListener("click", () => {
  openNav();
});

//Event to hide the Nav
closeButtonEl.addEventListener("click", () => {
  clearInput();
  closeNav();
});

//Event to close nav while clicking on black background or out of nav
weatherAppEl.addEventListener("click", (event) => {
  if (
    event.target.id !== "myNav" &&
    event.target.parentElement.id !== "searchIcon"
  ) {
    clearInput();
    closeNav();
  }
});

//Event to show bookmark icon
unmarkedBookmarkButtonEl.addEventListener("click", (event) => {
  toggleButtonVisibility();
  checkBookmarkContent();
});

//Event to hide bookmark icon
markedBookmarkButtonEl.addEventListener("click", (event) => {
  toggleButtonVisibility();
  deleteSelectedBookmark();
});
