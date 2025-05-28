// src/component/Calendar/RoutineCalendar.js

import React, { useState, useEffect } from 'react';
import './RoutineCalendar.css';
import dayjs from 'dayjs';
import underIcon from '../../pictures/underIcon.svg';

function RoutineCalendar({ selectedDate, onDateSelect }) {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [events, setEvents] = useState([]);

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    currentMonth.startOf('week').add(i, 'day')
  );

  const handleMonthChange = (offset) => {
    setCurrentMonth(currentMonth.add(offset, 'month'));
  };

  const handleDateClick = (date) => {
    onDateSelect(date);
  };

  // 📅 서버에서 구글 캘린더 이벤트 불러오기
  useEffect(() => {
    const loadEvents = async () => {
      const userRaw = localStorage.getItem('user');
      const credential = localStorage.getItem('credential');

      console.log("🧾 user:", userRaw);
      console.log("🪪 credential:", credential);

      if (!userRaw || !credential) {
        console.warn('⚠️ 사용자 정보 또는 credential 누락');
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/calendar/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ credential }),
        });

        const result = await res.json();
        if (result?.events) {
          console.log("📆 서버에서 받은 이벤트 목록:", result.events);
          setEvents(result.events);
        } else {
          console.warn('📭 캘린더 일정이 없습니다.');
        }
      } catch (error) {
        console.error('❌ 서버 캘린더 호출 실패:', error);
      }
    };

    loadEvents();
  }, [currentMonth]);


  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <span className="month-text">
          {currentMonth.format('M월')}
          <img src={underIcon} alt="드롭다운" className="under-icon" onClick={() => alert("드롭 다운 눌림")} />
        </span>
      </div>

      <div className="day-labels">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div key={i} className="day-label">{day}</div>
        ))}
      </div>

      <div className="date-row">
        {weekDates.map((date) => {
          const isToday = date.isSame(today, 'date');
          const isSelected = date.isSame(selectedDate, 'date');

          const hasEvent = events.some(event => {
            const eventDate = dayjs(event.start);
            return eventDate.isSame(date, 'day');
          });

          return (
            <div
              key={date.format('YYYY-MM-DD')}
              className={`date-circle ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvent ? 'has-event' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              {date.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoutineCalendar;
