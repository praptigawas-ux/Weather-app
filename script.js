const apiKey = "e3b0a255d7e5bd89da413bde104d8275"; // Replace with your OpenWeatherMap API key

async function getWeather() {
  const city = document.getElementById("cityInput").value;

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    
    console.log(response); // DEBUG

    const data = await response.json();
    console.log(data); // DEBUG

    if (data.cod != 200) {
      document.getElementById("weatherResult").innerHTML = data.message;
      return;
    }

    document.getElementById("weatherResult").innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Weather: ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
    `;

  } catch (error) {
    console.log(error);
    document.getElementById("weatherResult").innerHTML = "Error fetching data.";
  }
}