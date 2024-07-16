import requests
from config_OLD import API_KEY, BASE_URL

def fetch_weather_data(city):
    url = f"{BASE_URL}/forecast.json?key={API_KEY}&q={city}&days=3"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None

def get_current_weather(city):
    data = fetch_weather_data(city)
    if data:
        current = data['current']
        return {
            'temperature': current['temp_c'],
            'condition': current['condition']['text'],
            'wind': current['wind_kph'],
            'humidity': current['humidity']
        }
    return None

def get_forecast(city, days=3):
    data = fetch_weather_data(city)
    if data:
        forecast = data['forecast']['forecastday']
        return [{
            'date': day['date'],
            'max_temp': day['day']['maxtemp_c'],
            'min_temp': day['day']['mintemp_c'],
            'condition': day['day']['condition']['text']
        } for day in forecast[:days]]
    return None