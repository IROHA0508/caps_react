import React, { useState, useRef, useEffect } from 'react';
import Header from '../../component/Header/Header';
import testgif from '../../pictures/iroha.gif';
import './ReporePage.css';

function ReportPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const handleScroll = () => {
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    slider.addEventListener('scroll', handleScroll);
    return () => slider.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <Header title="통계 리포트" />

      <div className="report-page">
        <div className="report-header">
          <div className="quote-box">
            <div className="quote-img-wrapper">
              <img src={testgif} alt="테스트 gif" className="character-image" />
            </div>
            <div className="quote-text-wrapper">
              <p className="quote">
                한번 실패하는게, 아무것도 안 하는 것보다 성장하는 거야<br />충분히 잘했어!
              </p>
            </div>
          </div>
        </div>

        <div className="report-slider" ref={sliderRef}>
          <div className="card-slide">카드 1</div>
          <div className="card-slide">카드 2</div>
          <div className="card-slide">카드 3</div>
        </div>

        <div className="dot-indicator">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`dot ${currentIndex === i ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
