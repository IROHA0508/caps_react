import React from 'react';
import Header from '../../component/Header/Header';
import './MyPage.css';

function MyPage() {
  return (
    <div className="mypage-page">
      <Header />

      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>마이 페이지</p>
      </div>
    </div>
  );
}

export default MyPage;
