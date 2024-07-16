import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, CircularProgress, TextField, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePickerProps } from '@mui/x-date-pickers/DatePicker';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WeatherData {
  city: string;
  description: string;
  icon: string;
  temperature: number;
}

interface HistoricalData {
  date: string;
  temperature: number;
}

function App() {
  const [city, setCity] = useState<string>('London');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const fetchWeather = async () => {
    console.log('Fetching weather data...');
    setLoading(true);
    try {
      const currentWeatherResponse = await axios.get<WeatherData>(`http://localhost:5000/api/weather?city=${city}`);
      console.log('Current weather data:', currentWeatherResponse.data);
      setWeather(currentWeatherResponse.data);
  
      const historicalResponse = await axios.get<HistoricalData[]>(`http://localhost:5000/api/historical?city=${city}&start=${startDate?.toISOString().split('T')[0]}&end=${endDate?.toISOString().split('T')[0]}`);
      console.log('Historical data:', historicalResponse.data);
      setHistoricalData(historicalResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Component mounted');
    fetchWeather().catch(error => console.error('Error in fetchWeather:', error));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  };

  const chartData = {
    labels: historicalData.map(data => data.date),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData.map(data => data.temperature),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div>
      <h1>Weather App</h1>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              margin="normal"
              fullWidth
            />
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue: Date | null) => setStartDate(newValue)}
              slots={{
                textField: (params) => <TextField {...params} fullWidth margin="normal" />
              }}
            />

            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue: Date | null) => setEndDate(newValue)}
              slots={{
                textField: (params) => <TextField {...params} fullWidth margin="normal" />
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Get Weather
            </Button>
          </form>
          {loading && <CircularProgress />}
        
          {weather && (
            <Card style={{ marginTop: '2rem' }}>
              <CardContent>
                <Typography variant="h5">{weather.city}</Typography>
                <Typography variant="body1">Temperature: {weather.temperature}°C</Typography>
                <Typography variant="body1">Description: {weather.description}</Typography>
                <img src={weather.icon} alt="Weather icon" />
              </CardContent>
            </Card>
          )}

          {historicalData.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <Typography variant="h6">Historical Data</Typography>
              <Line data={chartData} />
            </div>
          )}
        </Container>
      </LocalizationProvider>
    </div>
  );
}

export default App;