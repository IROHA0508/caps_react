import React, { useEffect, useState } from 'react';
import Picker from 'react-mobile-picker';
import './BottomPicker.css';

function BottomPicker({ options, selected, onSelect, onClose }) {
  const [animate, setAnimate] = useState(false);
  const value = { picker: selected };

  useEffect(() => {
    // 마운트 직후 애니메이션 적용
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  const handleClose = () => {
    // 사라지는 애니메이션 후 닫기
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 300); // CSS transition 시간과 맞춰야 함
  };

  const handleChange = (nextValue) => {
    onSelect(nextValue.picker);
  };

  return (
    <div className="bottom-picker-overlay" onClick={handleClose}>
      <div
        className={`bottom-picker-container ${animate ? 'show' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="picker-header">
          <button className="picker-close-btn" onClick={handleClose}>취소</button>
          <button className="picker-select-btn" onClick={() => onSelect(value.picker)}>선택</button>
        </div>
        <Picker value={value} onChange={handleChange} wheelMode="natural">
          <Picker.Column name="picker">
            {options.map((option) => (
              <Picker.Item key={option} value={option}>
                {({ selected }) => (
                  <div style={{ color: selected ? '#007aff' : '#333', fontWeight: selected ? 'bold' : 'normal' }}>
                    {option}
                  </div>
                )}
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
      </div>
    </div>
  );
}

export default BottomPicker;
