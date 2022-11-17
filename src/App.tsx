import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { stringify } from "qs";
import Maps from "./components/Maps";
import WeatherData, { Position } from "./WeatherData";
import Weather from "./components/Weather";
import "./App.css";
import "./styles/Style.css";
import "./styles/Form.css";

const weatherApiKey =
  process.env.REACT_APP_WEATHER_API_KEY || "0a80fb875c89d2a83e4e488fee2fcd64";

const mapsApiKey =
  process.env.REACT_APP_MAPS_API_KEY ||
  "AIzaSyBbZkKZtHcLLZoGLarC32BgVUETa_2lTms";

function App() {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated();

  const [position, setPosition] = useState<Position>({
    lat: -6.212662980595007,
    lng: 106.84186478413419,
    name: "",
  });

  const [weatherData, setWeatherData] = useState<WeatherData>({
    name: "",
    date: new Date(),
    description: "",
    humidity: 0,
    icon: "",
    temperature: 0,
    wind: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Weather Maps";
  }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const location = String(inputRef.current?.value);
    if (!location) {
      return;
    }

    const getPositionUri = `http://34.101.216.127:8080/find?${stringify({
      input: location,
      inputtype: "textquery",
      fields: "formatted_address,name,geometry",
      key: mapsApiKey,
    })}`;

    axios
      .get(getPositionUri)
      .then((res) => {
        console.log(res.data.candidates[0].geometry.location);

        setPosition({
          lat: Number(res.data.candidates[0].geometry.location.lat),
          lng: Number(res.data.candidates[0].geometry.location.lng),
          name: String(res.data.candidates[0].name),
        });
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    const getWeatherUri = `https://api.openweathermap.org/data/2.5/weather?${stringify(
      {
        lat: position.lat,
        lon: position.lng,
        units: "metric",
        appid: weatherApiKey,
      }
    )}`;

    axios
      .get(getWeatherUri)
      .then((res) => {
        setWeatherData({
          name: position.name,
          date: new Date(),
          description: String(res.data.weather[0].description),
          humidity: Number(res.data.main.humidity),
          icon: String(res.data.weather[0].icon),
          temperature: Number(res.data.main.temp),
          wind: Number(res.data.wind.speed),
        });
      })
      .catch((e) => console.log(e));
  }, [position]);

  useEffect(() => {
    if (isGeolocationAvailable) {
      if (isGeolocationEnabled) {
        if (coords) {
          setPosition({
            lat: coords.latitude,
            lng: coords.longitude,
            name: "Your Location",
          });
        }
      }
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  return (
    <div className="App">
      <div className="Weather">
        <div className="Center">
          <h1 className="text-white font-medium text-6xl">Weather Maps</h1>
          <p className="text-white font-normal text-lg  mb-11">
            Find A Weather Based On Your Location
          </p>
          <form onSubmit={submit} className="Form" autoComplete="off">
            <input
              ref={inputRef}
              className="Input"
              type="text"
              autoComplete="off"
              name="city"
              placeholder="Search Places"
            />
            <button className="Button">Get Weather</button>
          </form>
          <Weather data={weatherData}></Weather>
        </div>
      </div>
      {coords ? (
        <Maps
          apiKey={mapsApiKey}
          center={{ lat: position.lat, lng: position.lng }}
        ></Maps>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
