// GoogleCalendarConnectButton.js

import React from 'react';

export const openAuthPopup = (onSuccessNavigate) => {
  const accessToken = localStorage.getItem('google_access_token');

  // ✅ 유효한 access_token만 허용 (예: 30자 이상, "ya29."로 시작 등)
  const isValidAccessToken = accessToken && accessToken.startsWith('ya29.');

  if (isValidAccessToken) {
    console.log('🔧 access_token:', accessToken);
    console.log('✅ access_token 유효, 팝업 생략');
    if (typeof onSuccessNavigate === 'function') {
      onSuccessNavigate();
    }
    return;
  }


  // 🔽 기존 인증 팝업 로직
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_REDIRECTURI;

  // 구글 캘린더 scope 수정
  const scope = 'https://www.googleapis.com/auth/calendar';
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
      const newToken = localStorage.getItem('google_access_token');
      if (newToken && newToken.startsWith('ya29.')) {
        console.log('🔧 새로운 access_token 저장:', newToken);  // ✅ 최신 토큰을 직접 불러와 출력
        console.log('✅ 팝업 인증 후 access_token 저장됨');
        if (typeof onSuccessNavigate === 'function') {
          onSuccessNavigate();
        }
      } else {
        console.warn('❌ access_token 저장 실패 또는 취소됨');
      }
    }
  }, 500);
};

const GoogleCalendarConnectButton = () => {
  return (
    <button onClick={() => openAuthPopup(() => window.location.reload())}>
      📅 Google 캘린더 연동하기
    </button>
  );
};

export default GoogleCalendarConnectButton;
