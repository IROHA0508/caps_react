// src/component/GoogleLoginButton.js
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { gapi } from 'gapi-script';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const serverIP = process.env.REACT_APP_IP_PORT;

  const handleLogin = async (credentialResponse) => {
    try {
      // 1. ID 토큰 디코딩 → 사용자 정보 저장
      const decoded = jwtDecode(credentialResponse.credential);
      localStorage.setItem('user', JSON.stringify(decoded));

      // 4. 로그인 콜백 실행
      if (onLoginSuccess) {
        onLoginSuccess(decoded);
      }

      // 5. 서버에 ID 토큰 전송하여 JWT 토큰 발급
      const res = await fetch(`https://${serverIP}/users/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const result = await res.json();
      const serverToken = result?.data?.token;
      if (serverToken) {
        localStorage.setItem('jwt_token', serverToken);
        console.log('✅ 서버용 JWT 토큰 저장 완료:', serverToken);
      } else {
        console.warn('⚠️ 서버 응답에 토큰이 없습니다.');
      }

    } catch (err) {
      console.error('❌ 로그인 또는 토큰 처리 중 에러:', err);
      alert('Google 로그인으로 서버에 접속 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="button-container">
      <GoogleLogin
        useOneTap={false}
        onSuccess={handleLogin}
        onError={() => {
          console.error('❌ Google 로그인 실패');
          alert('Google 로그인에 실패했습니다.');
        }}
      />
    </div>
  );
};

export default GoogleLoginButton;
