import React, { useState } from 'react';
import Header from '../../component/Header/Header';
import VoiceRecognizer from '../../component/VoiceRecognizer/VoiceRecognizer';
import './TestPage.css';

function TestPage() {
  // const [latestResult, setLatestResult] = useState("");

  const [setLatestResult] = useState("");
  return (
    <div className="test-page-container">
      <Header title="마이 페이지" />

      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <VoiceRecognizer onResult={(text) => setLatestResult(text)} />
      </div>
    </div>
  );
}

export default TestPage;
