// src/component/GoogleLoginButton/GoogleLoginButton.js

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const serverIP = process.env.REACT_APP_IP_PORT;
  console.log("🔧 서버 IP:", serverIP);

  // 🔐 Google 로그인 성공 핸들러
  const handleLogin = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      const decoded = jwtDecode(googleToken);

      // ✅ 유저 정보 저장
      localStorage.setItem('google_token', googleToken);
      localStorage.setItem('user', JSON.stringify(decoded));
      console.log('✅ Google 로그인 성공:', decoded);


      // ✅ 프로젝트 서버에 JWT 토큰 요청 -> 서버 키면 주석 해제
      // const res = await fetch(`https://${serverIP}/users/google`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     credential: credentialResponse.credential,
      //   }),
      // });
      // console.log('🔗 서버 주소:', `https://${serverIP}/users/google`);
      // console.log('🔗 프로젝트 서버 응답:', res);
      // // console.log('🔗 서버 응답 상태:', res.status);
      // const result = await res.json();
      // const token = result?.data?.token;
      // if (token) {
      //   localStorage.setItem('server_jwt_token', token);
      //   console.log('✅프로젝트 서버용 JWT 토큰 저장 완료:', token);
      // } else {
      //   console.warn('⚠️프로젝트 서버 응답에 토큰이 없습니다.');
      // }

    // ✅ 서버 JWT 토큰 요청이 성공했을 경우에만 메인 페이지로 이동
  // if (res.ok && onLoginSuccess){
    if (onLoginSuccess) {
        console.log("✅ onLoginSuccess 콜백 호출됨");
        onLoginSuccess(decoded);
      }
    } catch (err) {
      console.error('❌ 로그인 실패:', err);
      alert('Google 로그인 중 오류가 발생했습니다.');
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
        scope="openid email profile"
      />
    </div>
  );
};

export default GoogleLoginButton;
