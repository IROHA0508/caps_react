// component/OptionMenu/OptionMenu.js
import React, { useEffect, useState } from 'react';
import './OptionMenu.css';
import { useNavigate } from 'react-router-dom';

import report_button from '../../pictures/report_button.svg';
import routine_button from '../../pictures/routine_button.svg';
import logout_button from '../../pictures/logout_button.svg';

import mypage_button from '../../pictures/mypage_button.svg';

import report_button_select from '../../pictures/report_button_select.svg';
import routine_button_select from '../../pictures/routine_button_select.svg';
import logout_button_select from '../../pictures/logout_button_select.svg';

import mypage_button_select from '../../pictures/mypage_button.svg';

import { openAuthPopup } from '../GoogleCalendarConnectButton/GoogleCalendarConnectButton';


function OptionMenu({ visible, selectedMenu, onSelect, onClose, onLogout }) {
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const paths = [
      routine_button,
      report_button,
      mypage_button,
      logout_button,
      routine_button_select,
      report_button_select,
      mypage_button_select,
      logout_button_select
    ];

    let loaded = 0;

    paths.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === paths.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []); // ✅ 빈 배열로 유지


  if (!visible || !imagesLoaded) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>

        <button className="menu-item" onClick={() => {
          onSelect('routine'); // 클릭 시 선택 상태 갱신
          onClose();
          openAuthPopup(() => navigate('/main/routine'));
        }}>
          <img
            src={selectedMenu === 'routine' ? routine_button_select : routine_button}
            alt="루틴"
          />
          <span style={{ color: selectedMenu === 'routine' ? '#000000' : '#83858A' }}>
            일정/루틴 보기
          </span>
        </button>

        <button className="menu-item" onClick={() => {
          onSelect('report');
          navigate('/main/report');
          onClose();
        }}>
          <img
            src={selectedMenu === 'report' ? report_button_select : report_button}
            alt="리포트"
          />
          <span style={{ color: selectedMenu === 'report' ? '#000000' : '#83858A' }}>
            통계 리포트
          </span>
        </button>


        <button className="menu-item" onClick={() => {
          onSelect('mypage');
          navigate('/main/mypage');
          onClose();
        }}>
          <img
            src={selectedMenu === 'report' ? mypage_button_select : mypage_button}
            alt="마이페이지"
          />
          <span style={{ color: selectedMenu === 'report' ? '#000000' : '#83858A' }}>
            마이페이지
          </span>
        </button>


        <button className="menu-item" onClick={() => {
          onSelect('logout');
          onLogout();
          onClose();
        }}>
          <img
            src={selectedMenu === 'logout' ? logout_button_select : logout_button}
            alt="로그아웃"
          />
          <span style={{ color: selectedMenu === 'logout' ? '#000000' : '#83858A' }}>
            로그아웃
          </span>
        </button>

      </div>
    </div>
  );
}

export default OptionMenu;
