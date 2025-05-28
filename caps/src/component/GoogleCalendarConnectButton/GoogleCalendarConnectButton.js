// GoogleCalendarConnectButton.js

import React, { useEffect } from 'react';

const GoogleCalendarConnectButton = () => {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = 'http://localhost:5000/auth/callback';

  // 🟢 1. Google OAuth 인증 페이지로 리디렉션
  const redirectToCalendarAuth = () => {
    const scope = 'https://www.googleapis.com/auth/calendar.readonly';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    console.log('📅 Google Calendar 연동 리디렉션 시도:', authUrl);
    window.location.href = authUrl;
  };

  // 🟢 2. access_token 쿼리 파라미터 → localStorage 저장
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    if (accessToken) {
      localStorage.setItem('google_access_token', accessToken);
      console.log('✅ access_token 저장 완료');
      window.history.replaceState({}, document.title, window.location.pathname);
    } 
  }, []);

  return (
    <button onClick={redirectToCalendarAuth}>
      📅 Google 캘린더 연동하기
    </button>
  );
};

export default GoogleCalendarConnectButton;
