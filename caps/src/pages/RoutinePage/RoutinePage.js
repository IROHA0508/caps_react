// RoutinePage.js

import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';
import RoutineCalendar from '../../component/Calendar/RoutineCalendar';
import ScheduleList from './ScheduleList';
// import GoogleCalendarConnectButton from '../../component/GoogleCalendarConnectButton/GoogleCalendarConnectButton';
import dayjs from 'dayjs';

function RoutinePage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState([]);

  // ✅ access_token으로 일정 가져오기
  const fetchCalendarEvents = async (startDate, endDate) => {
    const accessToken = localStorage.getItem('google_access_token');
    if (!accessToken) return;

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    console.log('🔗 백엔드 URL:', BACKEND_URL);
    try {
      const res = await fetch(`${BACKEND_URL}/calendar/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: localStorage.getItem('google_access_token'),
          refresh_token: localStorage.getItem('google_refresh_token'),
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
        }),
      });

      const data = await res.json();
      if (data.new_access_token) {
        localStorage.setItem('google_access_token', data.new_access_token);
        console.log('🔧 새로운 access_token 저장:', data.new_access_token);
      }

      if (data.events) {
        setEvents(data.events);
        console.log('📆 받아온 일정:', data.events);
      } else {
        console.warn('⚠️ 일정 응답 없음:', data);
      }
    } catch (err) {
      console.error('❌ 일정 불러오기 실패:', err);
    }
  };

  // useEffect(() => {
  //   const startOfMonth = selectedDate.startOf('month');
  //   const endOfMonth = selectedDate.endOf('month');
  //   fetchCalendarEvents(startOfMonth.toDate(), endOfMonth.toDate());
  // }, [selectedDate.format('YYYY-MM')]);

  useEffect(() => {
    const startOfMonth = selectedDate.startOf('month');
    const endOfMonth = selectedDate.endOf('month');
    fetchCalendarEvents(startOfMonth.toDate(), endOfMonth.toDate());
  }, [selectedDate]);



  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <RoutineCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* <div style={{ margin: '1rem 0', textAlign: 'center' }}>
          <GoogleCalendarConnectButton />
        </div> */}

        <ScheduleList
          selectedDate={selectedDate}
          events={events} // ✅ 받아온 일정 전달
        />
      </div>
    </div>
  );
}

export default RoutinePage;
