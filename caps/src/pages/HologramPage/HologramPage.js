// src/pages/HologramPage/HologramPage.js

import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/Header';

function HologramPage() {
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
    <div className="hologram-page">
      <Header user={user} onLogout={handleLogout} />

      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>📡 홀로그램 모드</h1>
        <p>여기에 홀로그램 관련 콘텐츠를 렌더링하세요.</p>
      </main>
    </div>
  );
}

export default HologramPage;
