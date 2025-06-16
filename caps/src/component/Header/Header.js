// component/Header/Header.js
import React, { useState, useEffect, useRef  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import OptionMenu from '../OptionMenu/OptionMenu';
import './Header.css';

import menuIcon from '../../pictures/menuIcon.svg';
import backIcon from '../../pictures/backIcon.svg';

function Header({ user, serverUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const isMain = location.pathname === '/main';
  const isNotMain = !isMain;

  const mediaStreamRef = useRef(null);

  useEffect(() => {
    // 마이크 권한 요청
    // navigator.mediaDevices.getUserMedia({ audio: true })
    //   .then(stream => {
    //     mediaStreamRef.current = stream;
    //   })
    //   .catch(console.error);

    // 전역 이벤트 리스너 등록
    function handleStopMic() {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }
    window.addEventListener('stopMic', handleStopMic);

    // 컴포넌트 언마운트 시에도 정리
    return () => {
      window.removeEventListener('stopMic', handleStopMic);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getTitle = () => {
    if (location.pathname === '/main/routine') return '일정 / 루틴';
    if (location.pathname === '/main/report') return '통계 리포트';
    if (location.pathname === '/main/mypage') return '마이 페이지';
    if (location.pathname === '/test') return '🧪 기능 테스트 페이지';
    return '';
  };

  const handleMenuClick = () => {
    setMenuOpen((prev) => {
      if (!prev) setSelectedMenu(null);
      return !prev;
    });
  };

  const handleMenuSelect = (item) => {
    setSelectedMenu(item);
    setMenuOpen(false);
  };

  return (
    <div  className={`header-container ${isMain ? 'header-main' : 'header-sub'}`}>
      {isMain && user &&(
        <>
          <img src={user.picture} alt="프로필" className="header-profile" />
          <span className="header-username">
            {(serverUser || user.name) + '님!'}
          </span>
          <img
            src={menuIcon}
            alt="메뉴"
            className="menu-icon"
            onClick={handleMenuClick}
          />
          <OptionMenu
            visible={menuOpen}
            selectedMenu={selectedMenu}
            onSelect={handleMenuSelect}
            onClose={() => setMenuOpen(false)}
            onLogout={onLogout}
          />
        </>
      )}

      {isNotMain && (
        <>
          <button
            className="back-button"
            onClick={() => {
              if (location.pathname === '/main') {
              // 전역 이벤트로 "마이크 중지" 요청
              window.dispatchEvent(new Event('stopMic'));
              }
              navigate(-1);
            }}
            aria-label="뒤로가기"
          >
            <img src={backIcon} alt="뒤로가기" />
          </button>
          <h2 className="header-title">{getTitle()}</h2>
        </>
      )}
    </div>

  );
}

export default Header;
