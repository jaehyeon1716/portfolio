import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Plus, Trash2, Clock, Calendar as CalIcon, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import 'src/scss/SchedulePage.css'; 

const SchedulePage = () => {
  // 1. 상태 관리
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date()); // 오늘 이동을 위한 상태
  const [events, setEvents] = useState([]);
  const [inputText, setInputText] = useState('');
  const [inputTime, setInputTime] = useState('12:00');
  const [inputColor, setInputColor] = useState('#818cf8'); // 기본 색상 선택
  const currentUsername = localStorage.getItem('username')

  // 날짜 포맷 함수 (YYYY-MM-DD)
  const formatDate = (d) => {
    const offset = d.getTimezoneOffset() * 60000;
    const dateOffset = new Date(d.getTime() - offset);
    return dateOffset.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));

  // 백엔드 API 주소 
  const API_URL = `${import.meta.env.VITE_API_URL}/api/schedules`;

  // 2. 초기 데이터 로드 (DB에서 가져오기)
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${API_URL}`,{
        params:{ username : currentUsername}
      });
      setEvents(response.data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  // 3. 달력 날짜 클릭 시 핸들러 (시작일/종료일 자동 변경)
  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formatted = formatDate(newDate);
    setStartDate(formatted);
    setEndDate(formatted);
  };

  // 4. 일정 추가 (DB 저장)
  const addSchedule = async () => {
    if (!inputText.trim()) return;
    if (new Date(startDate) > new Date(endDate)) {
      alert('종료일이 시작일보다 빠를 수 없습니다.');
      return;
    }

    const newEvent = {
      text: inputText,
      time: inputTime,
      startDate: startDate, // DB 엔티티 필드명과 일치시켜야 함
      endDate: endDate,
      completed: false,
      color: inputColor,
      username: currentUsername,
    };

    try {
      const response = await axios.post(`${API_URL}`, newEvent);
      setEvents([...events, response.data]); // 서버에서 생성된 ID가 포함된 데이터 추가
      setInputText('');
    } catch (error) {
      alert("일정 저장에 실패했습니다.");
    }
  };

  // 5. 일정 삭제 (DB 삭제)
  const deleteSchedule = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 6. 완료 여부 토글 (DB 업데이트)
  const toggleComplete = async (id) => {
    try {
      // 서버에 상태 반전 요청 (백엔드에 toggle용 API가 있다고 가정)
      await axios.put(`${API_URL}/${id}/toggle`);
      setEvents(events.map(event => 
        event.id === id ? { ...event, completed: !event.completed } : event
      ));
    } catch (error) {
      console.error("상태 변경 실패:", error);
    }
  };

  // 7. 오늘 날짜로 이동 (View 이동 포함)
  const goToToday = () => {
    const today = new Date();
    handleDateChange(today);
    setActiveStartDate(today); // 달력 화면을 오늘 날짜가 속한 달로 강제 이동
  };

  // 8. 현재 날짜에 해당하는 일정 필터링
  const getEventsForDate = (targetDate) => {
    const dStr = formatDate(targetDate);
    return events.filter(event => dStr >= event.startDate && dStr <= event.endDate);
  };

  // 9. 달력 타일 내부 가로 막대 렌더링
  const renderTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dStr = formatDate(date);
      const dayEvents = events.filter(event => dStr >= event.startDate && dStr <= event.endDate);

      return (
        <div className="event-bar-container">
          {dayEvents.map((event) => {
            const isStart = dStr === event.startDate;
            const isEnd = dStr === event.endDate;
            return (
              <div 
                key={event.id}
                className={`event-bar ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''} ${event.completed ? 'done' : ''}`}
                style={{ backgroundColor: event.completed ? '#e2e8f0' : event.color }}
              >
                {isStart && <span className="event-bar-text">{event.text}</span>}
              </div>
            );
          })}
        </div>
      );
    }
  };

  const selectedDateEvents = getEventsForDate(date);

  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <div className="title-area">
          <div className="header-left">
            <h1><CalIcon size={32} className="title-icon" /> My Planner</h1>
            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>
          <p className="current-date">
            {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
      </header>

      <div className="schedule-content">
        <div className="calendar-section">
          <Calendar 
            onChange={handleDateChange} 
            value={date} 
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
            formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
            tileContent={renderTileContent}
            calendarType="gregory"
          />
        </div>

        <div className="todo-section">
          <div className="input-card">
            <h3>일정 추가</h3>
            <div className="period-group">
              <div className="date-input-wrapper">
                <label>시작일</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <ArrowRight size={16} className="period-arrow" />
              <div className="date-input-wrapper">
                <label>종료일</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            
            <div className="input-group">
              <div className="color-picker-wrapper">
                <input 
                  type="color" 
                  value={inputColor} 
                  onChange={(e) => setInputColor(e.target.value)} 
                  className="color-input"
                />
              </div>
              <input type="time" value={inputTime} onChange={(e) => setInputTime(e.target.value)} className="time-input" />
              <input 
                type="text" 
                placeholder="어떤 계획이 있으신가요?" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSchedule()}
                className="text-input"
              />
              <button onClick={addSchedule} className="add-btn"><Plus size={24} /></button>
            </div>
          </div>

          <div className="todo-list">
            <div className="list-header">
              <h3>{date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} 일정</h3>
              <span className="task-count">총 {selectedDateEvents.length}개</span>
            </div>
            
            <div className="list-container">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.sort((a, b) => a.time.localeCompare(b.time)).map(item => (
                  <div key={item.id} className={`todo-item ${item.completed ? 'completed' : ''}`}>
                    <div className="todo-main">
                      <button className="check-btn" onClick={() => toggleComplete(item.id)}>
                        {item.completed ? <CheckCircle2 size={22} color="#10b981" /> : <Circle size={22} color="#cbd5e1" />}
                      </button>
                      <div className="todo-info">
                        <div className="todo-time">
                          <div className="color-dot" style={{ backgroundColor: item.color }}></div>
                          <Clock size={14} /> {item.time}
                          {item.startDate !== item.endDate && <span className="period-tag">기간</span>}
                        </div>
                        <span className="todo-text">{item.text}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteSchedule(item.id)} className="del-btn"><Trash2 size={18} /></button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>계획된 일정이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;