// src/component/Calendar/RoutineCalendar.js

import React, { useState, useEffect } from 'react';
import './RoutineCalendar.css';
import dayjs from 'dayjs';
import { useSwipeable } from 'react-swipeable';
import underIcon from '../../pictures/underIcon.svg';

function RoutineCalendar({ selectedDate, onDateSelect }) {
  const today = dayjs();
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));
  const [swipeDirection, setSwipeDirection] = useState('');

  // 선택된 날짜가 변경되면 주간 동기화
  useEffect(() => {
    const startOfWeek = selectedDate.startOf('week');
    if (!startOfWeek.isSame(currentWeekStart, 'date')) {
      setCurrentWeekStart(startOfWeek);
    }
  }, [selectedDate]);

  // 애니메이션 클래스 초기화
  useEffect(() => {
    if (swipeDirection) {
      const timeout = setTimeout(() => setSwipeDirection(''), 300);
      return () => clearTimeout(timeout);
    }
  }, [swipeDirection]);

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, 'day')
  );

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNextWeek,
    onSwipedRight: goToPrevWeek,
    trackMouse: true,
  });

  return (
    <div className="calendar-container" {...swipeHandlers}>
      <div className="calendar-header">
        {/* 좌우 버튼 제거 */}
        <span className="month-text">
          {currentWeekStart.format('M월')}
          <img
            src={underIcon}
            alt="드롭다운"
            className="under-icon"
            onClick={() => alert("드롭 다운 눌림")}
          />
        </span>
      </div>

      <div className="day-labels">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div key={i} className="day-label">{day}</div>
        ))}
      </div>

      <div className={`date-row ${swipeDirection}`}>
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
