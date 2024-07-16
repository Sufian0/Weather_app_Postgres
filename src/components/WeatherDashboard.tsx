// src/components/WeatherDashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherSearch from './WeatherSearch';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import WeatherHistory from './WeatherHistory';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

const WeatherDashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/weather?city=${city}`);
      setWeatherData(response.data);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-dashboard">
      <WeatherSearch onSearch={fetchWeatherData} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <>
          <CurrentWeather data={weatherData} />
          <WeatherForecast city={weatherData.city} />
          <WeatherHistory city={weatherData.city} />
        </>
      )}
    </div>
  );
};

export default WeatherDashboard;