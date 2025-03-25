import React, { useState } from "react";

const BookRide = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    destination: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add API integration here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Book Your Ride</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Pick-up Location</label>
            <input
              type="text"
              name="pickupLocation"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-green-500"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Destination</label>
            <input
              type="text"
              name="destination"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-green-500"
              value={formData.destination}
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
          <button
            type="submit"
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-500 transition"
          >
            Request Ride
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookRide;
