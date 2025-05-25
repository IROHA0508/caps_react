// TalkModeSelector.js
import React, { useEffect } from 'react';
import './TalkModeSelector.css';

function TalkModeSelector({ visible, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>어떤 방식으로 이야기할까요?</h3>
        <div className="option" onClick={() => alert("Live 2D 모드 시작")}>
          <p><strong>Live 2D 모드로 이야기하기</strong></p>
          <p>캐릭터가 화면에서 생동감 있게 움직여요!</p>
        </div>
        <div className="option" onClick={() => alert("홀로그램 모드 시작")}>
          <p><strong>홀로그램 모드로 이야기하기</strong></p>
          <p>실제 공간에 나타난 듯한 입체적 대화!</p>
        </div>
      </div>
    </div>
  );
}

export default TalkModeSelector;
