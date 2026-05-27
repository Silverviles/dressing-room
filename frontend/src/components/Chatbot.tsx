// @ts-nocheck
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatHistory from "./chatbot/ChatHistory";
import Loading from "./chatbot/Loading";
import { api } from "../api/client";

export default function Chatbot() {
  const token = useSelector((state) => state.user.token);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setShowChat(true);
    setIsLoading(true);
    const currentInput = userInput;

    try {
      const response = await api.sendChatMessage(token, currentInput);
      setChatHistory((prev) => [
        ...prev,
        { type: "user", message: currentInput },
        { type: "bot", message: response.reply },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { type: "user", message: currentInput },
        { type: "bot", message: error.message || "Sorry, I could not respond right now." },
      ]);
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setShowChat(false);
  };

  const downloadTranscriptAsJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      transcript: chatHistory,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chat-transcript.json";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-120">
      {showChat && (
        <div className="chat-container rounded-lg shadow-md p-4 overflow-y-scroll" ref={chatRef}>
          <ChatHistory chatHistory={chatHistory} />
          <Loading isLoading={isLoading} />
        </div>
      )}

      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="px-4 py-2 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
      <div className="flex mt-4 space-x-2">
        <button
          className="block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
          onClick={clearChat}
        >
          Clear Chat
        </button>
        {chatHistory.length > 0 && (
          <button
            className="block px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none"
            onClick={downloadTranscriptAsJson}
          >
            Download Transcript JSON
          </button>
        )}
      </div>
    </div>
  );
}
