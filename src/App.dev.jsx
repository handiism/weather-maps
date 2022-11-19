import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { stringify } from "qs";
import Maps from "./components/Maps.dev";
import Weather from "./components/Weather.dev";
import "./App.css";
import "./styles/Style.css";
import "./styles/Form.css";
import Snackbar from "@mui/material/Snackbar";

// Membaca .env
const weatherApiKey =
  process.env.REACT_APP_WEATHER_API_KEY || "0a80fb875c89d2a83e4e488fee2fcd64";

// Membaca .env
const mapsApiKey =
  process.env.REACT_APP_MAPS_API_KEY ||
  "AIzaSyBbZkKZtHcLLZoGLarC32BgVUETa_2lTms";

// Halaman /
function App() {
  // Deklarasi state geolokasi
  // coords = koordinat lokasi sekarang (latitude, longitude)
  // isGeolocationAvailable = akan mengembalikan nilai true jika
  //                        platform yang mengakses terdapat gps
  // isGeolocationEnabled = akan mengembalikan nilai true jika
  //                        perizinan lokasi diterima
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated();

  // Deklarasi posisi awal (Jakarta)
  // position = posisi koordinat
  // setPosition = fungsi untuk mengubah posisi koordinat
  const [position, setPosition] = useState({
    // Latitude
    lat: -6.212662980595007,
    // Longitude
    lng: 106.84186478413419,
    // Nama lokasi
    name: "Jakarta",
  });

  // Deklarasi data cuaca
  const [weatherData, setWeatherData] = useState({
    // Nama lokasi
    name: "",
    // Tanggal
    date: new Date(),
    // Deskripsi
    description: "",
    // Kelembaban
    humidity: 0,
    // Ikon cuaca
    icon: "",
    // Suhu
    temperature: 0,
    // Kecepatan angin
    wind: 0,
  });

  // Deklarasi snackbar
  const [visibility, setVisibility] = useState({
    // Jika open == true, maka snackbar akan ditampilkan,
    // jika tidak snackbar tidak akan ditampilkan
    open: false,
    // Pesan yang ditampilkan dalam snackbar
    message: "",
  });

  // Deklarasi referensi ke elemen input cuaca html
  const inputRef = useRef(null);

  // Fungi dilakukan ketika halaman telah di load
  useEffect(() => {
    // Mengubah nama halaman
    document.title = "Weather Maps";
  }, []);

  // Callback ketika snackbar hilang
  const handleClose = () => {
    // Snackbar yang semula open menjadi tertutup
    setVisibility({
      open: false,
      message: "",
    });
  };

  // Callback ketika button nya di click
  const submit = (e) => {
    e.preventDefault();

    // Mengambil nilai dari elemen input html
    const location = String(inputRef.current?.value);

    // Jika lokasi tidak ada (string kosong) maka proses tidak dilanjutkan
    if (!location) {
      return;
    }

    // Deklarasi url API untuk mengambil  koordinat posisi berdasarkan input tadi
    const getPositionUri = `http://34.101.216.127:8080/find?${stringify({
      input: location,
      inputtype: "textquery",
      fields: "formatted_address,name,geometry",
      key: mapsApiKey,
    })}`;

    // Membuat API call ke url sebelumnya
    axios
      .get(getPositionUri)
      .then((res) => {
        console.log(res.data.candidates[0].geometry.location);

        // Jika API call berhasil maka atur posisi ke responnya
        setPosition({
          lat: Number(res.data.candidates[0].geometry.location.lat),
          lng: Number(res.data.candidates[0].geometry.location.lng),
          name: String(res.data.candidates[0].name),
        });
      })
      .catch((e) => {
        // Jika API call tidak berhasil maka akan menampilkan snackbar
        setVisibility({
          message: "Place Not Found",
          open: true,
        });
      });
  };

  // callback ketika nilai dari variabel position diubah
  useEffect(() => {
    // Deklarasi URL API cuaca
    const getWeatherUri = `https://api.openweathermap.org/data/2.5/weather?${stringify(
      {
        lat: position.lat,
        lon: position.lng,
        units: "metric",
        appid: weatherApiKey,
      }
    )}`;

    // Mengirim API call ke URL sebelumnya
    axios
      .get(getWeatherUri)
      .then((res) => {
        // Jika API call berhasil maka variabel cuaca akan diubah
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
      .catch((e) =>
        // Jika PAI call gagal maka akan menampilkan snackbar
        setVisibility({
          message: "Weather Not Found",
          open: true,
        })
      );
  }, [position]);

  // Callback ketika variabel lokasi diubah
  useEffect(() => {
    // Jika platform mendukung GPS
    if (isGeolocationAvailable) {
      // Jika GPS diaktifkan
      if (isGeolocationEnabled) {
        // Jika koordinat lokasi didapatkan
        if (coords) {
          // Akan menampilan snackbar jika koordinat lokasi berhasil
          // didapatkan
          setVisibility({
            open: true,
            message: "Successfully Obtained Your Current Location",
          });

          //
          setPosition({
            lat: coords.latitude,
            lng: coords.longitude,
            name: "Your Location",
          });
          return;
        }

        // Akan menampilkan snackbar jika GPS dihidupkan tetapi
        // tidak dapat mengambil lokasi
        setVisibility({
          open: true,
          message: "Failed To Obtain Your Current Location",
        });
        return;
      }

      // Akan menampilkan snackbar jika perizinan lokasi tidak diizinkan
      setVisibility({
        message: "Please Allow Location Service",
        open: true,
      });
      return;
    }

    // Akan menampilkan snackbar jika platform tidak mendukung gps
    setVisibility({
      message: "Your Device Does Not Support Location Service",
      open: true,
    });
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  return (
    <div className="App">
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        autoHideDuration={2000}
        open={visibility.open}
        onClose={handleClose}
        message={visibility.message}
      />
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
