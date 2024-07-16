from app import app, db, Location, WeatherData
from datetime import datetime, timedelta
import random

def init_db():
    with app.app_context():
        db.drop_all()  # Be careful with this in a production environment!
        db.create_all()

        # Add some sample locations
        locations = [
            Location(city="New York", country="USA", latitude=40.7128, longitude=-74.0060),
            Location(city="London", country="UK", latitude=51.5074, longitude=-0.1278),
            Location(city="Tokyo", country="Japan", latitude=35.6762, longitude=139.6503),
        ]
        db.session.add_all(locations)
        db.session.commit()

        # Add some sample weather data
        current_date = datetime.now().date()
        for location in locations:
            for i in range(35):  # 35 days of data (5 days forecast + 30 days historical)
                date = current_date + timedelta(days=i-30)
                weather = WeatherData(
                    location_id=location.id,
                    date=date,
                    temperature=random.uniform(0, 30),  # Random temperature between 0 and 30
                    description="Cloudy" if random.random() > 0.5 else "Sunny",
                    icon="03d" if random.random() > 0.5 else "01d"
                )
                db.session.add(weather)
        
        db.session.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized!")