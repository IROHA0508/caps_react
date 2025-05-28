// component/Header/Header.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import OptionMenu from '../OptionMenu/OptionMenu';
import './Header.css';

import menuIcon from '../../pictures/menuIcon.svg';
import backIcon from '../../pictures/backIcon.svg';

function Header({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const isMain = location.pathname === '/main';
  const isSubPage =
    location.pathname === '/main/routine' || location.pathname === '/main/report';

  const getTitle = () => {
    if (location.pathname === '/main/routine') return '일정 / 루틴';
    if (location.pathname === '/main/report') return '통계 리포트';
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
    <div
      className={`header-container ${isMain ? 'header-main' : 'header-sub'}`}
    >
      {isMain && user &&(
        <>
          <img src={user.picture} alt="프로필" className="header-profile" />
          <span className="header-username">{user.name}님!</span>
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

      {isSubPage && (
        <>
          <button
            className="back-button"
            onClick={() => navigate(-1)}
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
