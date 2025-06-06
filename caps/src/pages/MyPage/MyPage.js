import React, { useEffect, useState } from 'react';
import Header from '../../component/Header/Header';
import { useNavigate } from 'react-router-dom';
import BottomPicker from '../../component/BottomPicker/BottomPicker'; // 드롭업 Picker 컴포넌트
import './MyPage.css';

function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gender, setGender] = useState('-');
  const [age, setAge] = useState('-');

  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showAgePicker, setShowAgePicker] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser({
        name: userData.name,
        profileImage: userData.picture,
      });
    }
  }, []);

  if (!user) return <div>로딩 중...</div>;

  return (
    <div className="mypage-page">
      <Header />
      <div className="mypage-container">
        {/* 프로필 이미지 */}
        <div className="profile-image-wrapper">
          <div
            className="profile-image"
            style={{ backgroundImage: `url(${user.profileImage})` }}
          >
            {!user.profileImage && (
              <span className="profile-placeholder">
                {user.name?.slice(-2)}
              </span>
            )}
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="info-wrapper">
          {/* 닉네임 클릭 시 /nickname 이동 */}
          <div className="info-row" onClick={() => navigate('/main/mypage/nickname')}>
            <span className="info-label">닉네임</span>
            <span className="info-value clickable">{user.name}</span>
          </div>

          {/* 성별 선택 */}
          <div className="info-row" onClick={() => setShowGenderPicker(true)}>
            <span className="info-label">성별</span>
            <span className="info-value clickable">{gender}</span>
          </div>

          {/* 나이 선택 */}
          <div className="info-row" onClick={() => setShowAgePicker(true)}>
            <span className="info-label">나이</span>
            <span className="info-value clickable">{age}</span>
          </div>

        </div>
      </div>

      {/* 성별 드롭업 */}
      {showGenderPicker && (
        <BottomPicker
          options={['여성', '남성', '둘 다 아님']}
          selected={gender}
          onSelect={(val) => {
            setGender(val);
            setShowGenderPicker(false);
          }}
          onClose={() => setShowGenderPicker(false)}
        />
      )}

      {/* 나이 드롭업 */}
      {showAgePicker && (
        <BottomPicker
          options={Array.from({ length: 100 }, (_, i) => `${i + 1}`)}
          selected={age}
          onSelect={(val) => {
            setAge(val);
            setShowAgePicker(false);
          }}
          onClose={() => setShowAgePicker(false)}
        />
      )}
    </div>
  );
}

export default MyPage;
