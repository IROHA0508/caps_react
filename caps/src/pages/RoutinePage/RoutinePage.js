// RoutinePage.js
import React, { useEffect, useState } from 'react';
import Header from '../../component/Header/Header';

import RoutineCalendar from '../../component/Calendar/RoutineCalendar';
import ScheduleList from './ScheduleList';
import { gapi } from 'gapi-script';
import dayjs from 'dayjs';


function RoutinePage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [googleEvents, setGoogleEvents] = useState([]);

  // TODO: 토큰 값은 로그인 시 localStorage 또는 props에서 받아오도록 조정
  const jwtToken = localStorage.getItem('jwt');

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        ],
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
      }).then(() => {
        return gapi.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: 'startTime',
        });
      }).then((response) => {
        setGoogleEvents(response.result.items || []);
      });
    };

    gapi.load('client:auth2', initClient);
  }, [jwtToken]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <RoutineCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <ScheduleList
          selectedDate={selectedDate}
          events={googleEvents}
        />
      </div>
    </div>
  );
}

export default RoutinePage;