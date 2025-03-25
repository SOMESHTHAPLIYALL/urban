import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import OfferRide from "./components/OfferRide";
import BookRide from "./components/BookRide";
import RidesList from "./pages/RidesList";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Detect from "./pages/Detect";
import Solution from "./pages/Solution";
import AIChat from "./pages/AIChat";
import Weather from "./pages/Weather";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/offer-ride" element={<OfferRide />} />
        <Route path="/rides" element={<RidesList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detect" element={<Detect />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
