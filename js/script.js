const cities = {
  bern:    { name: "Bern",     lat: 46.948,  lon: 7.447,   timezone: "Europe/Zurich" },
  tokyo:   { name: "Tokyo",    lat: 35.676,  lon: 139.65,  timezone: "Asia/Tokyo" },
  madrid:  { name: "Madrid",   lat: 40.416,  lon: -3.703,  timezone: "Europe/Madrid" },
  newyork: { name: "New York", lat: 40.712,  lon: -74.006, timezone: "America/New_York" },
  dubai:   { name: "Dubai",    lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai" }
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
const locationTime = document.querySelector("#location-time");

// Aktuelle UV-Daten von der API abrufen
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

// Stadt suchen und Koordinaten über die Geocoding-API ermitteln
async function searchCity(cityName) {
  if (!cityName.trim()) { alert("Please enter a city"); return; }
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || data.results.length === 0) { alert("City not found"); return; }
    const city = { name: data.results[0].name, lat: data.results[0].latitude, lon: data.results[0].longitude, timezone: data.results[0].timezone || null };
    document.querySelectorAll(".city-buttons button").forEach(btn => btn.classList.remove("active"));
    showUV(city);
  } catch (error) { console.error(error); alert("Something went wrong"); }
}

// Alle Icons und Bären ausblenden
function hideIcons() {
  sunIcon.style.display = "none";
  sunglassesIcon.style.display = "none";
  sunscreenIcon.style.display = "none";
  umbrellaIcon.style.display = "none";
  document.querySelector("#bear-low").style.display = "none";
  document.querySelector("#bear-medium").style.display = "none";
  document.querySelector("#bear-high").style.display = "none";
  const icecream = document.querySelector("#icecream");
  if (icecream) icecream.style.display = "none";
  document.querySelector(".bear-hint")?.remove();
}

// Lokale Uhrzeit der ausgewählten Stadt ermitteln
function getCityTime(timezone) {
  if (!timezone) return "";
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: timezone }).format(new Date());
}

