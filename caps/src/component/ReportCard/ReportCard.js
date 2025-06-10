// src/component/ReportCard/ReportCard.js
import React from 'react';
import './ReportCard.css';

function ReportCard({ date, order, routineName, reason, success, feedback }) {
  return (
    <div className="report-card">
      {/* 1. 날짜 */}
      <div className="card-date">{date}</div>

      {/* 2. 추천 루틴 + 이유 */}
      <div className="card-section routine-section">
        <strong className="routine-title">
          추천 루틴 {order} : {routineName}
        </strong>
        <p className="routine-reason">{reason}</p>
      </div>

      {/* 3. 성공 여부 + 캐릭터 피드백 */}
      <div className="card-section result-section">
        <div className="result-header">
          <strong>루틴 성공 여부</strong>
          <span className="result-icon">{success ? '✓' : '✕'}</span>
        </div>
        <p className="feedback-text">{feedback}</p>
      </div>
    </div>
  );
}

export default ReportCard;
