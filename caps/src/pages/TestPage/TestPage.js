import React, { useState } from 'react';
import Header from '../../component/Header/Header';
import VoiceRecognizer from '../../component/VoiceRecognizer/VoiceRecognizer';
import './TestPage.css';

function TestPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [latestResult, setLatestResult] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/onboarding";
  };

  return (
    <div className="test-page-container">
      <Header user={user} onLogout={handleLogout} />

      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🧪 기능 테스트 페이지</h1>
        <VoiceRecognizer onResult={(text) => setLatestResult(text)} />
      </div>
    </div>
  );
}

// 레포 변경
export default TestPage;
