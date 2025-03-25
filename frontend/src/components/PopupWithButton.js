import React, { useState } from "react";

const PopupWithButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative flexs"
      onMouseMove={handleMouseMove}
    >
      <button
        className="mt-4 bg-white border hover:border-4 text-green-800 px-4 py-2 rounded hover:bg-green-400 hover:shadow-lg transition-all duration-700"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        More Info
      </button>

      {showPopup && (
        <div
          className="absolute bg-white shadow-lg p-2 rounded"
          style={{
            top: mousePosition.y + 20,
            left: mousePosition.x + 20,
            transform: "translate(-140%, -235%)",
          }}
        >
          <img
            src="https://via.placeholder.com/150"
            alt="Popup Example"
            className="w-40 h-40 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
};

export default PopupWithButton;
