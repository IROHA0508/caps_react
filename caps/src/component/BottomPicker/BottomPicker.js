import React, { useEffect, useState } from 'react';
import Picker from 'react-mobile-picker';
import './BottomPicker.css';

function BottomPicker({ options, selected, onSelect, onClose }) {
  const [animate, setAnimate] = useState(false);
  const [currentValue, setCurrentValue] = useState({ picker: selected });

  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    onSelect(currentValue.picker); // ✅ 확인 버튼 눌렀을 때만 선택값 전달
    handleClose();
  };

  const handleChange = (nextValue) => {
    setCurrentValue(nextValue); // ✅ 상태만 변경, 자동 선택 없음
  };

  return (
    <div className="bottom-picker-overlay" onClick={handleClose}>
      <div
        className={`bottom-picker-container ${animate ? 'show' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="picker-header">
          <button className="picker-close-btn" onClick={handleClose}>취소</button>
          <button className="picker-select-btn" onClick={handleConfirm}>선택</button>
        </div>
        <Picker value={currentValue} onChange={handleChange} wheelMode="natural">
          <Picker.Column name="picker">
            {options.map((option) => (
              <Picker.Item key={option} value={option}>
                {({ selected }) => (
                  <div
                    style={{
                      color: selected ? '#007aff' : '#333',
                      fontWeight: selected ? 'bold' : 'normal',
                    }}
                  >
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
