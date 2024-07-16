// src/components/WeatherForecast.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ForecastData {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

interface WeatherForecastProps {
  city: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ city }) => {
  const [forecast, setForecast] = useState<ForecastData[]>([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(`/api/forecast?city=${city}`);
        setForecast(response.data);
      } catch (error) {
        console.error('Failed to fetch forecast', error);
      }
    };

    fetchForecast();
  }, [city]);

  return (
    <div className="weather-forecast">
      <h3>5-Day Forecast</h3>
      <div className="forecast-list">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <p>{day.date}</p>
            <img src={`http://openweathermap.org/img/wn/${day.icon}.png`} alt={day.description} />
            <p>{day.temperature}°C</p>
            <p>{day.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;