// src/components/WeatherHistory.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoricalData {
  date: string;
  temperature: number;
}

interface WeatherHistoryProps {
  city: string;
}

const WeatherHistory: React.FC<WeatherHistoryProps> = ({ city }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(`/api/historical?city=${city}`);
        setHistoricalData(response.data);
      } catch (error) {
        console.error('Failed to fetch historical data', error);
      }
    };

    fetchHistoricalData();
  }, [city]);

  const chartData = {
    labels: historicalData.map(data => data.date),
    datasets: [
      {
        label: 'Temperature',
        data: historicalData.map(data => data.temperature),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Historical Temperature Data',
      },
    },
  };

  return (
    <div className="weather-history">
      <h3>Historical Weather Data</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeatherHistory;