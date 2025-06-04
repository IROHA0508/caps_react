import { useState } from 'react';
import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

import TalkModeSelector from '../../component/TalkModeSelector/TalkModeSelector';
import Header from '../../component/Header/Header';

import './MainPage.css';

function MainPage() {
  const [showTalkOptions, setShowTalkOptions] = useState(false);

  // ✅ user를 초기 렌더링 시 localStorage에서 바로 불러옴
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null); // navigate는 useEffect에서 처리됨

    console.log("🗑️ 로그아웃 수행, 현재 localStorage.getItem('user'):", localStorage.getItem('user'));
  };

  useEffect(() => {
    if (user === null) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  const [calendarLinked, setCalendarLinked] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const linked = urlParams.get('calendarLinked');
    if (linked === 'true') {
      localStorage.setItem('calendarLinked', 'true');
      setCalendarLinked(true);
    } else {
      const stored = localStorage.getItem('calendarLinked');
      setCalendarLinked(stored === 'true');
    }
  }, []);

  useEffect(() => {
    const fetchAndForwardHealthData = async () => {
      const serverToken = localStorage.getItem("server_jwt_token");
      console.log("🔑 현재 Node 서버 토큰:", serverToken);
      if (!serverToken) {
        console.warn("❌ Google 토큰이 없습니다.");
        return;
      }

      try {
        // 1. Node 서버에 건강 정보 요청
        const nodeRes = await fetch(`https://${process.env.REACT_APP_IP_PORT}/data?days=1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${serverToken}`,
          },
        });

        if (!nodeRes.ok) {
          console.error("❌ Node 서버 응답 실패:", nodeRes.status);
          return;
        }

        const nodeData = await nodeRes.json();
        console.log("📦 Node 서버로부터 받은 건강 정보:", nodeData);
        // downloadJSON(nodeData);

        // 2. Flask 서버로 전송
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        console.log('🔗 백엔드 URL:', BACKEND_URL);
        
        // const flaskRes = await fetch(`${BACKEND_URL}/health/from-node`, {
        const flaskRes = await fetch(`http://localhost:5000/health/from-node`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // credentials: "include", // 🔥 이 줄 추가!
          body: JSON.stringify({
            user_id: JSON.parse(localStorage.getItem("user"))?.sub,
            data: nodeData,
          }),
        });

        if (!flaskRes.ok) {
          console.error("❌ Flask 서버 전송 실패:", flaskRes.status);
          return;
        }

        const result = await flaskRes.json();
        console.log("✅ Flask 응답:", result);
      } catch (error) {
        console.error("❌ 데이터 요청 중 오류:", error);
      }
    };

    // 로그인된 경우에만 실행
    if (user) {
      fetchAndForwardHealthData();
    }
  }, [user]);

// const downloadJSON = (data, filename = 'health_data.json') => {
//   const jsonStr = JSON.stringify(data, null, 2);
//   const blob = new Blob([jsonStr], { type: 'application/json' });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename;
//   a.click();

//   URL.revokeObjectURL(url);
// };

  return (
    <GoogleOAuthProvider clientId="829026060536-f7dpc16930esthgnn97soleggvmv3o16.apps.googleusercontent.com">
      <div className="main-page-container">
        {/* ✅ Header는 항상 렌더링되며 user를 props로 전달 */}
        <Header user={user} onLogout={handleLogout} />

        <div className="lia-wrapper">
          <div className="lia-text-box">
            <p>
              안녕하세요<br />
              저는 LIA예요<br />
              당신을 위해 디지털 세계에서 왔어요.<br />
              말 걸어주시면 언제든 함께할게요!
            </p>
          </div>

          <div className="lia-character-area">
            <div className="lia-button-wrapper">
              <button className="button" onClick={() => setShowTalkOptions(true)}>
                LIA와 이야기하기
              </button>
            </div>
          </div>
        </div>

        <TalkModeSelector
          visible={showTalkOptions}
          onClose={() => setShowTalkOptions(false)}
        />

        {calendarLinked && (
          <div className="calendar-status-message">
            📅 Google 캘린더 연동이 완료되었습니다!
          </div>
        )}
        
      </div>
    </GoogleOAuthProvider>
  );
}

export default MainPage;
