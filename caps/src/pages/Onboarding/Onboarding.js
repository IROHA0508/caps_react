// Onboarding.js
import './Onboarding.css';
import onboard_picture from '../../pictures/onboard_pic.png';
import GoogleLoginButton from '../../component/GoogleLoginButton/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';

function Onboarding({ onComplete }) {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    console.log('✅ handleLoginSuccess 실행 : main 페이지로 이동');
    navigate('/main');
  };

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
        <GoogleLoginButton onLoginSuccess={handleLoginSuccess} />
        {/* <GoogleLoginButton
          useOneTap={false}
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.error('❌ Google 로그인 실패');
            alert('Google 로그인에 실패했습니다.');
          }}
        /> */}

      </div>
    </div>
  );
}

export default Onboarding;
