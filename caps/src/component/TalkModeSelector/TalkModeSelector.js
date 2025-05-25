import React, { useEffect, useState } from 'react';
import './TalkModeSelector.css';
import talkmode1 from '../../pictures/talkmode_1.svg';
import talkmode2 from '../../pictures/talkmode_2.svg';

function TalkModeSelector({ visible, onClose }) {
  const [show, setShow] = useState(visible);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      // 닫힐 때 애니메이션 후 숨김
      setAnimatingOut(true);
      setTimeout(() => {
        setShow(false);
        setAnimatingOut(false);
      }, 300); // 애니메이션 시간과 일치
    }
  }, [visible]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className={`bottom-sheet ${animatingOut ? 'slide-down' : 'slide-up'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="sheet-title">어떤 방식으로 이야기할까요?</h3>

        <div className="option" onClick={() => alert("Live 2D 모드 시작")}>
          <img src={talkmode1} alt="Live2D" className="option-icon" />
          <div className="option-text">
            <p className="option-title">Live 2D 모드로 이야기하기</p>
            <p className="option-subtext1">캐릭터가 화면에서 생동감 있게 움직여요!</p>
          </div>
        </div>

        <hr className="divider" />

        <div className="option" onClick={() => alert("홀로그램 모드 시작")}>
          <img src={talkmode2} alt="홀로그램" className="option-icon" />
          <div className="option-text">
            <p className="option-title">홀로그램 모드로 이야기하기</p>
            <p className="option-subtext2">
              실제 공간에 나타난 듯한 입체적 대화!<br />
              하드웨어 위에 휴대폰을 올려서 사용해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TalkModeSelector;
