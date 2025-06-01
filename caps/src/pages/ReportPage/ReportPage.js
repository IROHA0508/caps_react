// ReportPage.js
import React from 'react';
import Header from '../../component/Header/Header';
import testgif from '../../pictures/iroha.gif';

function ReportPage() {
  return (
    <div>
      <Header title="통계 리포트" />

      <div className="report-page">
        {/* 상단 타이틀 및 캐릭터 영역 */}
        <div className="report-header">
          <button className="back-button">←</button>
          <h2>통계 리포트</h2>
          <div className="quote-box">
            <img src={testgif} alt="테스트 gif" className="character-image" />
            <p className="quote">한번 실패하는게, 아무것도 안 하는 것보다 성장하는 거야<br />충분히 잘했어!</p>
          </div>
        </div>

        {/* 슬라이드 카드 영역 */}
        <div className="report-slider">
          <div className="card-slide">카드 1</div>
          <div className="card-slide">카드 2</div>
          <div className="card-slide">카드 3</div>
        </div>
      </div>

    </div>
  );
}

export default ReportPage;

