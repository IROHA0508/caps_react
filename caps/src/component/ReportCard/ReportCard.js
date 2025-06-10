// src/component/ReportCard/ReportCard.js
import React from 'react';
import './ReportCard.css';

function ReportCard({ date, order, routineName, duration, reason, success, feedback }) {
  return (
    <div className="report-card">
      {/* 1. 날짜 */}
      <div className="card-date">{date}</div>

      {/* 2. 추천 루틴 + 시간 + 이유 */}
      <div className="card-section routine-section">
        <div className="routine-header">
          <strong className="routine-title">
            리아추천 루틴 {order} : {routineName}
          </strong>
          <span className="routine-duration">{duration}</span>
        </div>
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
