// RoutineCalendar.js
import React, { useState, useEffect } from 'react';
import './RoutineCalendar.css';
import dayjs from 'dayjs';
import { useSwipeable } from 'react-swipeable';
import underIcon from '../../pictures/underIcon.svg';
// import MonthPicker from './MonthPicker/MonthPicker';
import WeekCalendarView from './WeekCalendarView';
import MonthCalendarView from './MonthCalendarView';

function RoutineCalendar({ selectedDate, onDateSelect }) {
  const today = dayjs();
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));
  const [swipeDirection, setSwipeDirection] = useState('');
  // const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCalendar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const startOfWeek = selectedDate.startOf('week');
    if (!startOfWeek.isSame(currentWeekStart, 'date')) {
      setCurrentWeekStart(startOfWeek);
    }
  }, [selectedDate]);

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
    onDateSelect(date); // 선택한 날짜 상태 전달
  };

  const handleMonthSelect = (monthStart) => {
    const weekStart = monthStart.startOf('week');
    setCurrentWeekStart(weekStart);
    onDateSelect(monthStart); // 선택한 월의 첫날을 선택
    setShowMonthPicker(false);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNextWeek,
    onSwipedRight: goToPrevWeek,
    trackMouse: true,
  });

  return (
    <div className="calendar-container" {...swipeHandlers}>
      <div className="calendar-header">
        <span className="month-text" onClick={toggleCalendar}>
          {currentWeekStart.format('M월')}
          <img
            src={underIcon}
            alt="드롭다운"
            className={`under-icon ${isExpanded ? 'rotated' : ''}`}
          />
        </span>
      </div>

      {/* 🔽 월 선택 모달 */}
      {/* {showMonthPicker && (
        <MonthPicker
          currentDate={currentWeekStart}
          onMonthSelect={handleMonthSelect}
          onClose={() => setShowMonthPicker(false)}
        />
      )} */}

      {/* ✅ 월간/주간 달력 전환 */}
      {isExpanded ? (
        <MonthCalendarView
          selectedDate={selectedDate}
          onDateSelect={handleDateClick}
        />
      ) : (
        <WeekCalendarView
          selectedDate={selectedDate}
          onDateSelect={handleDateClick}
          weekDates={weekDates}
          swipeDirection={swipeDirection}
        />
      )}

      <div className="calendar-divider" />
    </div>
  );
}

export default RoutineCalendar;
