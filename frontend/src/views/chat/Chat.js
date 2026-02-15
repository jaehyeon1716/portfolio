import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CButton, CFormInput, CSpinner } from '@coreui/react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const roomId = queryParams.get('roomId'); 
  const chatWith = queryParams.get('with'); 

  const scrollRef = useRef(null);
  const myName = useMemo(() => localStorage.getItem('username') || 'Guest', []);
  const apiUrl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  useEffect(() => {
    // [핵심 수정] 방이 변경되면 즉시 이전 메시지들을 화면에서 지웁니다.
    setMessages([]);
    setConnected(false); // 연결 상태 초기화

    const fetchHistory = async () => {
      if (!roomId) return; 
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/history?roomId=${roomId}`);
        if (!response.ok) throw new Error('히스토리 로드 실패');
        
        const data = await response.json();
        const history = data.map(m => ({
          id: m.id,
          text: m.message,
          sender: m.senderId === myName ? 'me' : 'other',
          senderName: m.senderId,
          time: m.timestamp
        }));
        
        // 가져온 데이터가 현재 보고 있는 roomId의 데이터인지 한 번 더 확인하면 좋습니다.
        setMessages(history);
      } catch (err) {
        console.error("내역 로드 실패:", err);
      }
    };

    fetchHistory();

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${apiUrl}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      setConnected(true);
      if (roomId) {
        // 특정 방 전용 채널 구독
        stompClient.subscribe(`/sub/chat/${roomId}`, (message) => {
          const receivedMsg = JSON.parse(message.body);
          
          // 수신된 메시지의 roomId가 현재 활성화된 roomId와 다르면 무시
          if (receivedMsg.roomId !== roomId) return;

          const senderType = receivedMsg.senderId === myName ? 'me' : 'other';
          
          const newMsg = { 
            id: receivedMsg.id || Date.now() + Math.random(), 
            text: receivedMsg.message, 
            sender: senderType, 
            senderName: receivedMsg.senderId,
            time: receivedMsg.timestamp || new Date().toISOString()
          };

          setMessages((prev) => {
            // 중복 방지: 이미 목록에 있는 ID라면 추가 안함
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        });
      }
    };

    stompClient.onDisconnect = () => {
      setConnected(false);
    };

    stompClient.activate();
    setClient(stompClient);

    // 컴포넌트 언마운트 시 또는 roomId 변경 시 연결 해제
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [myName, roomId]); // roomId가 바뀔 때마다 이 전체 로직이 새로 실행됨

  const sendMessage = () => {
    if (!client || !connected || input.trim() === '') return;

    client.publish({
      destination: '/pub/chat',
      body: JSON.stringify({ 
          roomId: roomId,      
          message: input,
          senderId: myName
      }),
    });

    setInput(''); 
  };

  const formatTime = (isoString) => {
    if(!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (!roomId) {
    return (
      <div className="text-center mt-5">
        <p className="text-muted">채팅방 정보가 없습니다.</p>
        <CButton color="primary" onClick={() => window.history.back()}>뒤로 가기</CButton>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#333', marginBottom: '5px' }}>
            <strong style={{ color: '#0d6efd' }}>{chatWith}</strong> 님과 대화
          </h2>
          <span style={{ color: '#888', fontSize: '13px' }}>나: <strong>{myName}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: connected ? '#198754' : '#dc3545' }} />
          <span style={{ fontSize: '12px', color: '#888' }}>{connected ? '연결됨' : '연결 중...'}</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          border: '1px solid #eee',
          borderRadius: '12px',
          padding: '15px',
          height: '500px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: '#f8f9fa',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)'
        }}
      >
        {messages.length === 0 && connected && (
          <div className="text-center text-muted my-auto">대화 내역이 없습니다. 첫 메시지를 보내보세요!</div>
        )}
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            style={{
              alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            {msg.sender === 'other' && (
              <span style={{ fontSize: '12px', color: '#666', marginBottom: '4px', marginLeft: '4px', fontWeight: 'bold' }}>
                {msg.senderName}
              </span>
            )}
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', flexDirection: msg.sender === 'me' ? 'row-reverse' : 'row' }}>
              <div
                style={{
                  backgroundColor: msg.sender === 'me' ? '#0d6efd' : '#ffffff',
                  color: msg.sender === 'me' ? '#fff' : '#333',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'me' ? '18px 18px 2px 18px' : '2px 18px 18px 18px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  border: msg.sender === 'me' ? 'none' : '1px solid #e0e0e0',
                  wordBreak: 'break-all',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}
              >
                {msg.text}
              </div>
              <span style={{ fontSize: '10px', color: '#aaa', minWidth: 'fit-content' }}>
                {formatTime(msg.time)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
        <CFormInput
          placeholder={connected ? "메시지를 입력하세요..." : "연결 대기 중..."}
          value={input}
          disabled={!connected}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{ borderRadius: '20px', paddingLeft: '15px' }}
        />
        <CButton 
          color="primary" 
          onClick={sendMessage} 
          disabled={!connected || input.trim() === ''}
          style={{ minWidth: '80px', borderRadius: '20px' }}
        >
          {connected ? '전송' : <CSpinner size="sm"/>}
        </CButton>
      </div>
    </div>
  );
};

export default Chat;