import { useState } from 'react';
import OptionMenu from '../OptionMenu/OptionMenu';
import menu_dot from '../../pictures/menu_dots.svg';
import './Header.css';

function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = () => {
    setMenuOpen((prev) => {
      if (!prev) setSelectedMenu(null); // 열 때만 초기화
      return !prev;
    });
  };

  const handleMenuSelect = (item) => {
    setSelectedMenu(item); // 'routine' or 'report'만 처리
    setMenuOpen(false);
  };

  return (
    <div className="header-container">
      <img
        src={user.picture}
        alt="프로필"
        className="header-profile"
      />
      <span className="header-username">{user.name}님!</span>
      <img
        src={menu_dot}
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
    </div>
  );
}

export default Header;
