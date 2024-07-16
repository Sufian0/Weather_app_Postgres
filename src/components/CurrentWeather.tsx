// src/components/CurrentWeather.tsx
import React from 'react';

interface CurrentWeatherProps {
  data: {
    city: string;
    temperature: number;
    description: string;
    icon: string;
  };
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  return (
    <div className="current-weather">
      <h2>{data.city}</h2>
      <img src={`http://openweathermap.org/img/wn/${data.icon}@2x.png`} alt={data.description} />
      <p>{data.temperature}°C</p>
      <p>{data.description}</p>
    </div>
  );
};

export default CurrentWeather;