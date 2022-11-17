type WeatherData = {
  name: string;
  icon: string;
  date: Date;
  temperature: number;
  description: string;
  humidity: number;
  wind: number;
};

export type Position = google.maps.LatLngLiteral & { name: string };

export default WeatherData;
