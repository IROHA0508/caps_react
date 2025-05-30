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

  // ✅ 날짜 필터링 + 로그 출력 (최종)
  const filteredEvents = events.filter((event) => {
    const selected = selectedDate.startOf('day');

    const rawStart = event.start;
    const rawEnd = event.end;

    const eventStart = dayjs(rawStart);
    const eventEnd = dayjs(rawEnd);

    const isInRange = selected.isSame(eventStart, 'day') || 
                      (selected.isAfter(eventStart) && selected.isBefore(eventEnd));

    console.log(
      '📌 일정:', event.summary,
      '| 일정 범위:', eventStart.format(),'~', eventEnd.format(),
      '| 지금 선택한 날짜:', selectedDate.format('YYYY-MM-DD'),
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

  // 일정 항목 렌더링 부분만 수정
  return (
    <ul className="schedule-list">
      {/* 🕐 하루 종일 일정 */}
      {sortedEvents
        .filter((event) => !event.start.dateTime)
        .map((event) => {
          const color = event.color || '#33AAEE';
          return (
            <li key={event.id} className="schedule-item">
              <div className="schedule-inline">
                <span className="schedule-color-dot" style={{ borderColor: color }} />
                <span className="schedule-title">{event.summary}</span>
              </div>
            </li>
          );
        })}

      {/* 구분선 */}
      <hr className="schedule-divider" />

      {/* ⏰ 시간 있는 일정 */}
      {sortedEvents
        .filter((event) => event.start.dateTime)
        .map((event) => {
          const start = dayjs(event.start.dateTime);
          const color = event.color || '#33AAEE';
          return (
            <li key={event.id} className="schedule-item">
              <div className="schedule-time-item">
                <span className="schedule-color-dot" style={{ borderColor: color }} />
                <div className="schedule-time-content">
                  <span className="schedule-time">{start.format('A h시 mm분')}</span>
                  <span className="schedule-title">{event.summary}</span>
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  );

}

export default ScheduleList;
