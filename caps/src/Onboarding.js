import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './Onboarding.css';

function Onboarding({ onComplete }) {
  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    localStorage.setItem('user', JSON.stringify(decoded));
    console.log('✅ 로그인 성공:', decoded);
    onComplete();
  };

  const handleLoginError = () => {
    console.error('❌ 로그인 실패');
  };

  return (
    <div className="Onboarding">
      <h2>온보딩 페이지</h2>
      <p>
        실패도 응원해주는 인공지능 코치<br />
        <strong>LIA</strong>와 함께 루틴을 만들어보세요
      </p>

      <div className="google-login-wrapper">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          size="large" // 기본 제공 크기 옵션 (small, medium, large)
          width="250" // 일부 브라우저에서 적용될 수 있음
        />
      </div>
    </div>
  );
}

export default Onboarding;
