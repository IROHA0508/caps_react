// src/pages/ReportPage.js
import React, { useState, useRef, useEffect } from 'react';
import Header from '../../component/Header/Header';
import testgif from '../../pictures/iroha.gif';
import ReportCard from '../../component/ReportCard/ReportCard';

import JMLP1 from '../../pictures/JMLP1.png'
import JMLP2 from '../../pictures/JMLP2.png'
import JMLP3 from '../../pictures/JMLP3.png'
import JMLP4 from '../../pictures/JMLP4.png'

import './ReportPage.css';
function ReportPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [healthReports, setHealthReports] = useState([]);
  const sliderRef = useRef(null);
  const touchStartX = useRef(null);

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
    const feedback = localStorage.getItem('today_feedback');
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
          feedback,
        },
      ]);
    }
  }, []);

  // 랜덤 이미지 로직
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageList = [JMLP1, JMLP2, JMLP3, JMLP4];
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * imageList.length);
    setSelectedImage(imageList[idx]);
  }, []);

  const scrollToCard = (index) => {
    const slider = sliderRef.current;
    const card = slider?.children[index];
    if (slider && card) {
      const left =
        card.offsetLeft -
        slider.offsetLeft -
        (slider.offsetWidth - card.offsetWidth) / 2;
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
        scrollToCard(currentIndex);
      }
    } else {
      scrollToCard(currentIndex);
    }
  };

  useEffect(() => {
    scrollToCard(currentIndex);
  }, [currentIndex, isImageLoaded]);

  return (
    <div>
      <Header title="통계 리포트" />
      <div
        className="report-page"
        style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }}
      >
        <div className="report-header">
          <div className="quote-box">
            <div className="quote-text-wrapper">
              <p className="quote">
                한번 실패하는게, 아무것도 안 하는 것보다 성장하는 거야<br />충분히
                잘했어!
              </p>
            </div>
            <div className="quote-img-wrapper">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="통계 리포트 캐릭터"
                  className="character-image"
                  onLoad={() => setIsImageLoaded(true)}
                />
              )}
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
