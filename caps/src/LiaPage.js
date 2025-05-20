// LiaPage.js
import { useState } from 'react';
import './LiaPage.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import api from './Api';

function LiaPage() {
  // 감정 분석
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [topEmotions, setTopEmotions] = useState([]);

  // 로그인
  const [userInfo, setUserInfo] = useState(null);

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
      const response = await api.get('/data', {
        message: "건강 데이터를 요청합니다"
      });

      console.log('서버 응답:', response.data);

      localStorage.setItem('healthData', JSON.stringify(response.data));
      console.log('✅ 로컬에 healthData 저장 완료');
    } catch (error) {
      console.error('건강 정보 전송 실패:', error);
    }
  };



  return (
    <GoogleOAuthProvider clientId="829026060536-f7dpc16930esthgnn97soleggvmv3o16.apps.googleusercontent.com">
      <div>
        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
          <h1>Welcome to the LIA page!</h1>
          <p>This is the second screen.</p>

          <div className="button-container">
            {!userInfo ? (
                <GoogleLogin
                useOneTap={false}
                onSuccess={async (credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                setUserInfo(decoded);
                console.log('로그인 성공:', decoded);

                try {
                  const res = await fetch('http://15.165.19.114:3000/users/google', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      credential: credentialResponse.credential
                    })
                  });

                  const result = await res.json();
                  console.log('✅ 서버 응답:', result);

                  const token = result?.data?.token;
                  if (token) {
                    console.log('✅ JWT 토큰:', token);
                    // 필요 시 localStorage 등에 저장
                    localStorage.setItem('jwt_token', token);

                  } else {
                    console.warn('⚠️ 서버 응답에 토큰이 없습니다.');
                  }
                } catch (error) {
                  console.error('❌ 사용자 정보 전송 실패:', error);
                }
              }}
              />
            ) : (
              <div style={{ marginTop: '1rem' }}>
                <p><strong>환영합니다, {userInfo.name}님!</strong></p>
                <img src={userInfo.picture} alt="프로필" style={{ borderRadius: '50%', width: '50px' }} />
              </div>
            )}
          </div>
        </div>

        <div className="button-container">
          <button className="button" onClick={fetchHealthData}>건강 데이터 가져오기</button>
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
      </div>
    </GoogleOAuthProvider>
  );
}

export default LiaPage;
