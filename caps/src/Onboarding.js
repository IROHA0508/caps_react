// Onboarding.js
import './Onboarding.css';
import onboard_picture from './pic/onboard_pic.png';
import GoogleLoginButton from './GoogleLoginButton';

function Onboarding({ onComplete }) {
  return (
    <div className="Onboarding">
      <div className="onboard-image-wrapper">
        <img src={onboard_picture} alt="온보딩 이미지" className="onboard-image" />
      </div>

      <p style={{ fontFamily: 'Pretendard Variable, sans-serif' }}>
        실패도 응원해주는 인공지능 코치<br />
        <strong>LIA</strong>와 함께 루틴을 만들어보세요
      </p>

      <div className="google-login-wrapper">
        <GoogleLoginButton onLoginSuccess={onComplete} />
      </div>
    </div>
  );
}

export default Onboarding;
