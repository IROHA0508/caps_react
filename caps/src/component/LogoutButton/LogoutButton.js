import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    // navigate('/onboarding'); // 로그아웃 후 온보딩 페이지로 이동
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <button className="button" onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default LogoutButton;
