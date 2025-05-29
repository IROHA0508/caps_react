// src/pages/PopupCallback.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PopupCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    if (accessToken) {
      localStorage.setItem('google_access_token', accessToken);
      console.log('✅ 팝업 콜백: access_token 저장 완료');
    } else {
      console.warn('❌ 팝업 콜백: access_token 없음');
    }

    if (refreshToken) {
      localStorage.setItem('google_refresh_token', refreshToken);
      console.log('✅ 팝업 콜백: refresh_token 저장 완료');
    } else {
      console.warn('❌ 팝업 콜백: refresh_token 없음');
    }


    // 팝업 닫기
    window.close();
  }, []);

  return <p>Google 인증을 완료 중입니다...</p>;
}

export default PopupCallback;
