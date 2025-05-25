// GoogleLoginButton.js
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const [userInfo, setUserInfo] = useState(null);

  const serverIP = process.env.REACT_APP_IP_PORT;
  console.log(process.env.REACT_APP_IP_PORT);
  
  return (
    <div className="button-container">
      {!userInfo ? (
        <GoogleLogin
          useOneTap={false}
          onSuccess={async (credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            setUserInfo(decoded);
            // alert('로그인 성공');
            console.log('로그인 성공:', decoded);

            try {
              const res = await fetch(`http://${serverIP}:3000/users/google`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  credential: credentialResponse.credential,
                }),
              });

              const result = await res.json();
              console.log('✅ 서버 응답:', result);

              const token = result?.data?.token;
              if (token) {
                console.log('✅ JWT 토큰:', token);
                // 필요 시 localStorage 등에 저장

                localStorage.setItem('user', JSON.stringify(decoded));
                if (onLoginSuccess) onLoginSuccess(decoded); // 또는 그냥 onLoginSuccess();
              } else {
                console.warn('⚠️ 서버 응답에 토큰이 없습니다.');
              }
            } catch (error) {
              alert('사용자 정보 전송 실패');
              console.error('❌ 사용자 정보 전송 실패:', error);
            }
          }}
        />
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>환영합니다, {userInfo.name}님!</strong></p>
          <img src={userInfo.picture} alt="프로필" style={{ borderRadius: '50%', width: '50px' }} />
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
