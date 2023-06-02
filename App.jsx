import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const YOUR_API_KEY = "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";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, { text: input, user: true }]);
    setInput('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            
            { role: 'user', content: input },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${YOUR_API_KEY}`,
          },
        }
      );

      const botResponse = response.data.choices[0].message.content;
      setMessages(prevMessages => [
        ...prevMessages,
        { text: botResponse, user: false }
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chatbot-message ${message.user ? 'user' : 'ai'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
