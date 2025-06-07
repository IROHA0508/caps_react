import React, { useState } from 'react';
import Header from '../../component/Header/Header';
import VoiceRecognizer from '../../component/VoiceRecognizer/VoiceRecognizer';
import ChatVoice from '../../component/ChatVoice/ChatVoice'
import ChatVoice_ver2 from '../../component/ChatVoice/ChatVoice_ver2';
import './TestPage.css';

function TestPage() {
  // const [latestResult, setLatestResult] = useState("");

  const [setLatestResult] = useState("");
  return (
    <div className="test-page-container">
      <Header title="테스트 페이지" />

      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <VoiceRecognizer onResult={(text) => setLatestResult(text)} />

      </div>
      <p style={{ textAlign: 'center' }}>Web Speech API 대화 모드</p>
      <ChatVoice />

      <p style={{ textAlign: 'center' }}>Google Cloud Speech-to-Text</p>

`      {/* <ChatVoice_ver2 /> */}
    </div>
  );
}

export default TestPage;
