import React, { useState, useEffect } from 'react';
import './RoutineCalendar.css';
import dayjs from 'dayjs';
import { useSwipeable } from 'react-swipeable';
import underIcon from '../../pictures/underIcon.svg';
import MonthPicker from './MonthPicker/MonthPicker';
import WeekCalendarView from './WeekCalendarView';

function RoutineCalendar({ selectedDate, onDateSelect }) {
  const today = dayjs();
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));
  const [swipeDirection, setSwipeDirection] = useState('');
  const [showMonthPicker, setShowMonthPicker] = useState(false);

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
    onDateSelect(date);
  };

  const handleMonthSelect = (monthStart) => {
    const weekStart = monthStart.startOf('week');
    setCurrentWeekStart(weekStart);
    onDateSelect(monthStart); // 날짜 선택도 업데이트
    setShowMonthPicker(false); // 모달 닫기
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNextWeek,
    onSwipedRight: goToPrevWeek,
    trackMouse: true,
  });

  return (
    <div className="calendar-container" {...swipeHandlers}>
      <div className="calendar-header">
        <span className="month-text" onClick={() => setShowMonthPicker(!showMonthPicker)}>
          {currentWeekStart.format('M월')}
          <img src={underIcon} alt="드롭다운" className="under-icon" />
        </span>
      </div>

      {/* 🔽 월 선택 모달 */}
      {showMonthPicker && (
        <MonthPicker
          currentDate={currentWeekStart}
          onMonthSelect={handleMonthSelect}
          onClose={() => setShowMonthPicker(false)}
        />
      )}

      {/* ✅ 날짜 영역 전체에 애니메이션 적용 */}
      <WeekCalendarView
        selectedDate={selectedDate}
        onDateSelect={handleDateClick}
        weekDates={weekDates}
        swipeDirection={swipeDirection}
      />
      {/* <div className={`calendar-body ${swipeDirection}`}>
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
      </div> */}

      <div className="calendar-divider" />
    </div>
  );
}

export default RoutineCalendar;
