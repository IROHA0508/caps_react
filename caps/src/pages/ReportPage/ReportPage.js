// src/pages/ReportPage.js
import React, { useState, useRef, useEffect } from 'react';
import Header from '../../component/Header/Header';
import testgif from '../../pictures/iroha.gif';
import ReportCard from '../../component/ReportCard/ReportCard';

import './ReportPage.css';

function ReportPage() {
  const [isGifLoaded, setIsGifLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const touchStartX = useRef(null);
  const [healthReports, setHealthReports] = useState([]);

  const MIN_CARDS = 3;
  const paddedReports = [
    ...healthReports,
    ...Array(Math.max(0, MIN_CARDS - healthReports.length)).fill({
      date: '',
      activities: [],
      feedback: '',
    }),
  ];

  useEffect(() => {
    const feedback = localStorage.getItem("today_feedback");
    if (feedback) {
      const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      });

      setHealthReports([
        {
          date: today,
          activities: [],
          feedback: feedback,
        }
      ]);
    }
  }, []);


  const scrollToCard = (index) => {
    const slider = sliderRef.current;
    const card = slider?.children[index];
    if (slider && card) {
      const left = card.offsetLeft - slider.offsetLeft - (slider.offsetWidth - card.offsetWidth) / 2;
      slider.scrollTo({ left, behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;

    if (Math.abs(diff) > 50) {
      if (diff < 0 && currentIndex < paddedReports.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diff > 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        scrollToCard(currentIndex); // 스냅백
      }
    } else {
      scrollToCard(currentIndex); // 스냅백
    }
  };

  useEffect(() => {
    scrollToCard(currentIndex);
  }, [currentIndex, isGifLoaded]);

  return (
    <div>
      <Header title="통계 리포트" />
      <div className="report-page" style={{ visibility: isGifLoaded ? 'visible' : 'hidden' }}>
        <div className="report-header">
          <div className="quote-box">
            <div className="quote-text-wrapper">
              <p className="quote">한번 실패하는게, 아무것도 안 하는 것보다 성장하는 거야<br />충분히 잘했어!</p>
            </div>
            <div className="quote-img-wrapper">
              <img src={testgif} alt="테스트 gif" className="character-image" onLoad={() => setIsGifLoaded(true)} />
            </div>
          </div>
        </div>

        <div
          className="report-slider"
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {paddedReports.map((data, i) => (
            <div key={i} className="report-card-wrapper">
              <ReportCard {...data} />
            </div>
          ))}
        </div>

        <div className="dot-indicator">
          {paddedReports.map((_, i) => (
            <span key={i} className={`dot ${currentIndex === i ? 'active' : ''}`} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default ReportPage;

