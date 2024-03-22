function clearInput() {
  searchInputEl.value = "";
}

function closeNav() {
  myNavEl.classList.add("hideNav");
  myNavEl.classList.remove("showNav");
  searchInputEl.classList.remove("inputWide");
}

function openNav() {
  myNavEl.classList.remove("hideNav");
  myNavEl.classList.add("showNav");
  searchInputEl.classList.add("inputNarrow");
}

function styleInputWide() {
  searchInputEl.classList.add("inputWide");
  searchInputEl.classList.remove("inputNarrow");
}

function styleInputNarrow() {
  searchInputEl.classList.add("inputNarrow");
  searchInputEl.classList.remove("inputWide");
}

//EVENTLISTENER

searchInputEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    updateDisplay(searchInputEl.value);
    clearInput();
    closeNav();
    toggleButtonVisibility();
  }
});

searchInputEl.addEventListener("click", function (event) {
  if (event) {
    styleInputWide();
  }
});

myNavEl.addEventListener("click", (event) => {
  if (event.target.id !== "searchInput") {
    styleInputNarrow();
    clearInput();
  }
});

searchExecuteEl.addEventListener("click", async (event) => {
  if (event.target.parentElement.id === "searchExecute") {
    const weatherLocation = searchInputEl.value;
    await fetchForecast(weatherLocation);
    updateDisplay(weatherLocation);
    clearInput();
    closeNav();
    toggleButtonVisibility();
  }
});
