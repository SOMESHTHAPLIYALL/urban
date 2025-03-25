import React, { useState } from "react";
import { FaUpload, FaTimes } from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/Navbar";

const Detect = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      // Send image to /detect endpoint
      const detectResponse = await axios.post(
        "https://urbanbackend-61cw.onrender.com/detect/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponseData(detectResponse.data);

      // Prepare form data for the second request
      const imageFormData = new FormData();
      imageFormData.append("file", image);

      // Fetch the processed image by sending the file again
      const imageResponse = await axios.post(
        `https://urban-cuvj.onrender.com/image/${detectResponse.data.image_url
          .split("/")
          .pop()}`,
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(imageResponse.data);
      setResponseData((prev) => ({ ...prev, processedImage: imageUrl }));

      setModalOpen(true);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setResponseData(null);
    setPreview(null);
    setImage(null);
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
        {preview && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition-all duration-300"
          >
            {loading ? "Processing..." : "Upload and Detect"}
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
            <h2 className="text-2xl font-bold mb-4">Detection Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Detections</h3>
                <p>Total Detections: {responseData.total_detections}</p>
                <ul className="list-disc pl-5">
                  {Object.entries(responseData.detection_counts).map(
                    ([key, value]) => (
                      <li key={key}>
                        {key}: {value}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Processed Image</h3>
                <img
                  src={responseData.processedImage}
                  alt="Processed"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detect;
