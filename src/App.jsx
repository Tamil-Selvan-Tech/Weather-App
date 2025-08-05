import React, { useState, useEffect } from 'react'
import './App.css'
//images
import cloudIcon from "./assets/cloud.png"
import drizzleIcon from './assets/drizzle.png'
import humidityIcon from './assets/humidity.png'
import rainIcon from './assets/rain.png'
import searchIcon from './assets/search.png'
import snowIcon from './assets/snow.png'
import sunIcon from './assets/sun.png'
import windIcon from './assets/wind.png'
import foggIcon from './assets/fogg.png'
import thunderIcon from './assets/thunder.png'

//weather Details and props

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img
          src={icon}
          alt="weather-icon"
          className={`weather-icon ${icon === sunIcon ? "sun-icon" : ""}`} 
        />
      </div>

      <div className="temp">{temp} &deg;C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>

      <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">Longitude</span>
          <span>{log}</span>
        </div>
      </div>

      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};



const App = () => {
  let api_key = "bcd61d046eb6c263d830df5f39f87fbc";
  const [text, setText] = useState("chennai")

  const [icon, setIcon] = useState();
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [log, setLog] = useState(0);
  const [lat, setLat] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  //loading 

  const [cityNotFound, setCityNotFound] = useState(false)
  //Error and loading
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  //Weather Icon set the map
  const weatherIconMap = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "11d": thunderIcon, // thunderstorm fallback
    "11n": thunderIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "50d": foggIcon, // mist fallback
    "50n": foggIcon,
  };

  //API connect
  const search = async () => {
    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`
    //convert the data 
    try {
      let res = await fetch(url)
      let data = await res.json();
      // console.log(data)
      if (data.cod === "404") {
        console.error("City Not Found")
        setCityNotFound(true)
        setLoading(false)
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat)
      setLog(data.coord.lon)

      const weatherIconCode = data.weather[0].icon
      setIcon(weatherIconMap[weatherIconCode] || snowIcon)
      setCityNotFound(false)
    }
    catch (error) {
      console.error("An error occurred:", error.message);
      setError("An Error occurred while fetching weather data.")

    }
    finally {
      setLoading(false)

    }

  }

  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search()
    }
  }

  useEffect(function () {
    search()
  }, []);

  //weather-app Main Container

  return (
    <>
      <div className="main-container">
        <div className="input-container">
          <input type="text"
            className='cityInput '
            placeholder='search City'
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown} />
          <div className="search-icon" onClick={() => search()}>
            <img className='search' src={searchIcon} alt="search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city}
          country={country} lat={lat} log={log}
          humidity={humidity} wind={wind} />}

        <div className="copy-right">
          <p>
            Designed By <span>TAMIL</span>
          </p>
        </div>

      </div>
    </>
  )
}

export default App