function getHourInTimezone(dateStr, timezone) {
  return parseInt(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", timeZone: timezone || "UTC" }).format(new Date(dateStr)));
}

// UV-Daten laden und die Benutzeroberfläche aktualisieren
async function showUV(city, skipLoader = false) {
  localStorage.setItem("lastCity", JSON.stringify(city));
  if (!skipLoader) {
    loader.style.display = "flex";
    document.querySelectorAll(".forecast-card").forEach(card => card.style.filter = "brightness(0.85)");
    const uvData = await loadUV(city.lat, city.lon);
    await new Promise(resolve => setTimeout(resolve, 200));
    loader.style.display = "none";
    uvCard.classList.add("loaded");
    document.querySelectorAll(".forecast-card").forEach(card => card.style.filter = "brightness(1)");
    return processUVData(city, uvData);
  } else {
    const uvData = await loadUV(city.lat, city.lon);
    return processUVData(city, uvData);
  }
}

// UV-Wert auswerten und passende Inhalte anzeigen
function processUVData(city, uvData) {
  if (!uvData) {
    uvNumber.textContent = "Error"; risk.textContent = "No data";
    advice.textContent = "Please try again"; warning.textContent = "Could not load UV data.";
    hideIcons(); locationTime.textContent = city.name; return;
  }
  const uv = uvData.now.uvi;
  uvNumber.textContent = `UV ${uv}`;
  uvCard.classList.remove("low", "medium", "high");
  hideIcons();
  if (uv < 3) {
    uvCard.classList.add("low"); risk.textContent = "Low risk";
    advice.textContent = "No protection required"; warning.textContent = "UV is low at the moment.";
    sunIcon.style.display = "block";
    document.querySelector("#bear-low").style.display = "block";
    
    setTimeout(initIcecreamDrag, 1500);
  } else if (uv < 6) {
    
    uvCard.classList.add("medium"); risk.textContent = "Medium risk";
    advice.textContent = "Use sunscreen"; warning.textContent = "Protection is recommended.";
    sunglassesIcon.style.display = "block"; sunscreenIcon.style.display = "block";
    document.querySelector("#bear-medium").style.display = "block";
  } else {
    
    uvCard.classList.add("high"); risk.textContent = "High risk";
    advice.textContent = "Avoid strong sun"; warning.textContent = "Warning: UV is high.";
    umbrellaIcon.style.display = "block";
    document.querySelector("#bear-high").style.display = "block";
  }
  const cityTime = getCityTime(city.timezone);
  if (city.name.length > 10) {
    locationTime.classList.add("small");
    document.querySelector(".info-box").style.maxHeight = "190px";
    locationTime.innerHTML = cityTime ? `${city.name} &middot;<br>${cityTime}` : city.name;
  } else if (city.name.length > 7) {
    locationTime.classList.add("small");
    document.querySelector(".info-box").style.maxHeight = "170px";
    locationTime.textContent = cityTime ? `${city.name} - ${cityTime}` : city.name;
  } else {
    locationTime.classList.remove("small");
    document.querySelector(".info-box").style.maxHeight = "170px";
    locationTime.textContent = cityTime ? `${city.name} - ${cityTime}` : city.name;
  }
  // Beste und ungünstigste Tageszeit anhand der UV-Prognose berechnen
  const hourly = uvData.forecast;
  const minUV = Math.min(...hourly.map(h => h.uvi));
  const maxUV = Math.max(...hourly.map(h => h.uvi));
  const bestHour = hourly.find(h => h.uvi === minUV);
  const avoidHour = hourly.find(h => h.uvi === maxUV);
  const bestH = getHourInTimezone(bestHour.time, city.timezone);
  const avoidH = getHourInTimezone(avoidHour.time, city.timezone);
  document.querySelector(".side-info .time-item:nth-child(1) p").innerHTML = `<strong>Best time</strong><br>${bestH}:00-${bestH + 1}:00`;
  document.querySelector(".side-info .time-item:nth-child(2) p").innerHTML = `<strong>Avoid</strong><br>${avoidH}:00-${avoidH + 1}:00`;
  displayDailyForecast(city, uvData.forecast);
}

// Tagesprognose für Morgen, Nachmittag und Abend erstellen
function displayDailyForecast(city, forecast) {
  let fc = document.querySelector("#daily-forecast");
  if (!fc) { fc = document.createElement("div"); fc.id = "daily-forecast"; document.querySelector("main").appendChild(fc); }
  const now = Date.now();
  const in24h = now + 24 * 60 * 60 * 1000;
  const todayEntries = forecast.filter(e => { const t = new Date(e.time).getTime(); return t >= now - 60 * 60 * 1000 && t <= in24h; });
  const periods = { "Morning": { hours: [5,6,7,8,9,10], entries: [] }, "Afternoon": { hours: [11,12,13,14,15,16], entries: [] }, "Evening": { hours: [17,18,19,20,21], entries: [] } };
  todayEntries.forEach(e => {
    const localHour = parseInt(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", timeZone: city.timezone || "UTC" }).format(new Date(e.time)));
    for (const period of Object.values(periods)) { if (period.hours.includes(localHour)) period.entries.push(e.uvi); }
  });
  fc.innerHTML = `<h3 class="forecast-title">${city.name} - UV forecast</h3><div class="forecast-cards">${Object.entries(periods).map(([name, period]) => {
    const max = period.entries.length ? Math.max(...period.entries) : 0;
    const cardClass = max < 3 ? "low" : max < 6 ? "medium" : "high";
    const riskLabel = max < 3 ? "Low risk" : max < 6 ? "Medium risk" : max < 8 ? "High risk" : "Very high risk";
    const adviceText = max < 3 ? "No protection needed" : max < 6 ? "Wear sunscreen SPF 30+" : max < 8 ? "Limit time in sun" : "Avoid sun exposure";
    return `<div class="forecast-card ${cardClass}"><div class="forecast-period">${name}</div><div class="forecast-uvi">UV ${max}</div><div class="forecast-risk">${riskLabel}</div><div class="forecast-advice">${adviceText}</div></div>`;
  }).join("")}</div>`;
}

// Animation der Sonne
let angle = 0; let time = 0;
function animateSun() { angle += 0.8; time += 0.08; sunIcon.style.transform = `rotate(${angle}deg) scale(${1 + Math.sin(time) * 0.18})`; requestAnimationFrame(animateSun); }
animateSun();

// Animation des Sonnenschirms
let umbrellaTime = 0;
function animateUmbrella() { umbrellaTime += 0.04; umbrellaIcon.style.transform = `rotate(${Math.sin(umbrellaTime) * 8}deg)`; requestAnimationFrame(animateUmbrella); }
animateUmbrella();

// Animation des Sonnencreme-Icons
if (sunscreenIcon) {
  let scale = 1; const maxScale = 1.3; const speed = 0.01; const holdTime = 500; let increasing = true;
  function animateSunscreenScale() {
    if (increasing) { scale += speed; if (scale >= maxScale) { scale = maxScale; increasing = false; sunscreenIcon.style.transform = `scale(${scale})`; setTimeout(() => requestAnimationFrame(animateSunscreenScale), holdTime); return; } }
    else { scale -= speed; if (scale <= 1) { scale = 1; increasing = true; sunscreenIcon.style.transform = `scale(${scale})`; setTimeout(() => requestAnimationFrame(animateSunscreenScale), holdTime); return; } }
    sunscreenIcon.style.transform = `scale(${scale})`; requestAnimationFrame(animateSunscreenScale);
  }
  animateSunscreenScale();
}

document.querySelector("#bern").addEventListener("click", () => showUV(cities.bern));
document.querySelector("#tokyo").addEventListener("click", () => showUV(cities.tokyo));
document.querySelector("#madrid").addEventListener("click", () => showUV(cities.madrid));
document.querySelector("#newyork").addEventListener("click", () => showUV(cities.newyork));
document.querySelector("#dubai").addEventListener("click", () => showUV(cities.dubai));
searchBtn.addEventListener("click", () => searchCity(cityInput.value));
cityInput.addEventListener("keydown", (e) => { if (e.key === "Enter") searchCity(cityInput.value); });

const cityButtons = document.querySelectorAll(".city-buttons button");
cityButtons.forEach(button => {
  button.addEventListener("click", () => { cityButtons.forEach(btn => btn.classList.remove("active")); button.classList.add("active"); });
});

const savedCity = localStorage.getItem("lastCity");
if (savedCity) {
  const c = JSON.parse(savedCity);
  cityButtons.forEach(btn => { if (btn.textContent.trim().toLowerCase() === c.name.toLowerCase()) btn.classList.add("active"); });
  showUV(c);
} else {
  uvCard.classList.add("loaded");
  showUV(cities.bern, true);
}
// Tooltip über dem Bären anzeigen
function showTooltip(tooltip, bear) {
  const bearRect = bear.getBoundingClientRect();
  tooltip.style.position = "fixed";
  tooltip.style.left = (bearRect.left + bearRect.width / 2) + "px";
  tooltip.style.top = (bearRect.top - 10) + "px";
  tooltip.style.transform = "translateX(-50%) translateY(-100%)";
  tooltip.style.bottom = "auto";
  tooltip.classList.add("visible");
  const updatePos = () => { const r = bear.getBoundingClientRect(); tooltip.style.left = (r.left + r.width / 2) + "px"; tooltip.style.top = (r.top - 10) + "px"; };
  window.addEventListener("scroll", updatePos, { passive: true });
  setTimeout(() => window.removeEventListener("scroll", updatePos), 3500);
}

document.querySelectorAll(".bear").forEach(bear => {
  const tooltip = document.createElement("div");
  tooltip.className = "bear-tooltip";
  tooltip.textContent = bear.dataset.tooltip;
  document.body.appendChild(tooltip);
  if (window.matchMedia("(hover: hover)").matches) {
    bear.addEventListener("mouseenter", () => { if (bear.id === "bear-low") return; showTooltip(tooltip, bear); });
    bear.addEventListener("mouseleave", () => { tooltip.classList.remove("visible"); });
  }
});


let icecreamInitialized = false;
// Drag-and-Drop-Interaktion für das Eis initialisieren
function initIcecreamDrag() {
  const icecream = document.querySelector("#icecream");
  const bear = document.querySelector("#bear-low");
  const card = document.querySelector("#uv-card");
  if (!icecream || !bear || !card) return;
if (icecreamInitialized) return;
icecreamInitialized = true;

icecream.style.display = "block";
  icecream.setAttribute("draggable", "false");
  icecream.style.touchAction = "none";

  document.querySelector(".bear-hint")?.remove();
  const hint = document.createElement("div");
  hint.className = "bear-hint bear-hint--persistent";
  hint.innerHTML = "Pass me some ice cream,<br>please 🍦";

  if (window.innerWidth <= 480) {
    card.appendChild(hint);
    card.appendChild(icecream);
    card.appendChild(bear);
  } else {
    card.appendChild(hint);
  }

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  icecream.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    icecream.style.transition = "none";
    icecream.style.zIndex = "9999";
    icecream.style.transform = "translate(0, 0) scale(1.1)";
    icecream.setPointerCapture(e.pointerId);
  });

  icecream.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    icecream.style.transform = `translate(${e.clientX - startX}px, ${e.clientY - startY}px) scale(1.1)`;
  });

  // Nach dem Loslassen prüfen, ob das Eis den Bären erreicht hat
  icecream.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;
    const icRect = icecream.getBoundingClientRect();
    const bearRect = bear.getBoundingClientRect();
    const cx = icRect.left + icRect.width / 2;
    const cy = icRect.top + icRect.height / 2;
    const isOnBear = cx >= bearRect.left && cx <= bearRect.right && cy >= bearRect.top && cy <= bearRect.bottom;
    if (isOnBear) {
      icecream.style.display = "none";
      icecream.style.transform = "";
      document.querySelector(".bear-hint")?.remove();
      const tooltip = document.body.querySelector(".bear-tooltip");
      if (tooltip) { showTooltip(tooltip, bear); setTimeout(() => tooltip.classList.remove("visible"), 3000); }
    } else {
      icecream.style.transition = "transform 0.25s ease";
      icecream.style.transform = "translate(0, 0)";
    }
  });
}


