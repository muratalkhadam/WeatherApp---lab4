const express = require("express");
const axios = require("axios");
const hbs = require("hbs");
const app = express();
const PORT = 3000;
require("dotenv").config();

app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");
app.use(express.static("public"));

async function getWeather(city) {
  try {
    const apiKey = "dab3b5b5a455ff4d6d0403941edf4e36";
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;
    const weather = {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
    };
    return weather;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

app.get("/", (req, res) => {
  const cities = ["Odesa", "Kyiv", "Lviv", "Ternopil", "Cherkasy", "Obukhiv"];
  res.render("index", { cities });
});

app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;
  try {
    const weather = await getWeather(city);
    console.log(weather);
    res.render("weather", { weather });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
