import WeatherData from "../WeatherData";
import "../styles/Weather.css";

const Weather = ({ data }: { data: WeatherData }) => {
  return (
    <div className="Weather-container">
      <div className="Top-content">
        <p className="font-medium">
          {`${data.date.toLocaleString("en", {
            weekday: "long",
          })}, ${data.date.toLocaleString("en", {
            day: "2-digit",
          })} ${data.date.toLocaleString("en", {
            month: "long",
          })}`}
        </p>
      </div>
      <div className="Mid-content">
        <div className="Left">
          <div>
            <img
              width={70}
              src={`http://openweathermap.org/img/w/${data.icon}.png`}
              alt=""
            />
          </div>
          <p className="Mid-content-temp">
            {data.temperature}
            <span className="Temp-icon">°C</span>
          </p>
        </div>
        <div className="Right">
          <p className="Right-Description">{data.description}</p>
          <p>Humidity: {data.humidity}%</p>
          <p>Wind: {data.wind} mph</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
