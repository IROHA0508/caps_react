// src/pages/HologramPage/HologramPage.js

import React, { useState, useEffect, useRef } from 'react';
import Header from '../../component/Header/Header';
import ChatVoice from '../../component/ChatVoice/ChatVoice';
import './HologramPage.css';

function HologramPage() {
  const [user, setUser] = useState(null);
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const unityContainerRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Unity 인스턴스 정리를 위한 함수
  const cleanupUnity = async () => {
    if (window.unityInstance) {
      try {
        // Unity 렌더링 중지
        if (window.unityInstance.Module) {
          window.unityInstance.Module.StopMainLoop();
        }
        
        // Unity 인스턴스 정리
        await window.unityInstance.Quit();
        
        // WebGL 컨텍스트 정리
        const canvas = unityContainerRef.current;
        if (canvas) {
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            gl.getExtension('WEBGL_lose_context')?.loseContext();
          }
        }

        // Unity 인스턴스 참조 제거
        window.unityInstance = null;
        
        // Unity 컨테이너 정리
        if (unityContainerRef.current) {
          unityContainerRef.current.innerHTML = '';
        }
        
        // Unity 로더 스크립트 제거
        const unityScript = document.querySelector('script[src="/unity/Build/unityLIa.loader.js"]');
        if (unityScript) {
          unityScript.remove();
        }
      } catch (error) {
        console.error('Unity 정리 중 오류:', error);
      }
    }
  };

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
                  if (progress === 1) {
                    console.log('Unity 로딩 완료, isUnityLoaded를 true로 설정');
                    setIsUnityLoaded(true);
                  }
                }
              );
              console.log('Unity 인스턴스 생성 완료:', window.unityInstance);
              setIsUnityLoaded(true); // 인스턴스 생성 직후에도 true로 설정
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

    // 페이지 언마운트 시 정리
    return () => {
      cleanupUnity();
    };
  }, []);

  // 페이지를 떠날 때 정리
  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanupUnity();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/onboarding';
  };

  // Unity로 메시지 전송하는 함수
  const sendMessageToUnity = (functionName, parameter) => {
    if (window.unityInstance && isUnityLoaded) {
      window.unityInstance.SendMessage('Mishe', 'SetEmotion', parameter);
    } else {
      console.warn('Unity is not fully loaded yet');
    }
  };

  // ChatVoice로부터 메시지를 받아 처리하는 함수
  const handleChatMessage = async () => {
    const emotion = localStorage.getItem('lia_emotion');
    if (!emotion) return;

    console.log('handleChatMessage 감정 분석 결과:', emotion);
    console.log('Unity 로딩 상태:', isUnityLoaded);
    console.log('Unity 인스턴스:', window.unityInstance);

    // Unity 인스턴스가 있으면 바로 전송
    if (window.unityInstance) {
      sendMessageToUnity('SetEmotion', emotion);
    } else {
      console.warn('Unity instance not found');
    }
  };

  // localStorage 변경 감지를 위한 useEffect
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'lia_emotion') {
        const emotion = e.newValue;
        if (emotion) {
          console.log('감정 분석 결과:', emotion);
          sendMessageToUnity('SetEmotion', emotion);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="hologram-page">
      <Header user={user} onLogout={handleLogout} />
      <div className="unity-container">
        <canvas 
          ref={unityContainerRef} 
          id="unity-canvas"
          className="unity-canvas"
        />
        <div className="chat-voice-container">
          <ChatVoice onMessage={handleChatMessage} />
        </div>
      </div>
    </div>
  );
}

export default HologramPage;
