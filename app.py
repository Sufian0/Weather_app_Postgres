from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
if not os.getenv('DATABASE_URL'):
    raise ValueError("No DATABASE_URL set for Flask application")

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# WeatherAPI configuration
API_KEY = os.getenv('WEATHER_API_KEY')
if not API_KEY:
    raise ValueError("No WEATHER_API_KEY set for Flask application")
BASE_URL = 'http://api.weatherapi.com/v1'

# Models
class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

class WeatherData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.String(10), nullable=False)

# Helper function
def fetch_weather_data(city):
    url = f"{BASE_URL}/forecast.json?key={API_KEY}&q={city}&days=5"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None

# Routes
@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    # First, try to get data from the database
    location = Location.query.filter_by(city=city).first()
    if location:
        weather = WeatherData.query.filter_by(location_id=location.id).order_by(WeatherData.date.desc()).first()
        if weather and weather.date == datetime.now().date():
            return jsonify({
                "city": location.city,
                "temperature": weather.temperature,
                "description": weather.description,
                "icon": weather.icon
            })

    # If not in database or not current, fetch from API
    weather_data = fetch_weather_data(city)
    if weather_data:
        current = weather_data['current']
        return jsonify({
            "city": city,
            "temperature": current['temp_c'],
            "description": current['condition']['text'],
            "icon": current['condition']['icon']
        })
    else:
        return jsonify({"error": "Weather data not found"}), 404

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    weather_data = fetch_weather_data(city)
    if weather_data:
        forecast = weather_data['forecast']['forecastday']
        return jsonify([{
            "date": day['date'],
            "temperature": day['day']['avgtemp_c'],
            "description": day['day']['condition']['text'],
            "icon": day['day']['condition']['icon']
        } for day in forecast])
    else:
        return jsonify({"error": "Forecast data not found"}), 404

@app.route('/api/historical', methods=['GET'])
def get_historical():
    city = request.args.get('city')
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    
    if not all([city, start_date, end_date]):
        return jsonify({"error": "City, start date, and end date are required"}), 400

    location = Location.query.filter_by(city=city).first()
    if not location:
        return jsonify({"error": "City not found"}), 404

    start = datetime.strptime(start_date, '%Y-%m-%d').date()
    end = datetime.strptime(end_date, '%Y-%m-%d').date()
    
    historical = WeatherData.query.filter_by(location_id=location.id).filter(WeatherData.date.between(start, end)).order_by(WeatherData.date).all()

    return jsonify([{
        "date": weather.date.strftime('%Y-%m-%d'),
        "temperature": weather.temperature
    } for weather in historical])

@app.route('/api/update_weather', methods=['POST'])
def update_weather():
    city = request.json.get('city')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    weather_data = fetch_weather_data(city)
    if not weather_data:
        return jsonify({"error": "Unable to fetch weather data"}), 400

    location = Location.query.filter_by(city=city).first()
    if not location:
        location = Location(
            city=city,
            country=weather_data['location']['country'],
            latitude=weather_data['location']['lat'],
            longitude=weather_data['location']['lon']
        )
        db.session.add(location)
        db.session.commit()

    current = weather_data['current']
    new_weather = WeatherData(
        location_id=location.id,
        date=datetime.now().date(),
        temperature=current['temp_c'],
        description=current['condition']['text'],
        icon=current['condition']['icon']
    )
    db.session.add(new_weather)
    db.session.commit()

    return jsonify({"message": "Weather data updated successfully"})

if __name__ == '__main__':
    app.run(debug=True)