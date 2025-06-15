import React from 'react';
import Header from '../../component/Header/Header';
import ChatVoice from '../../component/ChatVoice/ChatVoice'
import ChatVoice2 from '../../component/ChatVoice/ChatVoice2';

import './TestPage.css';


function TestPage() {
  // const [latestResult, setLatestResult] = useState("");

  // const [setLatestResult] = useState("");
  const handleMessage = () => {
    console.log('🎯 GPT 응답 이후 실행할 작업');
    // 예: 감정 상태 업데이트, 로그 저장 등

  };

  return (
    <div className="test-page-container">
      <Header title="테스트 페이지" />

      {/* <div style={{ padding: '2rem', textAlign: 'center' }}>
        <VoiceRecognizer onResult={(text) => setLatestResult(text)} />
      </div> */}
      <p style={{ textAlign: 'center' }}>Web Speech API 대화 모드</p>
      <ChatVoice onMessage={handleMessage}/>
      {/* <ChatVoice2 onMessage={handleMessage}/> */}
      {/* <ChatVoice_ver2 /> */}
    </div>
  );
}

export default TestPage;
