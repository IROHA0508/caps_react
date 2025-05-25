// Splash.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding'); // 2초 후 온보딩 페이지로 이동
    }, 2000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate]);

  return (
    <div className="Splash">
      <div className="Splash__content">
        <div className="Splash__title">LIA</div>
        <div className="Splash__subtitle">Listen, Interact, Assist</div>
      </div>
    </div>
  );
}

export default Splash;
