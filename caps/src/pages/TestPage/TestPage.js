import React from 'react';
import Header from '../../component/Header/Header';
// import VoiceRecognizer from '../../component/VoiceRecognizer/VoiceRecognizer';
import ChatVoice from '../../component/ChatVoice/ChatVoice'
import ModeSelect from '../../component/ModeSelect/ModeSelect';

import './TestPage.css';


function TestPage() {
  // const [latestResult, setLatestResult] = useState("");

  // const [setLatestResult] = useState("");
  return (
    <div className="test-page-container">
      <Header title="테스트 페이지" />

      {/* <div style={{ padding: '2rem', textAlign: 'center' }}>
        <VoiceRecognizer onResult={(text) => setLatestResult(text)} />

      </div> */}
      <p style={{ textAlign: 'center' }}>Web Speech API 대화 모드</p>
      <ChatVoice />
      {/* <ChatVoice_ver2 /> */}
    </div>
  );
}

export default TestPage;
