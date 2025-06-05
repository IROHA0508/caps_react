// src/pages/TestPage/TestPage.js
import React from 'react';
import Header from '../../component/Header/Header';

function TestPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/onboarding"; // 로그아웃 후 리디렉션
  };

  return (
    <div className="test-page-container">
      <Header user={user} onLogout={handleLogout} />

      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🧪 기능 테스트 페이지</h1>
        <p>여기에서 다양한 UI나 기능을 실험해보세요.</p>
      </div>
    </div>
  );
}

export default TestPage;
