import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaCarSide, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
const Dashboard = () => {
  const [hostedRides, setHostedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // Get user details from localStorage

  useEffect(() => {
    const fetchUserCarpools = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await axios.get(
          "https://urban-cuvj.onrender.com/api/carpool/user-carpools",
          {
            headers: { Authorization: `Bearer ${token}` }, // Pass token in Authorization header
          }
        );
        setHostedRides(response.data.hostedRides);
        setJoinedRides(response.data.joinedRides);
      } catch (error) {
        console.error("Error fetching user carpools:", error);
      }
    };

    fetchUserCarpools();
  }, []);

  // Delete a carpool
  const deleteCarpool = async (carpoolId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://urban-cuvj.onrender.com/api/carpool/delete/${carpoolId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHostedRides((prevRides) =>
        prevRides.filter((ride) => ride._id !== carpoolId)
      );
      toast.success("Carpool deleted successfully!");
    } catch (error) {
      console.error("Error deleting carpool:", error);
      toast.warn("Failed to delete carpool. Please try again.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      {/* User Details */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaUser className="text-blue-500 mr-2" />
          {user.name}'s Dashboard
        </h2>
        <p className="text-gray-600">
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* Hosted Rides */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 flex items-center">
          <FaCarSide className="text-green-500 mr-2" />
          Hosted Rides
        </h3>
        {hostedRides.length > 0 ? (
          <ul className="space-y-4">
            {hostedRides.map((ride) => (
              <li
                key={ride._id}
                className="p-4 bg-white shadow-md rounded hover:shadow-lg transition"
              >
                <p>
                  <strong>From:</strong> {ride.startLocation}{" "}
                  <strong>To:</strong> {ride.endLocation}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(ride.date).toLocaleDateString()}{" "}
                  <strong>Time:</strong> {ride.time}
                </p>
                <p>
                  <strong>Participants:</strong>{" "}
                  {ride.participants.length > 0
                    ? ride.participants.map((p) => (
                        <span
                          key={p._id}
                          className="bg-gray-200 rounded-full px-2 py-1 text-sm mr-2"
                        >
                          {p.name}
                        </span>
                      ))
                    : "None"}
                </p>
                <button
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition flex items-center"
                  onClick={() => deleteCarpool(ride._id)}
                >
                  <FaTrashAlt className="mr-2" />
                  End Carpool
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No rides hosted yet.</p>
        )}
      </div>

      {/* Joined Rides */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 flex items-center">
          <FaCarSide className="text-blue-500 mr-2" />
          Joined Rides
        </h3>
        {joinedRides.length > 0 ? (
          <ul className="space-y-4">
            {joinedRides.map((ride) => (
              <li
                key={ride._id}
                className="p-4 bg-white shadow-md rounded hover:shadow-lg transition"
              >
                <p>
                  <strong>From:</strong> {ride.startLocation}{" "}
                  <strong>To:</strong> {ride.endLocation}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(ride.date).toLocaleDateString()}{" "}
                  <strong>Time:</strong> {ride.time}
                </p>
                <p>
                  <strong>Host:</strong> {ride.host.name} ({ride.host.email})
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No rides joined yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
