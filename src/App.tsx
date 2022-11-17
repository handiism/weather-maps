import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { stringify } from "qs";
import Maps from "./components/Maps";
import WeatherData from "./WeatherData";
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

  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: -6.212662980595007,
    lng: 106.84186478413419,
  });

  const [weatherData, setWeatherData] = useState<WeatherData>({
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

  const formOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const location = String(inputRef.current?.value);
    if (!location) {
      return;
    }

    const uri = `http://34.101.216.127:8080?${stringify({
      input: location,
      inputtype: "textquery",
      fields: "formatted_address,name,geometry",
      key: mapsApiKey,
    })}`;

    axios
      .get(uri)
      .then((res) => {
        setPosition({
          lat: Number(res.data.candidates[0].geometry.location.lat),
          lng: Number(res.data.candidates[0].geometry.location.lon),
        });

        (inputRef.current as HTMLInputElement).value = String(
          res.data.candidates[0].formatted_address
        );
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (isGeolocationAvailable) {
      if (isGeolocationEnabled) {
        if (coords) {
          const data: WeatherData = {
            date: new Date(),
            description: "",
            humidity: 0,
            icon: "",
            temperature: 0,
            wind: 0,
          };

          setPosition({
            lat: coords.latitude,
            lng: coords.longitude,
          });

          let uri = `https://api.openweathermap.org/data/2.5/weather?${stringify(
            {
              lat: coords.latitude,
              lon: coords.longitude,
              units: "metric",
              appid: weatherApiKey,
            }
          )}`;

          axios
            .get(uri)
            .then((res) => {
              data.date = new Date();
              data.description = String(res.data.weather[0].description);
              data.humidity = Number(res.data.main.humidity);
              data.icon = String(res.data.weather[0].icon);
              data.temperature = Number(res.data.main.temp);
              data.wind = Number(res.data.wind.speed);
              setWeatherData(data);
            })
            .catch((e) => console.log(e));

          console.log(data);
        }
      }
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  return (
    <div className="App">
      <div className="Weather">
        <div className="Center">
          <h1 className="text-white font-medium text-6xl mb-11">
            Weather Maps
          </h1>
          <form onSubmit={formOnSubmit} className="Form" autoComplete="off">
            <input
              ref={inputRef}
              className="Input"
              type="text"
              autoComplete="off"
              name="city"
              placeholder="Search Place"
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
