import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn, FiUser, FiMapPin } from "react-icons/fi";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="relative z-30 w-full bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link
          to="/"
          className="text-2xl font-bold text-green-600 flex items-center"
        >
          <FiMapPin className="mr-2 text-3xl" />
          SmartCommute
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/rides"
            className="text-gray-700 hover:text-green-600 transition"
          >
            Book a Ride
          </Link>

          {token ? (
            <>
              <Link
                to="/offer-ride"
                className="text-gray-700 hover:text-green-600 transition"
              >
                Create a Ride
              </Link>

              <Link
                to="/chat"
                className="text-gray-700 hover:text-green-600 transition"
              >
                Chatbot
              </Link>
              <Link
                to="/detect"
                className="text-gray-700 hover:text-green-600 transition"
              >
                Detect
              </Link>
              <Link
                to="/solution"
                className="text-gray-700 hover:text-green-600 transition"
              >
                Solutions
              </Link>
              <Link
                to="/weather"
                className="text-gray-700 hover:text-green-600 transition"
              >
                Weather
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-green-600 transition"
              >
                Profile
              </Link>
              <Link
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 flex items-center transition"
              >
                <FiLogIn className="mr-2" />
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 flex items-center transition"
              >
                <FiLogIn className="mr-2" />
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
