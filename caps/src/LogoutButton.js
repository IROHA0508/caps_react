// LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <button className="button" onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default LogoutButton;
