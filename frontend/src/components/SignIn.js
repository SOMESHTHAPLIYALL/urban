import React, { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login", // Replace with your backend URL
        formData
      );

      // Save token and user details in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Show success message
      toast.success(`Welcome back, ${response.data.user.name}!`);

      // Redirect to dashboard or home page
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-md rounded px-8 py-6 w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign in to your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                name="email"
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-green-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                name="password"
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-green-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-500 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center my-2">New here? <a href="/signup" className="text-green-800 hover:underline"> Sign up </a> </p>
      </div>
    </div>
  );
};

export default SignIn;
