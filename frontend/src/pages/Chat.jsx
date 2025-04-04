import "../styles/pages/Chat.css"
import { useState } from "react";
import Message from "../components/Message"
export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, sender: 'user' }]);
            setMessage('');
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
                />
                <button id="sendButton" className="send-button" onClick={handleSendMessage}>
                    <span className="send-icon">➤</span>
                </button>
            </div>
        </div>
    )
}