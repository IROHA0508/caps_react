// src/component/Calendar/RoutineCalendar.js

import React, { useState, useEffect } from 'react';
import './RoutineCalendar.css';
import dayjs from 'dayjs';
import { useSwipeable } from 'react-swipeable';
import underIcon from '../../pictures/underIcon.svg';

function RoutineCalendar({ selectedDate, onDateSelect }) {
  const today = dayjs();
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));
  const [swipeDirection, setSwipeDirection] = useState(''); // ✅ 애니메이션 상태

  // ✅ 선택된 날짜가 변경되면 해당 주로 이동
  useEffect(() => {
    const startOfWeek = selectedDate.startOf('week');
    if (!startOfWeek.isSame(currentWeekStart, 'date')) {
      setCurrentWeekStart(startOfWeek);
    }
  }, [selectedDate]);

  // ✅ 애니메이션 끝나면 초기화
  useEffect(() => {
    if (swipeDirection) {
      const timeout = setTimeout(() => setSwipeDirection(''), 300);
      return () => clearTimeout(timeout);
    }
  }, [swipeDirection]);

  // ✅ 현재 주의 일~토 날짜 배열
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, 'day')
  );

  // ✅ 주 변경 핸들러
  const goToPrevWeek = () => {
    const newWeekStart = currentWeekStart.subtract(1, 'week');
    setSwipeDirection('swipe-right');
    setCurrentWeekStart(newWeekStart);
    onDateSelect(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = currentWeekStart.add(1, 'week');
    setSwipeDirection('swipe-left');
    setCurrentWeekStart(newWeekStart);
    onDateSelect(newWeekStart);
  };

  const handleDateClick = (date) => {
    onDateSelect(date);
  };

  // ✅ 스와이프 핸들러
  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNextWeek,
    onSwipedRight: goToPrevWeek,
    trackMouse: true,
  });

  return (
    <div className={`calendar-container ${swipeDirection}`} {...swipeHandlers}>
      <div className="calendar-header">
        {/* <button onClick={goToPrevWeek} className="week-nav">◀</button> */}
        <span className="month-text">
          {currentWeekStart.format('M월')}
          <img
            src={underIcon}
            alt="드롭다운"
            className="under-icon"
            onClick={() => alert("드롭 다운 눌림")}
          />
        </span>
        {/* <button onClick={goToNextWeek} className="week-nav">▶</button> */}
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

          return (
            <div
              key={date.format('YYYY-MM-DD')}
              className={`date-circle ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
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
