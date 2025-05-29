// src/pages/Live2DPage/Live2DPage.js

import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';

function Live2DPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/onboarding';
  };

  return (
    <div className="live2d-page">
      <Header user={user} onLogout={handleLogout} />

      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🎨 Live2D 모드</h1>
        <p>여기에 Live2D 관련 콘텐츠를 렌더링하세요.</p>
      </main>
    </div>
  );
}

export default Live2DPage;
