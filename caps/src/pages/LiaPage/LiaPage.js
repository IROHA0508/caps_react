// LiaPage.js
import { useEffect,useState } from 'react';
import { GoogleOAuthProvider} from '@react-oauth/google';

import LogoutButton from '../../component/LogoutButton/LogoutButton';
import TalkModeSelector from '../../component/TalkModeSelector/TalkModeSelector';

import './LiaPage.css';
import menu_dot from '../../pic/menu_dots.svg'
import report_button from '../../pic/report_button.svg'
import routine_button from '../../pic/routine_button.svg'
import logout_button from '../../pic/logout_button.svg'
import report_button_select from '../../pic/report_button_select.svg'
import routine_button_select from '../../pic/routine_button_select.svg'
import logout_button_select from '../../pic/logout_button_select.svg'

function LiaPage() {
  const [showTalkOptions, setShowTalkOptions] = useState(false);
  
  // 로그인한 사용자의 정보 가져오기
  const [user, setUser] = useState(null);

  // 메뉴 상태 관리
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null); // 예: 'routine', 'report', 'logout'

  useEffect(() => {
  const interval = setInterval(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, 500); // 0.5초마다 체크

  return () => clearInterval(interval);
}, []);

  return (
    <GoogleOAuthProvider clientId="829026060536-f7dpc16930esthgnn97soleggvmv3o16.apps.googleusercontent.com">
      <div className="lia-page-container">

        {/* 좌측 상단 메뉴 버튼 */}
        <img
          src={menu_dot}
          alt="메뉴"
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        />

        {/* 메뉴 드롭다운 */}
        {menuOpen && (
          <div className="dropdown-menu">
            <div
                className="menu-item"
                onClick={() => setSelectedMenu('routine')}
              >
                <img
                  src={
                    selectedMenu === 'routine'
                      ? routine_button_select
                      : routine_button
                  }
                  alt="루틴"
                />
                <span
                  style={{ color: selectedMenu === 'routine' ? '#000000' : '#83858A' }}
                >
                  일정/루틴 보기
                </span>
              </div>

            <div
                className="menu-item"
                onClick={() => setSelectedMenu('report')}
              >
                <img
                  src={
                    selectedMenu === 'report'
                      ? report_button_select
                      : report_button
                  }
                  alt="리포트"
                />
                <span
                  style={{ color: selectedMenu === 'report' ? '#000000' : '#83858A' }}
                >
                  통계 리포트
                </span>
              </div>

              <div
                className="menu-item"
                onClick={() => setSelectedMenu('logout')}
              >
                <img
                  src={
                    selectedMenu === 'logout'
                      ? logout_button_select
                      : logout_button
                  }
                  alt="로그아웃"
                />
                <span
                  style={{ color: selectedMenu === 'logout' ? '#000000' : '#83858A' }}
                >
                  로그아웃
                </span>
              </div>

          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
          <p>This is LIA page</p>
        </div>

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


        <TalkModeSelector visible={showTalkOptions} onClose={() => setShowTalkOptions(false)} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default LiaPage;
