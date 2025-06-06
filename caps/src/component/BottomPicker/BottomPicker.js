import React, { useEffect, useState } from 'react';
import './BottomPicker.css';

function BottomPicker({ options, selected, onSelect, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // 부모 상태에서 picker 제거
    }, 300); // 애니메이션 시간과 동일
  };

  return (
    <div className="picker-overlay" onClick={handleClose}>
      <div
        className={`picker-container ${isClosing ? 'slide-down' : 'slide-up'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="picker-header">
          <button onClick={handleClose}>취소</button>
          <button onClick={() => onSelect(selected)}>확인</button>
        </div>

        <div className="picker-wheel-wrapper">
          <div className="picker-highlight" />
          <ul className="picker-list">
            {options.map((item) => (
              <li
                key={item}
                className={`picker-item ${item === selected ? 'selected' : ''}`}
                onClick={() => onSelect(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BottomPicker;
