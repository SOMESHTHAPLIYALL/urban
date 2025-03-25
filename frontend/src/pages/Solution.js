import React, { useState } from "react";
import { FaUpload, FaTimes } from "react-icons/fa";
import axios from "axios";

const Solution = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [query, setQuery] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!image || !query) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("query", query);

    try {
      // Send image and query to /analyze-traffic endpoint
      const response = await axios.post(
        "https://urban-cuvj.onrender.com/analyze-traffic/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponseData(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Error uploading image and query:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setResponseData(null);
    setPreview(null);
    setImage(null);
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all duration-300"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          ) : (
            <>
              <FaUpload className="text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600 text-center">
                Drag & drop an image or click to upload
              </p>
            </>
          )}
        </label>

        <div className="mt-4">
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700"
          >
            Enter your query:
          </label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., How can we reduce traffic?"
          />
        </div>

        {(preview || query) && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition-all duration-300"
          >
            {loading ? "Processing..." : "Analyze Traffic"}
          </button>
        )}
      </div>

      {modalOpen && responseData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <FaTimes className="text-2xl" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Detection Results
                </h3>
                <p>
                  Total Detections:{" "}
                  {responseData.detection_results.total_detections}
                </p>
                <ul className="list-disc pl-5">
                  {Object.entries(
                    responseData.detection_results.detection_counts
                  ).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Traffic Analysis</h3>
                <p className="whitespace-pre-line">{responseData.analysis}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solution;
