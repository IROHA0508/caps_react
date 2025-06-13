// src/pages/ReportPage.js
import React, { useState, useRef, useEffect, useMemo} from 'react';
import dayjs from 'dayjs';
import Header from '../../component/Header/Header';
import ReportCard from '../../component/ReportCard/ReportCard';

import JMLP1 from '../../pictures/JMLP1.png'
import JMLP2 from '../../pictures/JMLP2.png'
import JMLP3 from '../../pictures/JMLP3.png'
import JMLP4 from '../../pictures/JMLP4.png'

import './ReportPage.css';
function ReportPage() {
  const nodeServerUrl = process.env.REACT_APP_IP_PORT;
  const nodeServerToken = localStorage.getItem('server_jwt_token');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reports, setReports] = useState([]);
  const sliderRef = useRef(null);
  const touchStartX = useRef(null);

  // JSON 다운로드 함수
  // const downloadJSON = (data) => {
  //   const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'reports.json';
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };

  // 2) GET 요청으로 /reports 호출
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch(`https://${nodeServerUrl}/reports`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${nodeServerToken}`
          }
        });
        if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`);
        // const data = await res.json();
        // setReports(data);
        // 4) 받은 JSON 자동 다운로드
        // downloadJSON(data);

        const json = await res.json();
        setReports(json.data.reports);
      } catch (err) {
        console.error(err);
      }
    }
    fetchReports();
  }, [nodeServerUrl, nodeServerToken]);


  
  // 랜덤 이미지 로직
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageList = useMemo(
    () => [JMLP1, JMLP2, JMLP3, JMLP4],
    []
  );
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * imageList.length);
    setSelectedImage(imageList[idx]);
  }, [imageList]);

  // 카드 central scroll
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
      if (diff < 0 && currentIndex < reports.length - 1) {
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
  }, [currentIndex, isImageLoaded, reports]);

  return (
    <div>
      <Header title="통계 리포트" />
      <div className="report-page">
        <div className="report-header">
          <div className="quote-box">
            <div className="quote-text-wrapper">
              <p className="quote">
                한번 실패하는게, 아무것도 안 하는 것보다 성장하는 거야<br />충분히 잘했어!
              </p>
            </div>
              <div className="quote-img-wrapper">
                <img
                  src={selectedImage}
                  alt="통계 리포트 이미지"
                  className="character-image"
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>
          </div>
        </div>

        {/* 3) report 수에 따라 카드 자동 생성 */}
        <div
          className="report-slider"
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {reports.map((report, i) => (
            <div key={i} className="report-card-wrapper">
              <ReportCard
                date={dayjs(report.created_at).format('YYYY-MM-DD')}
                order={i + 1}
                routineName={report.recommended_routine}
                duration={`${report.duration}분`}
                reason={report.reason}
                success={report.success}
                feedback={report.feedback}
              />
            </div>
          ))}
        </div>

        <div className="dot-indicator">
          {reports.map((_, i) => (
            <span key={i} className={`dot ${currentIndex === i ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportPage;