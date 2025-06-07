// RoutinePage.js

import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import RoutineCalendar from '../../component/Calendar/RoutineCalendar';
import ScheduleList from './ScheduleList';
import dayjs from 'dayjs';

function RoutinePage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 추가
  const [currentMonth, setCurrentMonth] = useState(''); // 현재 받아온 달
  
  // ✅ access_token으로 일정 가져오기
  const fetchCalendarEvents = async (startDate, endDate) => {
      setIsLoading(true);
      console.log('📅 일정 가져오기 시작:', startDate, endDate);

      const accessToken = localStorage.getItem('google_access_token');
      const refreshToken = localStorage.getItem('google_refresh_token');
      // if (!accessToken) return;

      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      console.log('🔗 백엔드 URL:', BACKEND_URL);

      try {
      const res = await fetch(`${BACKEND_URL}/calendar/events`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
        }),
      });
      
      // 🔥 access_token이 만료된 경우 → 재로그인 유도 또는 제거
      if (res.status === 401) {
        console.warn("❌ 토큰 만료: 재로그인 필요");
        localStorage.removeItem("google_access_token");
        localStorage.removeItem("google_refresh_token");
        alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        window.location.reload();
        return;
      }

      const data = await res.json();
      if (data.new_access_token) {
        localStorage.setItem('google_access_token', data.new_access_token);
      }

      if (data.events) {
        setEvents(data.events);
        console.log('📆 받아온 일정:', data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('❌ 일정 불러오기 실패:', err);
      setEvents([]); // 에러 시도 비움
    }

    setIsLoading(false); // 마지막에 로딩 false
  };

  // ✅ 달 변경 감지하여 일정 요청 (최종)
  useEffect(() => {
    const newMonth = selectedDate.format('YYYY-MM');
    if (newMonth !== currentMonth) {
      const startOfMonth = selectedDate.startOf('month');
      const endOfMonth = selectedDate.endOf('month');
      fetchCalendarEvents(startOfMonth.toDate(), endOfMonth.toDate());
      setCurrentMonth(newMonth); // ✅ 현재 달 업데이트
    }
  }, [selectedDate, currentMonth]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <RoutineCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <ScheduleList
          selectedDate={selectedDate}
          events={events} // ✅ 받아온 일정 전달
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default RoutinePage;
