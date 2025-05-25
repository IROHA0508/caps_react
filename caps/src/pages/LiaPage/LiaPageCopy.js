// LiaPage.js
import { useEffect,useState } from 'react';
import { GoogleOAuthProvider} from '@react-oauth/google';

import LogoutButton from '../../component/LogoutButton/LogoutButton';
import TalkModeSelector from '../../component/TalkModeSelector/TalkModeSelector';

import './LiaPage.css';
import api from '../../api/Api';

function LiaPage() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [topEmotions, setTopEmotions] = useState([]);
  const [showTalkOptions, setShowTalkOptions] = useState(false);
  
  // 로그인한 사용자의 정보 가져오기
  const [user, setUser] = useState(null);

  useEffect(() => {
  const interval = setInterval(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, 500); // 0.5초마다 체크

  return () => clearInterval(interval);
}, []);

  
  const handleTestClick = () => {
    setShowAnalysis(true)
  };

  const handleAnalyze = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/emotion_analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      setTranslatedText(data.translated_text);
      setTopEmotions(data.top_emotions);
    } catch (error) {
      console.error('감정 분석 오류:', error);
      setTranslatedText('');
      setTopEmotions([{ label: '서버 오류', probability: 0 }]);
    }
  };


  const fetchHealthData = async () => {
  try {
    // 1. 프론트엔드 자체 서버에서 건강 데이터 요청
    const response = await api.get('/data', {
      // n 일 데이터 요청 : /data?days=n
      message: "건강 데이터를 요청합니다"
    });

    const healthData = response.data;
    console.log('✅ 서버에서 건강 데이터 받아옴:', healthData);

    // 2. 받아온 데이터를 로컬 스토리지에 저장
    localStorage.setItem('healthData', JSON.stringify(healthData));
    console.log('✅ 로컬에 healthData 저장 완료');

    // 3. Flask 서버로 GET 요청 보내기
    const jwt = localStorage.getItem('jwt'); // 로그인 시 저장한 토큰이 있다면 포함

    const flaskResponse = await fetch('http://localhost:5000/data/receive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jwt && { 'Authorization': `Bearer ${jwt}` }),
      },
      body: JSON.stringify(healthData),
    });

    if (flaskResponse.ok) {
      console.log('✅ Flask 서버로 데이터 전송 성공');
    } else {
      console.error('❌ Flask 서버 응답 실패:', flaskResponse.status);
    }

  } catch (error) {
    console.error('건강 정보 처리 중 오류 발생:', error);
  }
};



const sendToServer = async () => {
  try {
    const jwt = localStorage.getItem('jwt');
    const response = await fetch('http://15.165.19.114:3000/data/sendserver', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jwt && { 'Authorization': `Bearer ${jwt}` }),
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('📤 서버 전송 성공:', data);
      alert('리포트 서버 전송 완료!');
    } else {
      const err = await response.text();
      console.error('❌ 서버 응답 오류:', err);
      alert('리포트 전송 실패');
    }
  } catch (error) {
    console.error('❌ 전송 중 오류 발생:', error);
    alert('전송 중 오류 발생');
  }
};




  return (
    <GoogleOAuthProvider clientId="829026060536-f7dpc16930esthgnn97soleggvmv3o16.apps.googleusercontent.com">
      <div>
        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
          <p>This is LIA page</p>
        </div>

        {/* <GoogleLoginButton /> */}
        {user ? (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p>{user.name}님, 환영합니다!</p>
            <img
              src={user.picture}
              alt="프로필"
              style={{ borderRadius: '50%', width: '50px' }}
            />
          
          <LogoutButton onLogout={() => setUser(null)} />

          </div>
        ) : (
          <p>로그인 정보를 불러올 수 없습니다.</p>
        )}

        <div className="button-container">
          <button className="button" onClick={() => setShowTalkOptions(true)}>LIA와 이야기하기</button>
        </div>

        <div className="button-container">
          <button className="button" onClick={fetchHealthData}>건강 데이터 가져오기</button>
        </div>

        <div className="button-container">
          <button className="button" onClick={sendToServer}>서버로 리포트 전송</button>
        </div>


        <div className="button-container">
          <button className="button" onClick={handleTestClick}>감정 분석 테스트</button>
        </div>

        {showAnalysis && (
          <div className="analysis-container">
            <textarea
              className="input-text"
              placeholder="분석할 문장을 입력하세요"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button className="button" onClick={handleAnalyze}>분석하기</button>

            {translatedText && (
              <div className="result-text">
                <p><strong>번역된 문장:</strong> {translatedText}</p>
                <p><strong>예측된 감정 TOP5:</strong></p>
                <ul>
                  {topEmotions.map((emotion, index) => (
                    <li key={index}>
                      {index + 1}. {emotion.label} ({(emotion.probability * 100).toFixed(2)}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <TalkModeSelector visible={showTalkOptions} onClose={() => setShowTalkOptions(false)} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default LiaPage;
