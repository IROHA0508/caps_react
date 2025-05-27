// GoogleLoginButton.js
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { gapi } from 'gapi-script';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const serverIP = process.env.REACT_APP_IP_PORT;

  const handleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      localStorage.setItem('user', JSON.stringify(decoded));

      // ✅ gapi 초기화 및 Access Token 획득
      await new Promise((resolve) => gapi.load('client:auth2', resolve));
      await gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        ],
        scope: 'https://www.googleapis.com/auth/calendar.events',
      });

      await gapi.auth2.getAuthInstance().signIn(); // 로그인 보장

      const accessToken = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getAuthResponse().access_token;

      localStorage.setItem('google_access_token', accessToken);
      console.log('✅ Google Access Token 저장 완료:', accessToken);

      if (onLoginSuccess) {
        onLoginSuccess(decoded);
      }

      // ✅ 서버에 credential 보내서 JWT 토큰 획득
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
      const token = result?.data?.token;
      if (token) {
        localStorage.setItem('jwt_token', token);
        console.log('✅ 서버용 JWT 토큰 저장 완료:', token);
      } else {
        console.warn('⚠️ 서버 응답에 토큰이 없습니다.');
      }
    } catch (err) {
      console.error('❌ Google 로그인 또는 토큰 저장 중 에러:', err);
      alert('로그인 중 문제가 발생했습니다.');
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
