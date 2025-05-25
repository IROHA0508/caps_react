// component/OptionMenu/OptionMenu.js
import React from 'react';
import './OptionMenu.css';

import report_button from '../../pictures/report_button.svg';
import routine_button from '../../pictures/routine_button.svg';
import logout_button from '../../pictures/logout_button.svg';

import report_button_select from '../../pictures/report_button_select.svg';
import routine_button_select from '../../pictures/routine_button_select.svg';
import logout_button_select from '../../pictures/logout_button_select.svg';

function OptionMenu({ visible, selectedMenu, onSelect, onClose }) {
  if (!visible) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
        <div
          className="menu-item"
          onClick={() => onSelect('routine')}
        >
          <img
            src={selectedMenu === 'routine' ? routine_button_select : routine_button}
            alt="루틴"
          />
          <span style={{ color: selectedMenu === 'routine' ? '#000000' : '#83858A' }}>
            일정/루틴 보기
          </span>
        </div>

        <div
          className="menu-item"
          onClick={() => onSelect('report')}
        >
          <img
            src={selectedMenu === 'report' ? report_button_select : report_button}
            alt="리포트"
          />
          <span style={{ color: selectedMenu === 'report' ? '#000000' : '#83858A' }}>
            통계 리포트
          </span>
        </div>

        <div
          className="menu-item"
          onClick={() => onSelect('logout')}
        >
          <img
            src={selectedMenu === 'logout' ? logout_button_select : logout_button}
            alt="로그아웃"
          />
          <span style={{ color: selectedMenu === 'logout' ? '#000000' : '#83858A' }}>
            로그아웃
          </span>
        </div>
      </div>
    </div>
  );
}

export default OptionMenu;
