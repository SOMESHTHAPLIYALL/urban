import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChair } from "react-icons/fa";
import { PiSeatDuotone } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";

const UpdateMapCenter = ({ center }) => {
  const map = useMap();
  map.setView(center, 13); // Update the map center dynamically
  return null;
};

const CarpoolCard = ({ carpool, joinCarpool, user }) => {
  const [startCoordinates, setStartCoordinates] = useState([0, 0]);
  const [endCoordinates, setEndCoordinates] = useState([0, 0]);
  const [mapCenter, setMapCenter] = useState([0, 0]); // Default center

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        // Fetch start location coordinates
        const startResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            carpool.startLocation
          )}&format=json`
        );
        const startLatLon = [
          parseFloat(startResponse.data[0]?.lat),
          parseFloat(startResponse.data[0]?.lon),
        ];
        setStartCoordinates(startLatLon);

        // Fetch end location coordinates
        const endResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            carpool.endLocation
          )}&format=json`
        );
        const endLatLon = [
          parseFloat(endResponse.data[0]?.lat),
          parseFloat(endResponse.data[0]?.lon),
        ];
        setEndCoordinates(endLatLon);

        // Calculate midpoint and update map center
        const midpoint = [
          (startLatLon[0] + endLatLon[0]) / 2,
          (startLatLon[1] + endLatLon[1]) / 2,
        ];
        setMapCenter(midpoint);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [carpool.startLocation, carpool.endLocation]);

  const participantIds = carpool.participants.map((p) => p.toString());

  return (
    <motion.div
      key={carpool._id}
      className="p-6 bg-white shadow-md rounded-lg border hover:shadow-2xl hover:border-green-500 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center mb-3">
        <FaMapMarkerAlt className="text-green-600 mr-2" />
        <p>
          <strong>From:</strong> {carpool.startLocation}
        </p>
      </div>
      <div className="flex items-center mb-3">
        <FaMapMarkerAlt className="text-red-600 mr-2" />
        <p>
          <strong>To:</strong> {carpool.endLocation}
        </p>
      </div>
      <div className="flex items-center mb-3">
        <FaCalendarAlt className="text-blue-600 mr-2" />
        <p>
          <strong>Date:</strong> {new Date(carpool.date).toLocaleDateString()}{" "}
          <strong>Time:</strong> {carpool.time}
        </p>
      </div>
      <div className="flex items-center mb-3">
        <PiSeatDuotone  className="text-green-600 mr-2" />
        <p className="flex items-center space-x-2">
          <strong>Seats Available:</strong>
          {Array(carpool.seatsAvailable - carpool.participants.length)
            .fill(null)
            .map((_, index) => (
              <PiSeatDuotone  key={index} className="text-green-600" />
            ))}
        </p>
      </div>
      <div className="flex items-center mb-3">
        <FaDollarSign className="text-yellow-500 mr-2" />
        <p>
          <strong>Price:</strong> ₹{carpool.price}
        </p>
      </div>
      <div className="flex items-center mb-3">
        <FaUser className="text-purple-600 mr-2" />
        <p>
          <strong>Host:</strong> {carpool.host.name} ({carpool.host.email})
        </p>
      </div>
      <div className="flex items-center mb-3">
        <FaUser className="text-purple-600 mr-2" />
        <p>
          <strong>Vehicle Type :</strong> {carpool.type} 
        </p>
      </div>
      {carpool.womendriver && (
  <div className="flex items-center mb-3 bg-pink-100 text-pink-700 px-3 py-2 rounded-lg shadow">
    <FaUser className="text-pink-500 mr-2" />
    <p>
      <strong>Women Driver:</strong> Yes ♀️
    </p>
  </div>
)}


      {/* Map Section */}
      <div className="h-40 w-full mb-4">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <UpdateMapCenter center={mapCenter} />
          {startCoordinates[0] !== 0 && endCoordinates[0] !== 0 && (
            <>
              <Marker position={startCoordinates}></Marker>
              <Marker position={endCoordinates}></Marker>
              <Polyline positions={[startCoordinates, endCoordinates]} color="blue" />
            </>
          )}
        </MapContainer>
      </div>

      <button
        className={`mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-all duration-300 ${
          participantIds?.includes(user?.id) || carpool.participants.length >= carpool.seatsAvailable
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        onClick={() => joinCarpool(carpool._id, carpool.price)}
        disabled={
          participantIds.includes(user?.id) || carpool.participants.length >= carpool.seatsAvailable
        }
      >
        {participantIds?.includes(user?.id)
          ? "Already Joined"
          : carpool.participants.length >= carpool.seatsAvailable
          ? "Full"
          : "Join Ride"}
      </button>
    </motion.div>
  );
};

const RidesList = () => {
  const [carpools, setCarpools] = useState([]); // State for fetched carpools
  const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user from localStorage
  const [showPopup, setShowPopup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  const [filteredCarpools, setFilteredCarpools] = useState([]);
  // Filters
  const [priceRange, setPriceRange] = useState([0, 300]); // Min and Max price
  const [selectedType, setSelectedType] = useState(""); // Vehicle Type
  const [womenDriverOnly, setWomenDriverOnly] = useState(false); // New state for women driver filter

  // Fetch all carpools on component mount
  useEffect(() => {
    const fetchCarpools = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/carpool");
        setCarpools(response.data); // Save carpools in state
        setFilteredCarpools(response.data);
      } catch (error) {
        console.error("Error fetching carpools:", error);
        toast.error("Failed to load carpools.");
      }
    };

    fetchCarpools();
  }, []);

  useEffect(() => {
    let filtered = carpools;

    // Apply price range filter
    filtered = filtered.filter(
      (carpool) => carpool.price >= priceRange[0] && carpool.price <= priceRange[1]
    );

    // Apply vehicle type filter if selected
    if (selectedType) {
      filtered = filtered.filter((carpool) => carpool.type === selectedType);
    }

    // Apply Women Driver filter
    if (womenDriverOnly) {
      filtered = filtered.filter((carpool) => carpool.womendriver === true);
    }

    setFilteredCarpools(filtered);
  }, [priceRange, selectedType, womenDriverOnly, carpools]);

  // Join a carpool
  const joinCarpool = async (carpoolId, price) => {

    const options = {
      key: "rzp_test_ocDqI1oN10flt3", // Replace with your Razorpay Key ID
      amount: price*100, // Amount in paise (50000 paise = ₹500)
      currency: "INR",
      name: "Carpool Ride",
      description: "Payment for your carpool ride",
      image: "https://images.pexels.com/photos/430205/pexels-photo-430205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Add your logo URL
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        console.log(response);
      },
      prefill: {
        name: "John Doe", // Prefill user details
        email: "johndoe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0d6efd", // Change to match your theme
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.post(
        `http://localhost:5000/api/carpool/join/${carpoolId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        }
      );

      toast.success("Successfully joined the carpool!");
      // Update the carpools list after joining
      setCarpools((prevCarpools) =>
        prevCarpools.map((carpool) =>
          carpool._id === response.data._id ? response.data : carpool
        )
      );
    } catch (error) {
      console.error("Error joining carpool:", error);
      toast.error(
        error.response?.data?.message || "Failed to join the carpool."
      );
    }
  };

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleMouseMove = (e) => {
    if (showPopup) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div
      className="bg-gray-100 mt-8 rounded-md shadow-lg p-4 mx-44"
      onMouseMove={handleMouseMove}
    >
      <ToastContainer />
      <h2 className="text-4xl font-mono font-semibold text-center mb-6">
        Available Rides
      </h2>

      <div className="bg-white text-center gap-10 w-[500px] justify-center justify-self-center p-4 rounded-lg shadow-md mb-6">
        
          <h3 className="text-xl font-semibold mb-4">Filters</h3>
        
       

        {/* Price Filter */}
        <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
          className="w-full"
        />
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full"
        />
      </div>

      {/* Vehicle Type Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Vehicle Type</label>
        <select
          className="w-full border rounded px-4 py-2 focus:outline-none focus:border-green-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All</option>
          <option value="2 seater">2 Seater 🏍️</option>
          <option value="4 seater">4 Seater 🚗</option>
          <option value="7 seater">7 Seater 🚐</option>
        </select>
      </div>

      {/* Women Driver Filter Toggle */}
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg shadow">
        <span className="text-gray-700 text-lg font-semibold">Women Driver Only</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={womenDriverOnly}
            onChange={() => setWomenDriverOnly(!womenDriverOnly)}
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>
        
      </div>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {filteredCarpools.map((carpool) => (
      <CarpoolCard key={carpool._id} carpool={carpool} joinCarpool={joinCarpool} user={user} />
    ))}
  </div>

      
    </div>
  );
};

export default RidesList;
