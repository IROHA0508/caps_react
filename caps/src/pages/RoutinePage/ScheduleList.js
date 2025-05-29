// src/pages/RoutinePage/ScheduleList.js

import React from 'react';
import './ScheduleList.css';
import dayjs from 'dayjs';
import calendarIcon from '../../pictures/calendarIcon.svg';

import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

function ScheduleList({ selectedDate, events, isLoading }) {
  if (isLoading) {
    return (
      <div className="no-schedule">
        <p className="no-schedule-text">일정을 불러오는 중입니다...</p>
      </div>
    );
  }

  // ✅ 날짜 필터링 + 로그 출력
  const filteredEvents = events.filter((event) => {
    const rawStart = event.start.dateTime || event.start.date;
    const rawEnd = event.end.dateTime || event.end.date;

    const eventStart = dayjs(rawStart);
    const eventEnd = dayjs(rawEnd);

    const dayStart = selectedDate.startOf('day');
    const dayEnd = selectedDate.add(1, 'day').startOf('day');

    // 선택한 날짜 범위(dayStart ~ dayEnd)와 일정 범위(eventStart ~ eventEnd)가 겹치면 포함
    const isInRange = eventStart.isBefore(dayEnd) && eventEnd.isAfter(dayStart);

    console.log(
      '📌 일정:', event.summary,
      '| 일정 범위:', eventStart.format(),
      '~', eventEnd.format(),
      '| 지금금 선택한 날짜:', selectedDate.format('YYYY-MM-DD'),
      '| 포함 여부:', isInRange
    );

    return isInRange;
  });


  // ✅ 시간 순 정렬 (종일 먼저, 이후 시간 순)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const aAllDay = !a.start.dateTime;
    const bAllDay = !b.start.dateTime;

    if (aAllDay && !bAllDay) return -1;
    if (!aAllDay && bAllDay) return 1;

    const aStart = dayjs(a.start.dateTime || a.start.date);
    const bStart = dayjs(b.start.dateTime || b.start.date);
    return aStart - bStart;
  });

  if (sortedEvents.length === 0) {
    return (
      <div className="no-schedule">
        <img src={calendarIcon} alt="일정 없음" className="no-schedule-icon" />
        <p className="no-schedule-text">일정이 없어요</p>
        <p className="no-schedule-subtext">
          일정을 등록하고 시간을 효율적으로 <br />
          관리해 보세요.
        </p>
        <button className="add-schedule-btn" onClick={() => alert('새 일정 버튼 눌림')}>
          + 새 일정
        </button>
      </div>
    );
  }

  return (
    <ul className="schedule-list">
      {sortedEvents.map((event) => {
        const start = dayjs(event.start.dateTime || event.start.date);
        const isAllDay = !event.start.dateTime;

        return (
          <li key={event.id} className="schedule-item">
            <span className="schedule-time">
              {isAllDay ? '하루 종일' : start.format('A h시 mm분')}
            </span>
            <span className="schedule-title">{event.summary}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default ScheduleList;
