import "../styles/pages/Chat.css";
import { useState, useEffect } from "react";
import Message from "../components/Message";
import api from "../api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user" }]);
      postMessage();
      setMessage("");
    }
  };

  const postMessage = async () => {
    try {
      const response = await api.post("/api/chat/", { prompt: message });
      if (response.status != 201) {
        alert("Message not send!");
      } else
        setMessages((latest) => [
          ...latest,
          { text: response.data, sender: "ai" },
        ]);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <Message key={index} text={message.text} sender={message.sender} />
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          id="messageInput"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
          autoComplete="off"
        />
        <button
          id="sendButton"
          className="send-button"
          onClick={handleSendMessage}
        >
          <span className="send-icon">➤</span>
        </button>
      </div>
    </div>
  );
}
