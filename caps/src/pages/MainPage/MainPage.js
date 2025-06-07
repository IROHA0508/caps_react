import { useState, useEffect } from 'react';
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

  const [serverUser, setServerUser] = useState(null); // ✅ 서버에서 받은 사용자 정보 상태

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

  // ✅ 서버에서 사용자 nickname 등 정보를 불러옴
  useEffect(() => {
    const fetchServerUser = async () => {
      const token = localStorage.getItem('server_jwt_token');
      if (!token) return;

      try {
        const response = await fetch(`https://${process.env.REACT_APP_IP_PORT}/users/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('❌ 서버 사용자 정보 요청 실패:', response.status);
          return;
        }

        const data = await response.json();
        console.log('🙋 서버에서 받은 사용자 정보:', data);
        // downloadJSON(data); // ✅ 받은 JSON을 다운로드

        const nickname = data.data?.nickname;
        const gender = data.data?.gender;
        const age = data.data?.age;
        console.log("🙋 서버 사용자에 저장된 닉네임:", nickname);

        setServerUser(nickname);

        localStorage.setItem('node_serverUser_nickname', JSON.stringify(nickname));
        localStorage.setItem('node_serverUser_gender', JSON.stringify(gender))
        localStorage.setItem('node_serverUser_age', JSON.stringify(age));
      } catch (error) {
        console.error('❌ 서버 사용자 정보 요청 중 오류:', error);
      }
    };

    if (user) {
      fetchServerUser();
    }
  }, [user]);

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
      const today = new Date().toISOString().slice(0, 10);

      // ✅ 오늘 날짜와 마지막 실행 날짜 비교 -> 나중에 실제 배포할 때 주석 해제
      // const lastExecuted = localStorage.getItem("last_health_sync");

      // ✅ 오늘 날짜와 마지막 실행 날짜 비교 -> 나중에 실제 배포할 때 주석 해제
      // if (lastExecuted === today) {
      //   console.log("📅 오늘 이미 건강 데이터를 전송했습니다.");
      //   return;
      // }

      if (!serverToken) {
        console.warn("❌ Google 토큰이 없습니다.");
        return;
      }

      try {
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

        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

        if (nodeData &&
          nodeData.data &&
          Array.isArray(nodeData.data.biometrics) &&
          nodeData.data.biometrics.length > 0) {

          const flaskRes = await fetch(`${BACKEND_URL}/health/from-node`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
          const feedback = result.feedback;

          if (feedback) {
            console.log("💬 Flask 서버로부터 받은 피드백:", feedback);
            localStorage.setItem("today_feedback", feedback);

            // ✅ 추천 저장 완료 후에 날짜 기록
            localStorage.setItem("last_health_sync", today);
            console.log("📅 오늘의 데이터 전송 완료");
          }
        } else {
          console.warn("❌ Node 서버에서 받은 데이터가 없습니다.");
        }
      } catch (error) {
        console.error("❌ 데이터 요청 중 오류:", error);
      }
    };

    if (user) {
      fetchAndForwardHealthData();
    }
  }, [user]);


  const downloadJSON = (data, filename = 'user_info.json') => {
    const jsonStr = JSON.stringify(data, null, 2); // 보기 좋은 들여쓰기
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };


  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="main-page-container">
        {/* ✅ Header는 항상 렌더링되며 user와 서버 유저 정보를 props로 전달 */}
        <Header user={user} serverUser={serverUser} onLogout={handleLogout} />

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

              {/* ⬇️ 테스트 페이지로 이동하는 버튼 추가 */}
              <button
                className="button test-button"
                onClick={() => navigate("/test")}
              >
                테스트 페이지로 이동
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
