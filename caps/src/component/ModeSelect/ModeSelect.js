// src/components/ChatVoice/ModeSelect.js
import React from 'react';
import './ModeSelect.css';

function ModeSelect({ onSelect }) {
  return (
    <div className="mode-select">
      {[1, 2, 3].map(n => (
        <button
          key={n}
          className="mode-button"
          onClick={() => onSelect(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default ModeSelect;
