import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
import BottomPicker from '../../component/BottomPicker/BottomPicker';
import './MyPage.css';

function MyPage() {
  const [user, setUser] = useState(null);
  const [gender, setGender] = useState('-');
  const [age, setAge] = useState('-');

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState(null);
  const navigate = useNavigate();

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const storedNickname = JSON.parse(localStorage.getItem('node_serverUser_nickname'));
    const storedGender = JSON.parse(localStorage.getItem('node_serverUser_gender'));
    const storedAge = JSON.parse(localStorage.getItem('node_serverUser_age'));

    if (userData) {
      setUser({
        // ✅ nickname이 있으면 그것을 name으로 사용
        name: storedNickname || userData.name,
        profileImage: userData.picture,
      });
    }

    // ✅ 성별, 나이도 localStorage에 있으면 사용
    if (storedGender) setGender(storedGender);
    if (storedAge) setAge(storedAge);
  }, []);


  // ✅ Picker 렌더 타이밍 문제 해결용 함수
  const openPicker = (type) => {
    setPickerType(type);
    setTimeout(() => setPickerVisible(true), 0);
  };

  // ✅ 선택 가능한 항목 정의
  const pickerOptions = useMemo(() => {
    if (pickerType === 'gender') return ['님성', '여성', '둘 다 아님'];
    if (pickerType === 'age') return Array.from({ length: 100 }, (_, i) => `${i + 1}`);
    return [];
  }, [pickerType]);

  // ✅ 선택된 항목
  const pickerSelected = useMemo(() => {
    return pickerType === 'gender' ? gender : age;
  }, [pickerType, gender, age]);

  // ✅ 선택 완료 시 처리
  const handleSelect = (value) => {
    if (pickerType === 'gender') setGender(value);
    else if (pickerType === 'age') setAge(value);
    setPickerVisible(false);
  };

  // ✅ 디버깅 로그 (선택)
  useEffect(() => {
    console.log('🛠️ [DEBUG] pickerType changed →', pickerType);
    console.log('📦 [DEBUG] Picker Options:', pickerOptions);
    console.log('📍 [DEBUG] Picker Selected:', pickerSelected);
  }, [pickerType, pickerOptions, pickerSelected]);

  if (!user) return <div>로딩 중...</div>;

  return (
    <div className="mypage-page">
      <Header />
      <div className="mypage-container">
        {/* 프로필 */}
        <div className="profile-image-wrapper">
          <div
            className="profile-image"
            style={{ backgroundImage: `url(${user.profileImage})` }}
          >
            {!user.profileImage && <span>{user.name?.slice(-2)}</span>}
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="info-wrapper">
          <div className="info-row" onClick={() => navigate('/main/mypage/nickname')}>
            <span className="info-label">닉네임</span>
            <span className="info-value clickable">{user.name}</span>
          </div>

          <div className="info-row" onClick={() => openPicker('gender')}>
            <span className="info-label">성별</span>
            <span className="info-value clickable">{gender}</span>
          </div>

          <div className="info-row" onClick={() => openPicker('age')}>
            <span className="info-label">나이</span>
            <span className="info-value clickable">{age}</span>
          </div>
        </div>
      </div>

      {/* Picker가 표시될 때만 렌더링 */}
      {pickerVisible && pickerOptions.length > 0 && (
        <BottomPicker
          options={pickerOptions}
          selected={pickerSelected}
          onSelect={handleSelect}
          onClose={() => setPickerVisible(false)}
        />
      )}
    </div>
  );
}

export default MyPage;
