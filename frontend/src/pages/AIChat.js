import React, { useState } from "react";
import axios from "axios";

const AIChat = () => {
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [input, setInput] = useState(""); // Stores user input
  const [loading, setLoading] = useState(false); // Loading state

  const handleSendMessage = async () => {
    if (!input.trim()) return; // Don't send empty messages

    // Add user message to the chat
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput(""); // Clear input field
    setLoading(true); // Start loading

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("message", input); // Append the user's message

      // Send user message to /chat endpoint as FormData
      const response = await axios.post(
        "http://127.0.0.1:8000/chat/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        }
      );

      // Add AI response to the chat
      setMessages((prev) => [
        ...prev,
        { text: response.data.reply, sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to the chat
      setMessages((prev) => [
        ...prev,
        { text: "Failed to get a response. Please try again.", sender: "ai" },
      ]);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h1 className="text-xl font-bold">AI Traffic Assistant</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                <p>Thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-all duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
