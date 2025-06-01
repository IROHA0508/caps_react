// src/component/Calendar/WeekCalendarView.js
import React from 'react';
import dayjs from 'dayjs';
import './WeekCalendarView.css';

function WeekCalendarView({ selectedDate, onDateSelect, weekDates, swipeDirection }) {
  const today = dayjs();

  return (
    <div className={`calendar-body ${swipeDirection}`}>
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
              onClick={() => onDateSelect(date)}
            >
              {date.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeekCalendarView;
