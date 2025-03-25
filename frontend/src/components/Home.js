import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import video from "../assets/video.mp4";
const Home = () => {
  return (
    <div className="relative h-screen flex items-center">
      {/* Background Video */}
      <video
        src={video}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src="../assets/bgdriving.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 bg-green-600 bg-opacity-20 text-white h-full w-full flex items-center">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-5xl font-bold"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Share rides, save the planet
          </motion.h1>
          <p className="mt-4 text-lg">
            Join the sustainable transportation revolution. Connect with drivers
            and passengers heading your way.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              to="/offer-ride"
              className=" border hover:text-black hover:bg-white   px-6 py-3 rounded-lg text-lg transition-all duration-300"
            >
              Start Driving
            </Link>
            <Link
              to="/rides"
              className="border text-green-100 hover:text-green-900 px-6 py-3 rounded-lg text-lg hover:scale-105 hover:bg-green-400 transition-all duration-300"
            >
              Book a Ride
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
