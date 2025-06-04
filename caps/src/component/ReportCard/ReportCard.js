// src/component/ReportCard/ReportCard.js
import React from 'react';
import './ReportCard.css';

function ReportCard({ date, activities, feedback}) {
  return (
    <div className="report-card">
      <h3 className="card-date">{date}</h3>

      {activities.map((activity, index) => (
        <div className="card-section" key={index}>
          <div className="activity-header">
            <strong>{activity.title}</strong>
            <span>{activity.time}</span>
          </div>
          <p>{activity.comment}</p>
          <span className="activity-icon">{activity.icon}</span>
        </div>
      ))}

      {feedback && (
        <div className="card-section">
          <strong>오늘의 추천 루틴</strong>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default ReportCard;
