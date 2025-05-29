// GoogleCalendarConnectButton.js (팝업 방식으로 변경)

import React from 'react';

const GoogleCalendarConnectButton = () => {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_REDIRECTURI;

  const openAuthPopup = () => {
    const scope = 'https://www.googleapis.com/auth/calendar.readonly';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'GoogleAuthPopup',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const interval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(interval);
        const accessToken = localStorage.getItem('google_access_token');
        if (accessToken) {
          console.log('✅ 팝업 인증 후 access_token 확인됨');
          window.location.reload();
        } else {
          console.warn('❌ access_token 저장 실패 또는 취소됨');
        }
      }
    }, 500);
  };

  return (
    <button onClick={openAuthPopup}>
      📅 Google 캘린더 연동하기 (팝업)
    </button>
  );
};

export default GoogleCalendarConnectButton;
