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
