// src/pages/HologramPage/HologramPage.js

import React, { useState, useEffect, useRef } from 'react';
import Header from '../../component/Header/Header';
import './HologramPage.css';

function HologramPage() {
  const [user, setUser] = useState(null);
  const unityContainerRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const loadUnity = async () => {
      try {
        // Unity WebGL 로더 스크립트 로드
        const script = document.createElement('script');
        script.src = '/unity/Build/unityLIa.loader.js';
        script.async = true;
        
        script.onload = async () => {
          if (unityContainerRef.current) {
            try {
              // Unity 인스턴스 생성
              window.unityInstance = await window.createUnityInstance(
                unityContainerRef.current,
                {
                  dataUrl: '/unity/Build/unityLIa.data',
                  frameworkUrl: '/unity/Build/unityLIa.framework.js',
                  codeUrl: '/unity/Build/unityLIa.wasm',
                  streamingAssetsUrl: 'StreamingAssets',
                  companyName: 'DefaultCompany',
                  productName: 'Unity WebGL',
                  productVersion: '1.0',
                  webglContextAttributes: {
                    preserveDrawingBuffer: true,
                    powerPreference: 'high-performance'
                  }
                },
                (progress) => {
                  // 로딩 진행률 표시
                  console.log(`Unity 로딩 진행률: ${progress * 100}%`);
                }
              );
            } catch (error) {
              console.error('Unity 인스턴스 생성 중 오류:', error);
            }
          }
        };

        script.onerror = (error) => {
          console.error('Unity 로더 스크립트 로드 실패:', error);
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error('Unity 로드 중 오류 발생:', error);
      }
    };

    loadUnity();

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (window.unityInstance) {
        window.unityInstance.Quit();
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/onboarding';
  };

  // Unity로 메시지 전송하는 함수
  const sendMessageToUnity = (functionName, parameter) => {
    if (window.unityInstance) {
      window.unityInstance.SendMessage('GameManager', functionName, parameter);
    }
  };

  // anger 메시지 전송
  const sendAngerMessage = () => {
    sendMessageToUnity('anger', '');
  };

  return (
    <div className="hologram-page">
      <Header user={user} onLogout={handleLogout} />
      <div className="unity-container">
        <canvas 
          ref={unityContainerRef} 
          id="unity-canvas"
          className="unity-canvas"
        />
        <button 
          onClick={sendAngerMessage}
          className="unity-button"
        >
          anger 메시지 전송
        </button>
      </div>
    </div>
  );
}

export default HologramPage;
