const apiKey = "e3b0a255d7e5bd89da413bde104d8275";

/* ⌨️ Enter key search */
document.getElementById("cityInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") getWeather();
});

/* 🕒 Time */
setInterval(() => {
  const now = new Date();
  document.getElementById("time").innerText =
    now.getHours() + ":" + String(now.getMinutes()).padStart(2, '0');
}, 1000);

/* 🌤 Icon */
function getWeatherIcon(cond) {
  cond = cond.toLowerCase();
  if (cond.includes("cloud")) return "☁️";
  if (cond.includes("rain")) return "🌧";
  if (cond.includes("clear")) return "☀️";
  if (cond.includes("storm")) return "⛈";
  if (cond.includes("snow")) return "❄️";
  return "🌍";
}

/* 🎨 Background */
function setBackground(cond) {
  cond = cond.toLowerCase();

  let img = "";

  if (cond.includes("clear"))
    img = "https://images.unsplash.com/photo-1501973801540-537f08ccae7b";
  else if (cond.includes("cloud"))
    img = "https://images.unsplash.com/photo-1527766833261-b09c3163a791";
  else if (cond.includes("rain"))
    img = "https://images.unsplash.com/photo-1501696461415-6bd6660c6742";
  else
    img = "https://images.unsplash.com/photo-1500674425229-f692875b0ab7";

  document.body.style.background = `url(${img}) center/cover no-repeat`;
}

/* 🌍 Get weather by city */
async function getWeather() {
  const city = document.getElementById("cityInput").value;

  if (!city) return alert("Enter city");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.cod != 200) return alert("City not found");

  showWeather(data);

  getForecast(city);
}

/* 📍 Auto location */
function getLocation() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    showWeather(data);
    getForecastByCoords(lat, lon);
  });
}

/* 🌤 Show weather */
function showWeather(data) {
  const icon = getWeatherIcon(data.weather[0].description);
  setBackground(data.weather[0].description);

  document.getElementById("weatherResult").innerHTML = `
    <h2>${data.name}</h2>
    <h1>${icon}</h1>
    <p>${data.main.temp} °C</p>
    <p>${data.weather[0].description}</p>
  `;
}

/* 📅 Forecast (city) */
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  showForecast(data);
}

/* 📅 Forecast (coords) */
async function getForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  showForecast(data);
}

/* 📅 Show forecast */
function showForecast(data) {
  let html = "<div class='forecast'>";

  for (let i = 0; i < data.list.length; i += 8) {
    const day = data.list[i];

    const date = new Date(day.dt_txt).toDateString().slice(0, 10);
    const icon = getWeatherIcon(day.weather[0].description);

    html += `
      <div class="day">
        <p>${date}</p>
        <h3>${icon}</h3>
        <p>${day.main.temp}°C</p>
      </div>
    `;
  }

  html += "</div>";

  document.getElementById("weatherResult").innerHTML += html;
}

/* 🚀 Auto load location */
window.onload = () => getLocation();