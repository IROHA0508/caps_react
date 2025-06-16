import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
import './NicknamePage.css';

function NicknamePage() {
  const inputRef = useRef();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(() => {
    try {
      const stored = localStorage.getItem('node_serverUser_nickname');
      return stored ? JSON.parse(stored) : '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    localStorage.setItem('node_serverUser_nickname', JSON.stringify(nickname));
    navigate(-1);
  };

  return (
    <div className="nickname-page">
      <Header />
      <div className="nickname-label">닉네임</div>

      <div className="nickname-content">
        <div className="nickname-box">
          <input
            ref={inputRef}
            className="nickname-input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
          />
        </div>
        <div className="button-group">
          <button onClick={handleCancel}>취소</button>
          <button onClick={handleSubmit}>완료</button>
        </div>
      </div>
    </div>
  );
}

export default NicknamePage;
