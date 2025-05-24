// LogoutButton.js
import React from 'react';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();  // 상태 초기화
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <button className="button" onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default LogoutButton;
