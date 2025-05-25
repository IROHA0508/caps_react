// LiaPage.js
import { useEffect,useState } from 'react';
import { GoogleOAuthProvider} from '@react-oauth/google';

import LogoutButton from '../../component/LogoutButton/LogoutButton';
import TalkModeSelector from '../../component/TalkModeSelector/TalkModeSelector';

import './LiaPage.css';

function LiaPage() {
  const [showTalkOptions, setShowTalkOptions] = useState(false);
  
  // 로그인한 사용자의 정보 가져오기
  const [user, setUser] = useState(null);

  useEffect(() => {
  const interval = setInterval(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, 500); // 0.5초마다 체크

  return () => clearInterval(interval);
}, []);

  return (
    <GoogleOAuthProvider clientId="829026060536-f7dpc16930esthgnn97soleggvmv3o16.apps.googleusercontent.com">
      <div>
        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
          <p>This is LIA page</p>
        </div>

        {user ? (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p>{user.name}님, 환영합니다!</p>
            <img
              src={user.picture}
              alt="프로필"
              style={{ borderRadius: '50%', width: '50px' }}
            />
          
          <LogoutButton onLogout={() => setUser(null)} />

          </div>
        ) : (
          <p>로그인 정보를 불러올 수 없습니다.</p>
        )}

        <div className="button-container">
          <button className="button" onClick={() => setShowTalkOptions(true)}>LIA와 이야기하기</button>
        </div>


        <TalkModeSelector visible={showTalkOptions} onClose={() => setShowTalkOptions(false)} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default LiaPage;
