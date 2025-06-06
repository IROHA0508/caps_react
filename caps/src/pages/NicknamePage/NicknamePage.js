// NicknamePage.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';

function NicknamePage() {
  const inputRef = useRef();
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 자동 포커스
    inputRef.current.focus();
  }, []);

  const handleSubmit = () => {
    // 로컬 또는 서버 저장 로직 추가 가능
    localStorage.setItem('nickname', nickname);
    navigate(-1); // 이전 페이지로
  };

  return (
    <div className="nickname-page">
      <Header />
      <h2>닉네임</h2>
      <input
        ref={inputRef}
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임 입력"
      />
      <div className="button-group">
        <button onClick={() => navigate(-1)}>취소</button>
        <button onClick={handleSubmit}>완료</button>
      </div>
    </div>
  );
}

export default NicknamePage;
