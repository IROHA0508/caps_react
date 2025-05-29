import React from 'react';
import './MonthPicker.css';
import dayjs from 'dayjs';

function MonthPicker({ currentDate, onMonthSelect, onClose }) {
  return (
    <div className="month-picker-modal">
      <div className="month-grid">
        {[...Array(12)].map((_, idx) => {
          const month = idx + 1;
          return (
            <div
              key={idx}
              className={`month-cell ${currentDate.month() === idx ? 'selected' : ''}`}
              onClick={() => {
                const newMonth = currentDate.month(idx).startOf('month');
                onMonthSelect(newMonth);
                onClose();
              }}
            >
              {month}월
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthPicker;
