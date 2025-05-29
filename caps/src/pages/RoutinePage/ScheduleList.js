// src/pages/RoutinePage/ScheduleList.js

import React from 'react';
import './ScheduleList.css';
import dayjs from 'dayjs';
import calendarIcon from '../../pictures/calendarIcon.svg'

function ScheduleList({ selectedDate, events, isLoading }) {
  if (isLoading) {
    return (
      <div className="no-schedule">
        <p className="no-schedule-text">일정을 불러오는 중입니다...</p>
      </div>
    );
  }

  const filteredEvents = events.filter((event) => {
    const eventDate = dayjs(event.start.dateTime || event.start.date);
    return eventDate.isSame(selectedDate, 'day');
  });

  if (filteredEvents.length === 0) {
    return (
      <div className="no-schedule">
        <img src={calendarIcon} alt="일정 없음" className="no-schedule-icon" />
        <p className="no-schedule-text">일정이 없어요</p>
        <p className="no-schedule-subtext">일정을 등록하고 시간을 효율적으로 <br />관리해 보세요.</p>
        <button className="add-schedule-btn" onClick={() => alert("새 일정 버튼 눌림")}>
          + 새 일정
        </button>
      </div>
    );
  }

  return (
    <ul className="schedule-list">
      {filteredEvents.map((event) => {
        const start = dayjs(event.start.dateTime || event.start.date);
        return (
          <li key={event.id} className="schedule-item">
            <span className="schedule-time">{start.format('A h시 mm분')}</span>
            <span className="schedule-title">{event.summary}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default ScheduleList;