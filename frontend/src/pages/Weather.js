import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(""); // City name (optional)
  const [userLocation, setUserLocation] = useState(null); // User's location (lat, lon)

  const API_KEY = "bb99cec77db34a6db1f74924250403"; // Replace with your WeatherAPI key

  // Fetch weather data
  const fetchWeatherData = async (query) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=no`
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data. Please try again later.");
      setLoading(false);
    }
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          // Fetch weather data for user's location
          fetchWeatherData(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Unable to retrieve your location. Please enable location access."
          );
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  // Handle city input change
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeatherData(city);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Weather App</h1>

        {/* City Input */}
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Enter city name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Get Weather
          </button>
        </form>

        {/* Weather Data */}
        {weatherData && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              {weatherData.location.name}, {weatherData.location.country}
            </h2>
            <div className="flex items-center justify-center">
              <img
                src={`https:${weatherData.current.condition.icon}`}
                alt={weatherData.current.condition.text}
                className="w-20 h-20"
              />
              <p className="text-4xl font-bold text-gray-800">
                {weatherData.current.temp_c}°C
              </p>
            </div>
            <p className="text-xl text-gray-700 capitalize">
              {weatherData.current.condition.text}
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Feels Like:</span>{" "}
                {weatherData.current.feelslike_c}°C
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Humidity:</span>{" "}
                {weatherData.current.humidity}%
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Wind Speed:</span>{" "}
                {weatherData.current.wind_kph} km/h
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Pressure:</span>{" "}
                {weatherData.current.pressure_mb} hPa
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
