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

    // ✅ 하루 종일 여부 판별 (start 문자열 기준)
    const isAllDay =
      (typeof rawStart === 'string' && !rawStart.includes('T')) ||
      (!!event.start?.date && !event.start?.dateTime);

    console.log(
      '📌 일정:', event.summary,
      '| 일정 범위:', eventStart.format(),'~', eventEnd.format(),
      '| 하루 종일:', isAllDay ? '✅' : '❌',
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


  const isAllDay = (event) =>
    (typeof event.start === 'string' && !event.start.includes('T')) ||
    (!!event.start?.date && !event.start?.dateTime);

  const allDayEvents = sortedEvents.filter(isAllDay);
  const timedEvents = sortedEvents.filter((event) => !isAllDay(event));
  
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
      {allDayEvents.map((event) => {
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

      {/* 하루 종일 일정과 시간 일정이 있는 경우만 구분선 출력 */}
      {timedEvents.length > 0 && allDayEvents.length > 0 && <hr className="schedule-divider" />}

      {/* ⏰ 시간 포함 일정 */}
      {timedEvents.map((event) => {
        const start = dayjs(event.start.dateTime);

        console.log('event:', event);
        console.log('start:', event.start);
        console.log('start dateTime:', dayjs(event.start).format('HH:mm'));
        console.log('⏰ 시간 일정:', event.summary, '| 시작:', start.format(), '| 색상:', event.color);

        const color = event.color || '#33AAEE';
        return (
          <li key={event.id} className="schedule-item">
            <div className="time-event-wrapper">
              {/* ⬆️ 원 + 시간 */}
              <div className="dot-time-group">
                <div className="dot-wrapper">
                  <span className="schedule-color-dot" style={{ borderColor: color }} />
                </div>
                <span className="schedule-time">{dayjs(event.start).format('A h시 mm분')}</span>
              </div>

              {/* ⬇️ 세로선 + 제목 */}
              <div className="line-title-group">
                <div className="vertical-line" />
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
