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
