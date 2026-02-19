import React, { useState, useRef, useEffect } from 'react';
import { CButton, CFormInput, CCard, CCardBody, CRow, CCol, CBadge } from '@coreui/react';

const LadderGame = () => {
  const [count, setCount] = useState(3);
  const [names, setNames] = useState(['', '', '']);
  const [results, setResults] = useState(['', '', '']);
  const [gameStarted, setGameStarted] = useState(false);
  const [ladderData, setLadderData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  // 각 참가자의 최종 당첨 결과를 저장하는 상태
  const [finalMatches, setFinalMatches] = useState({}); 
  
  const canvasRef = useRef(null);
  const canvasWidth = 800;
  const canvasHeight = 500;
  const padding = 60;

  const handleCountChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 2;
    const num = Math.max(2, Math.min(12, val));
    setCount(num);
    setNames(Array(num).fill(''));
    setResults(Array(num).fill(''));
    setFinalMatches({}); // 인원 변경 시 결과 초기화
  };

  const generateLadder = () => {
    const newLadder = [];
    for (let i = 0; i < count - 1; i++) {
      const rungs = [];
      for (let j = 0; j < 10; j++) {
        if (Math.random() > 0.6) {
          rungs.push((canvasHeight / 12) * (j + 1) + Math.random() * 15);
        }
      }
      newLadder.push(rungs.sort((a, b) => a - b));
    }
    setLadderData(newLadder);
    setFinalMatches({}); // 새 사다리 생성 시 결과 초기화
    setGameStarted(true);
  };

  const drawBase = (ctx) => {
    const spacing = (canvasWidth - padding * 2) / (count - 1);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;

    for (let i = 0; i < count; i++) {
      const x = padding + i * spacing;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); ctx.stroke();
      if (i < count - 1) {
        ladderData[i]?.forEach(y => {
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + spacing, y); ctx.stroke();
        });
      }
    }
  };

  useEffect(() => {
    if (gameStarted && canvasRef.current) {
      drawBase(canvasRef.current.getContext('2d'));
    }
  }, [gameStarted, ladderData]);

  // 추적 로직 (도착 지점 인덱스 반환)
  const tracePath = async (startIndex, color, speed = 5) => {
    const ctx = canvasRef.current.getContext('2d');
    const spacing = (canvasWidth - padding * 2) / (count - 1);
    let currentLine = startIndex;
    let currentY = 0;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    while (currentY < canvasHeight) {
      const nextY = currentY + 4;
      const x = padding + currentLine * spacing;

      const rightRung = ladderData[currentLine]?.find(y => Math.abs(y - currentY) < 3);
      const leftRung = ladderData[currentLine - 1]?.find(y => Math.abs(y - currentY) < 3);

      if (rightRung) {
        ctx.beginPath(); ctx.moveTo(x, currentY); ctx.lineTo(x + spacing, currentY); ctx.stroke();
        currentLine++;
        await new Promise(r => setTimeout(r, 20));
      } else if (leftRung) {
        ctx.beginPath(); ctx.moveTo(x, currentY); ctx.lineTo(x - spacing, currentY); ctx.stroke();
        currentLine--;
        await new Promise(r => setTimeout(r, 20));
      }

      ctx.beginPath();
      ctx.moveTo(padding + currentLine * spacing, currentY);
      ctx.lineTo(padding + currentLine * spacing, nextY);
      ctx.stroke();
      
      currentY = nextY;
      await new Promise(r => setTimeout(r, speed));
    }

    // 결과 상태 업데이트 (상단 이름표 아래 표시용)
    setFinalMatches(prev => ({
      ...prev,
      [startIndex]: results[currentLine] || '꽝'
    }));

    return currentLine;
  };

  const showAllResults = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFinalMatches({}); // 결과 싹 지우고 새로 시작
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

    for (let i = 0; i < count; i++) {
      await tracePath(i, colors[i % colors.length], 2);
      await new Promise(r => setTimeout(r, 100)); 
    }
    setIsAnimating(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 className="text-center mb-4">🚩 사다리타기 게임</h2>

      {!gameStarted ? (
        <CCard className="border-0 shadow-sm">
          <CCardBody>
            <div className="mb-4">
              <label className="fw-bold mb-2">1. 인원수 설정</label>
              <CFormInput type="number" value={count} onChange={handleCountChange} min="2" max="12" />
            </div>

            <CRow className="mb-4">
              <CCol>
                <label className="fw-bold mb-2">이름 입력</label>
                {names.map((n, i) => (
                  <CFormInput key={i} className="mb-2" value={n} placeholder={`참가자 ${i+1}`}
                    onChange={(e) => { const nNames = [...names]; nNames[i] = e.target.value; setNames(nNames); }} />
                ))}
              </CCol>
              <CCol>
                <label className="fw-bold mb-2">결과 입력</label>
                {results.map((r, i) => (
                  <CFormInput key={i} className="mb-2" value={r} placeholder={`결과 ${i+1}`}
                    onChange={(e) => { const nRes = [...results]; nRes[i] = e.target.value; setResults(nRes); }} />
                ))}
              </CCol>
            </CRow>
            <CButton color="primary" className="w-100 fw-bold" onClick={generateLadder}>사다리 생성</CButton>
          </CCardBody>
        </CCard>
      ) : (
        <div className="text-center">
          {/* 상단 참가자 버튼 및 결과 배지 */}
          <div className="d-flex justify-content-between px-5 mb-3" style={{ alignItems: 'flex-start' }}>
            {names.map((n, i) => (
              <div key={i} style={{ width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <CButton color="dark" variant="outline" size="sm" className="w-100 text-truncate" 
                         disabled={isAnimating} onClick={() => tracePath(i, '#4f46e5')}>
                  {n || `인원${i+1}`}
                </CButton>
                {/* 당첨 결과가 있으면 배지로 표시 */}
                {finalMatches[i] && (
                  <CBadge color="info" shape="rounded-pill" style={{ fontSize: '11px', animation: 'fadeIn 0.5s' }}>
                    {finalMatches[i]}
                  </CBadge>
                )}
              </div>
            ))}
          </div>

          <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} 
                  style={{ background: '#ffffff', borderRadius: '10px', border: '2px solid #eee' }} />

          {/* 하단 결과 목록 */}
          <div className="d-flex justify-content-between px-5 mt-3 fw-bold">
            {results.map((r, i) => (
              <span key={i} style={{ width: '80px', color: '#666', fontSize: '14px' }}>
                {r || '꽝'}
              </span>
            ))}
          </div>

          <div className="mt-5 d-flex gap-3 justify-content-center">
            <CButton color="success" size="lg" className="fw-bold text-white shadow" 
                     disabled={isAnimating} onClick={showAllResults}>한꺼번에 확인하기</CButton>
            <CButton color="secondary" size="lg" onClick={() => { setGameStarted(false); setFinalMatches({}); }}>다시 설정</CButton>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LadderGame;