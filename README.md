# Weather App with React, Flask, and PostgreSQL

This project is a weather application that allows users to fetch current weather data and historical weather information for a specified city.

## Application Preview

![Weather App Main Interface](images/img1.png)

![Weather App Main Interface](images/img2.png)


## Features

- Fetch current weather data for a given city
- Retrieve historical weather data for a specified date range
- Display weather information including temperature, description, and weather icon
- Store and retrieve weather data using a PostgreSQL database

## Tech Stack

- Frontend: React with TypeScript
- Backend: Flask (Python)
- Database: PostgreSQL
- APIs: WeatherAPI.com

## Setup

### Prerequisites

- Node.js and npm
- Python 3.7+
- PostgreSQL

### Environment Variables

Create a `.env` file in the root directory and add the following:

DATABASE_URL=your_postgres_database_url
WEATHER_API_KEY=your_weatherapi_com_api_key

You WILL need postgres database on your local machine and you WILL need a weather API key. 

### Installation

1. Clone the repository:
git clone https://github.com/your-username/Weather_app_Postgres.git
cd Weather_app_Postgres

Copy

2. Install frontend dependencies:
cd frontend
npm install

Copy

3. Install backend dependencies:
cd ../backend
pip install -r requirements.txt

Copy

4. Set up the database:
flask db upgrade

Copy

### Running the App

1. Start the Flask backend:
cd backend
flask run

Copy

2. In a new terminal, start the React frontend:
cd frontend
npm start

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter a city name in the input field
2. Select a date range for historical data (optional)
3. Click "Get Weather" to fetch and display the weather information

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/your-username/Weather_app_Postgres/issues) if you want to contribute.

## License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.