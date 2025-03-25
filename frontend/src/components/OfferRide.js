import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';

const OfferRide = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Convert back to an object
  const [formData, setFormData] = useState({
    startLocation: "",
    endLocation: "",
    date: "",
    type: "",
    time: "",
    seatsAvailable: "",
    price: 0,
    womendriver: false,
  });

  const handleSelect = (value) => {
    setFormData({ ...formData, type: value });
  };

  const vehicleOptions = [
    { emoji: "🏍️", label: "Bike", value: "2 seater" },
    { emoji: "🚗", label: "Car", value: "4 seater" },
    { emoji: "🚐", label: "Big Car", value: "7 seater" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setFormData((prevState) => ({
      ...prevState,
      womendriver: !prevState.womendriver,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await axios.post(
        "http://localhost:5000/api/carpool/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Ride created successfully!");
      window.location.href = "/dashboard";
      console.log(response.data);
    } catch (error) {
      console.error("Error posting ride:", error.response?.data || error.message);
      toast.error("You aren't Logged In.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer draggable />
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Offer a Ride</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Pick-up Location</label>
            <input
              type="text"
              name="startLocation"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-green-500"
              value={formData.startLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Drop-off Location</label>
            <input
              type="text"
              name="endLocation"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-green-500"
              value={formData.endLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-green-500"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-green-500"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              Select Vehicle Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicleOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg shadow-md text-center cursor-pointer transition-all duration-300 ${
                    formData.type === option.value
                      ? "bg-green-500 text-white border-green-600 scale-105"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="text-4xl mb-2">{option.emoji}</div>
                  <div className="text-lg font-semibold">{option.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Seats Available</label>
            <input
              type="number"
              name="seatsAvailable"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-green-500"
              value={formData.seatsAvailable}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price ($)</label>
            <input
              type="number"
              name="price"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-green-500"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Women Driver Toggle Switch */}
          <div className="mb-6 flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg shadow">
            <span className="text-gray-700 text-lg font-semibold">
              Women Driver
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.womendriver}
                onChange={handleToggle}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-500 transition"
          >
            Offer Ride
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferRide;
