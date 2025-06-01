import React from 'react';
import dayjs from 'dayjs';
import './MonthCalendarView.css'; // 동일한 스타일 사용

function MonthCalendarView({ selectedDate, onDateSelect, swipeDirection  }) {
  const start = dayjs(selectedDate).startOf('month').startOf('week');
  const end = dayjs(selectedDate).endOf('month').endOf('week');

  const dates = [];
  let current = start;

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    dates.push(current);
    current = current.add(1, 'day');
  }

  return (
    <div className={`calendar-body month-mode ${swipeDirection}`}>
      <div className="day-labels">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div key={i} className="day-label">{day}</div>
        ))}
      </div>

      <div className="month-grid">
        {dates.map((date) => {
          const isToday = date.isSame(dayjs(), 'day');
          const isSelected = date.isSame(selectedDate, 'day');
          const isSameMonth = date.month() === selectedDate.month();

          return (
            <div
              key={date.format('YYYY-MM-DD')}
              className={`date-circle ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isSameMonth ? 'dimmed' : ''}`}
              onClick={() => onDateSelect(date)} // 클릭해도 Month 뷰 유지
            >
              {date.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthCalendarView;
