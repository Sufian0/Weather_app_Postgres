import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, CircularProgress } from '@mui/material';

interface WeatherData {
  city: string;
  description: string;
  icon: string;
  temperature: number;
}

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get<WeatherData>('http://localhost:5000/api/weather?city=London');
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (!weather) {
    return <Typography>No weather data available</Typography>;
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>{weather.city}</Typography>
          <img src={weather.icon} alt={weather.description} style={{ width: 64, height: 64 }} />
          <Typography variant="h5">{weather.temperature}°C</Typography>
          <Typography variant="body1">{weather.description}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;