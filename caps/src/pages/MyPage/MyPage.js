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
    const storedRawGender = JSON.parse(localStorage.getItem('node_serverUser_gender'));
    const storedAge = JSON.parse(localStorage.getItem('node_serverUser_age'));

    if (userData) {
      setUser({
        name: storedNickname || userData.name,
        profileImage: userData.picture,
      });
    }

    if (storedRawGender) {
      const storedGender =
        storedRawGender === 'male' ? '남성'
        : storedRawGender === 'female' ? '여성'
        : storedRawGender;
      setGender(storedGender);
    }

    if (storedAge) {
      setAge(storedAge);
    }
  }, []);
  
  // ✅ Picker 렌더 타이밍 문제 해결용 함수
  const openPicker = (type) => {
    setPickerType(type);
    setTimeout(() => setPickerVisible(true), 0);
  };

  // ✅ 선택 가능한 항목 정의
  const pickerOptions = useMemo(() => {
    if (pickerType === 'gender') return ['남성', '여성', '둘 다 아님'];
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

  // ✅ 서버에 사용자 정보 저장
  const handleApply = async () => {
    const token = localStorage.getItem('server_jwt_token');
    if (!token) {
      alert('서버 인증 토큰이 없습니다.');
      return;
    }

    const payload = {
      nickname: user.name,
      gender:
        gender === '남성' ? 'male'
        : gender === '여성' ? 'female'
        : gender === '-' ? null
        : gender,
      age: age === '-' ? null : parseInt(age),
    };


    try {
      const res = await fetch(`https://${process.env.REACT_APP_IP_PORT}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error('❌ 사용자 정보 저장 실패:', res.status);
        alert('서버 전송 실패');
        return;
      }

      const result = await res.json();
      console.log('✅ 사용자 정보 저장 성공:', result);
      alert('변경 내용이 저장되었습니다');

      // 저장 후 localStorage에도 반영
      localStorage.setItem('node_serverUser_nickname', JSON.stringify(payload.nickname));
      localStorage.setItem('node_serverUser_gender', JSON.stringify(payload.gender));
      localStorage.setItem('node_serverUser_age', JSON.stringify(payload.age));
    } catch (error) {
      console.error('❌ 서버 요청 오류:', error);
      alert('요청 중 오류가 발생했습니다.');
    }
  };

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

        {/* ✅ 저장하기 버튼 */}
        <div className="apply-button-wrapper">
          <button className="button apply-button" onClick={handleApply}>
            저장하기
          </button>
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
