import React, { useState, useEffect, useCallback } from 'react';
import { CButton, CCard, CCardBody, CBadge, CButtonGroup } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilHappy, cilSad, cilFlagAlt } from '@coreui/icons';

const Minesweeper = () => {
  // 설정값 (초급 기준)
  const [config, setConfig] = useState({ rows: 9, cols: 9, mines: 10 });
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [mineCount, setMineCount] = useState(10);

  // 1. 게임판 초기화
  const initGame = useCallback(() => {
    const { rows, cols, mines } = config;
    let newGrid = Array(rows).fill().map(() => Array(cols).fill().map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0
    })));

    // 지뢰 무작위 배치
    let plantedMines = 0;
    while (plantedMines < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        plantedMines++;
      }
    }

    // 주변 지뢰 개수 계산
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (newGrid[r + i]?.[c + j]?.isMine) count++;
            }
          }
          newGrid[r][c].neighborCount = count;
        }
      }
    }
    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setMineCount(mines);
  }, [config]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // 2. 칸 클릭 (재귀 알고리즘 포함)
  const revealCell = (r, c) => {
    if (gameOver || win || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    let newGrid = [...grid.map(row => [...row])];

    if (newGrid[r][c].isMine) {
      // 지뢰 밟음
      setGameOver(true);
      revealAllMines(newGrid);
      return;
    }

    // 빈 칸(0)일 경우 주변 자동 열기 (BFS/DFS 스타일)
    const recursiveReveal = (row, col) => {
      if (row < 0 || row >= config.rows || col < 0 || col >= config.cols) return;
      if (newGrid[row][col].isRevealed || newGrid[row][col].isMine) return;

      newGrid[row][col].isRevealed = true;

      if (newGrid[row][col].neighborCount === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            recursiveReveal(row + i, col + j);
          }
        }
      }
    };

    recursiveReveal(r, c);
    setGrid(newGrid);
    checkWin(newGrid);
  };

  // 3. 우클릭 (깃발 꽂기)
  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].isRevealed) return;

    let newGrid = [...grid.map(row => [...row])];
    const target = newGrid[r][c];
    
    if (!target.isFlagged && mineCount > 0) {
      target.isFlagged = true;
      setMineCount(prev => prev - 1);
    } else if (target.isFlagged) {
      target.isFlagged = false;
      setMineCount(prev => prev + 1);
    }
    setGrid(newGrid);
  };

  const revealAllMines = (currentGrid) => {
    currentGrid.forEach(row => row.forEach(cell => {
      if (cell.isMine) cell.isRevealed = true;
    }));
    setGrid(currentGrid);
  };

  const checkWin = (currentGrid) => {
    const isWin = currentGrid.every(row => 
      row.every(cell => cell.isMine || cell.isRevealed)
    );
    if (isWin) setWin(true);
  };

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="mb-4">💣 지뢰찾기</h2>

      <CCard className="border-0 shadow-lg p-3 mb-4" style={{ backgroundColor: '#bdbdbd', border: '5px inset #eee' }}>
        {/* 상단바 */}
        <div className="d-flex justify-content-between align-items-center mb-3 p-2" 
             style={{ backgroundColor: '#000', color: '#ff0000', fontFamily: 'monospace', fontSize: '24px', borderRadius: '5px' }}>
          <div>{String(mineCount).padStart(3, '0')}</div>
          <CButton color="light" onClick={initGame} className="p-1">
            <CIcon icon={gameOver ? cilSad : win ? cilHappy : cilHappy} size="xl" />
          </CButton>
          <div>000</div>
        </div>

        {/* 게임판 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${config.cols}, 30px)`,
          border: '3px inset white'
        }}>
          {grid.map((row, rIdx) => row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              onClick={() => revealCell(rIdx, cIdx)}
              onContextMenu={(e) => toggleFlag(e, rIdx, cIdx)}
              style={{
                width: '30px', height: '30px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '18px',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: cell.isRevealed ? '#7b7b7b' : '#eee #7b7b7b #7b7b7b #eee',
                backgroundColor: cell.isRevealed ? '#bdbdbd' : '#bdbdbd',
                color: getNumberColor(cell.neighborCount)
              }}
            >
              {cell.isRevealed ? (
                cell.isMine ? '💣' : (cell.neighborCount || '')
              ) : (
                cell.isFlagged ? '🚩' : ''
              )}
            </div>
          )))}
        </div>
      </CCard>

      {/* 난이도 조절 */}
      <CButtonGroup>
        <CButton color="secondary" variant="outline" onClick={() => setConfig({ rows: 9, cols: 9, mines: 10 })}>초급</CButton>
        <CButton color="secondary" variant="outline" onClick={() => setConfig({ rows: 16, cols: 16, mines: 40 })}>중급</CButton>
        <CButton color="secondary" variant="outline" onClick={() => setConfig({ rows: 16, cols: 30, mines: 99 })}>고급</CButton>
      </CButtonGroup>

      {win && <CBadge color="success" className="mt-3 p-2">🎉 축하합니다! 모든 지뢰를 찾았습니다!</CBadge>}
      {gameOver && <CBadge color="danger" className="mt-3 p-2">💥 펑! 게임 오버!</CBadge>}
    </div>
  );
};

const getNumberColor = (num) => {
  const colors = [null, 'blue', 'green', 'red', 'darkblue', 'brown', 'cyan', 'black', 'grey'];
  return colors[num];
};

export default Minesweeper;