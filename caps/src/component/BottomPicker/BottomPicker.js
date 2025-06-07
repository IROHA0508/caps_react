// component/BottomPicker/BottomPicker.js
import React from 'react';
import Picker  from 'react-mobile-picker';
import './BottomPicker.css';

function BottomPicker({ options, selected, onSelect, onClose }) {
  console.log('📥 [BottomPicker] props.options:', options);
  console.log('📥 [BottomPicker] props.selected:', selected);


  const value = { picker: selected }

  const handleChange = (nextValue) => {
    console.log('🔄 [BottomPicker] 선택 변경 →', nextValue)
    onSelect(nextValue.picker)
  }
  
  return (
    <div className="bottom-picker-overlay" onClick={onClose}>
      <div className="bottom-picker-container" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <button className="picker-close-btn" onClick={onClose}>취소</button>
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
  )
}

export default BottomPicker;
