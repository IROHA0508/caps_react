// RoutineCalendar.js
import React, { useState, useEffect } from 'react';
import './RoutineCalendar.css';
import dayjs from 'dayjs';
import { useSwipeable } from 'react-swipeable';
import underIcon from '../../pictures/underIcon.svg';
import WeekCalendarView from './WeekCalendarView';
import MonthCalendarView from './MonthCalendarView';

function RoutineCalendar({ selectedDate, onDateSelect }) {
  const today = dayjs();
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));
  const [swipeDirection, setSwipeDirection] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);     // 확장 여부
  const [showMonth, setShowMonth] = useState(false);       // DOM 표시 여부
  const [expandTransition, setExpandTransition] = useState('');
  const currentTransition = expandTransition || swipeDirection;

  const toggleCalendar = () => {
    if (!isExpanded) {
      setExpandTransition('expand');
      setShowMonth(true);           // 먼저 표시
      setIsExpanded(true);
    } else {
      setExpandTransition('collapse');
      setIsExpanded(false);
      setTimeout(() => {
        setShowMonth(false);        // collapse 애니메이션 후 숨김
      }, 300);
    }
  };

  useEffect(() => {
    const startOfWeek = selectedDate.startOf('week');
    if (!startOfWeek.isSame(currentWeekStart, 'date')) {
      setCurrentWeekStart(startOfWeek);
    }
  }, [selectedDate, currentWeekStart]);

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


  const goToPrevMonth = () => {
    const newDate = selectedDate.subtract(1, 'month');
    setSwipeDirection('swipe-right');
    onDateSelect(newDate);
  };

  const goToNextMonth = () => {
    const newDate = selectedDate.add(1, 'month');
    setSwipeDirection('swipe-left');
    onDateSelect(newDate);
  };


  const handleDateClick = (date) => {
    onDateSelect(date); // 선택한 날짜 상태 전달
  };


  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isExpanded) {
        goToNextMonth();
      } else {
        goToNextWeek();
      }
    },
    onSwipedRight: () => {
      if (isExpanded) {
        goToPrevMonth();
      } else {
        goToPrevWeek();
      }
    },
    trackMouse: true,
  });


  return (
    <div className="calendar-container" {...swipeHandlers}>
      <div className="calendar-header">
        <span className={`month-text ${isExpanded ? 'active' : ''}`} onClick={toggleCalendar}>
          {selectedDate.format('M월')}
          <img src={underIcon} alt="드롭다운" className={`under-icon ${isExpanded ? 'rotated' : ''}`} />
        </span>
      </div>

      {/* ✅ 월간/주간 달력 전환 */}
      {showMonth ? (
        <MonthCalendarView
          key={selectedDate.format('YYYY-MM')}
          selectedDate={selectedDate}
          onDateSelect={handleDateClick}
          swipeDirection={currentTransition}
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
