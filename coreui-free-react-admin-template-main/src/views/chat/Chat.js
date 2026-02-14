// src/views/chat/Chat.js
import React, { useState } from 'react';
import { CButton, CFormInput } from '@coreui/react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { text: input, sender: 'me' }]);
    setInput('');
    // 나중에 웹소켓 send 로직 넣으면 여기서 보낼 수 있음
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>채팅</h2>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          height: '400px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '10px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'me' ? '#0d6efd' : '#e9ecef',
              color: msg.sender === 'me' ? '#fff' : '#000',
              padding: '8px 12px',
              borderRadius: '16px',
              maxWidth: '70%',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <CFormInput
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <CButton color="primary" onClick={sendMessage}>
          전송
        </CButton>
      </div>
    </div>
  );
};

export default Chat;
