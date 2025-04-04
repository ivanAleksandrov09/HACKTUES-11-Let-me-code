import '../styles/components/Message.css';

export default function Message({ text, sender }) {
    return (
        <div className={`message-wrapper ${sender}`}>
            <div className="message-content">
                <div className="message-avatar">
                    {sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-bubble">
                    <div className="message-text">{text}</div>
                </div>
            </div>
        </div>
    )
}
