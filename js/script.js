const cities = {
  bern: { name: "Bern", lat: 46.948, lon: 7.447 },
  tokyo: { name: "Tokyo", lat: 35.676, lon: 139.65 },
  madrid: { name: "Madrid", lat: 40.416, lon: -3.703 },
  newyork: { name: "New York", lat: 40.712, lon: -74.006 },
  dubai: { name: "Dubai", lat: 25.2048, lon: 55.2708 }
};

const loader = document.querySelector("#loader");
const uvCard = document.querySelector("#uv-card");
const uvNumber = document.querySelector("#uv-number");
const risk = document.querySelector("#risk");
const advice = document.querySelector("#advice");
const warning = document.querySelector("#warning");

const sunIcon = document.querySelector("#sun-icon");
const sunglassesIcon = document.querySelector("#sunglasses-icon");
const sunscreenIcon = document.querySelector("#sunscreen-icon");
const umbrellaIcon = document.querySelector("#umbrella-icon");

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const locationTimeP = document.querySelector("#location-time"); // для города

// --- загрузка UV ---
async function loadUV(lat, lon) {
  const url = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// --- поиск по имени города через Open-Meteo ---
async function searchCity(cityName) {
  if (!cityName.trim()) {
    alert("Please enter a city");
    return;
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      alert("City not found");
      return;
    }

    const city = {
      name: data.results[0].name,
      lat: data.results[0].latitude,
      lon: data.results[0].longitude
    };

    showUV(city);
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

// --- скрыть все иконки ---
function hideIcons() {
  sunIcon.style.display = "none";
  sunglassesIcon.style.display = "none";
  sunscreenIcon.style.display = "none";
  umbrellaIcon.style.display = "none";
}

// --- показать UV ---
async function showUV(city) {
  loader.style.display = "flex";
  const uvData = await loadUV(city.lat, city.lon);
  await new Promise(resolve => setTimeout(resolve, 500));
  loader.style.display = "none";

  if (!uvData) {
    uvNumber.textContent = "Error";
    risk.textContent = "No data";
    advice.textContent = "Please try again";
    warning.textContent = "Could not load UV data.";
    hideIcons();
    locationTimeP.textContent = city.name; // показываем только город
    return;
  }

  const uv = uvData.now.uvi;

  uvNumber.textContent = `UV ${uv}`;
  uvCard.classList.remove("low", "medium", "high");
  hideIcons();

  locationTimeP.textContent = city.name; // показываем только город

  if (uv < 3) {
    uvCard.classList.add("low");
    risk.textContent = "Low risk";
    advice.textContent = "No protection required";
    warning.textContent = "UV is low at the moment.";
    sunIcon.style.display = "block";
  } else if (uv < 6) {
    uvCard.classList.add("medium");
    risk.textContent = "Medium risk";
    advice.textContent = "Use sunscreen";
    warning.textContent = "Protection is recommended today.";
    sunglassesIcon.style.display = "block";
    sunscreenIcon.style.display = "block";
  } else {
    uvCard.classList.add("high");
    risk.textContent = "High risk";
    advice.textContent = "Avoid strong sun";
    warning.textContent = "Warning: UV is high today.";
    umbrellaIcon.style.display = "block";
  }
}

// --- анимация солнца ---
let angle = 0;
let time = 0;
function animateSun() {
  angle += 0.8;
  time += 0.08;
  const scale = 1 + Math.sin(time) * 0.18;
  sunIcon.style.transform = `rotate(${angle}deg) scale(${scale})`;
  requestAnimationFrame(animateSun);
}
animateSun();

// --- анимация зонтика ---
let umbrellaTime = 0;
function animateUmbrella() {
  umbrellaTime += 0.04;
  const rotation = Math.sin(umbrellaTime) * 8;
  umbrellaIcon.style.transform = `rotate(${rotation}deg)`;
  requestAnimationFrame(animateUmbrella);
}
animateUmbrella();

// --- слушатели кнопок ---
document.querySelector("#bern").addEventListener("click", () => showUV(cities.bern));
document.querySelector("#tokyo").addEventListener("click", () => showUV(cities.tokyo));
document.querySelector("#madrid").addEventListener("click", () => showUV(cities.madrid));
document.querySelector("#newyork").addEventListener("click", () => showUV(cities.newyork));
document.querySelector("#dubai").addEventListener("click", () => showUV(cities.dubai));

searchBtn.addEventListener("click", () => searchCity(cityInput.value));
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchCity(cityInput.value);
});

// --- показать по умолчанию ---
showUV(cities.bern);