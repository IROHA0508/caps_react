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

  const dummyData = [
    {
      date: '2025.05.25 (일)',
      activities: [
        { title: '산책', time: '5분', comment: '조금씩이라도 밖에 나가보는 건 기분 전환에 좋아!', icon: '✔️' },
        { title: '토익 공부', time: '1시간 30분', comment: '평소보다 긴 시간 공부하려고 노력했어!', icon: '✔️' },
      ],
      feedback:
        '오전엔 잠시 기분이 안좋았지만 산책 후에 많이 나아졌어. 오늘은 오랫동안 집중하려고 노력했어! 처음엔 잘 안될 수 있지만, 시작한 것만으로도 이미 많이 성장한거야.',
    },
    {
      date: '2025.05.26 (월)',
      activities: [
        { title: '운동', time: '20분', comment: '꾸준한 루틴이 쌓이고 있어!', icon: '💪' },
      ],
      feedback: '월요일이지만 잘 해냈어. 흐름을 계속 이어가자.',
    },
    {
      date: '2025.05.27 (화)',
      activities: [],
      feedback: '피곤했지만 일정을 지키려고 한 점이 멋졌어!',
    },
  ];

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
      if (diff < 0 && currentIndex < dummyData.length - 1) {
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
          {dummyData.map((data, i) => (
            <div key={i} className="report-card-wrapper">
              <ReportCard {...data} />
            </div>
          ))}
        </div>

        <div className="dot-indicator">
          {dummyData.map((_, i) => (
            <span key={i} className={`dot ${currentIndex === i ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportPage;

