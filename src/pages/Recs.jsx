import React, { useState } from 'react';
import '../css/recs.css';

const Chatbot = ()=> {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      setMessages([...messages, { user: true, message: input }]);
      setInput('');
    }
  };

  return (
    <div className="chatbot flex flex-col h-screen w-screen">
      <div className="chat-history flex-1 overflow-y-scroll p-2">
        {messages.map((message, index) => (
          <div key={index} className={message.user ? 'user-message' : 'ai-message'}>
            {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;