// src/component/Calendar/RoutineCalendar.js

import React, { useState } from 'react';
import './RoutineCalendar.css';
import dayjs from 'dayjs';
import underIcon from '../../pictures/underIcon.svg';

function RoutineCalendar({ selectedDate, onDateSelect }) {
  const today = dayjs();
  const [currentMonth] = useState(today);
  // const [currentMonth, setCurrentMonth] = useState(today);

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    currentMonth.startOf('week').add(i, 'day')
  );

  // const handleMonthChange = (offset) => {
  //   setCurrentMonth(currentMonth.add(offset, 'month'));
  // };

  const handleDateClick = (date) => {
    onDateSelect(date);
  };

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
