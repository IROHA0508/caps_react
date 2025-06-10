// src/components/ChatVoice/ChatVoice.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatVoice.css';
import ModeSelect from '../ModeSelect/ModeSelect.js';          // ★ 추가
import '../ModeSelect/ModeSelect.css';

// 마크다운 제거
function stripMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

function ChatVoice() {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content }

  // 메시지 추가
  const addMessage = useCallback((role, content) => {
    setMessages(msgs => [...msgs, { role, content }]);
  }, []);

  // 음성 인식 중단
  const stopRecognition = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  // GPT 호출 (history 포함)
  const sendToGpt = useCallback(async (userMsg) => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat`, {
    // const res = await fetch(`http://localhost:5000/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: messages,
        message: userMsg
      })
    });
    const { reply } = await res.json();
    return reply;
  }, [messages]);

  // TTS 재생 (중간 끊기 감지 + 인식 재시작)
  const speak = useCallback((rawText, onEnd) => {
    stopRecognition();
    window.speechSynthesis.cancel();

    const cleanText = stripMarkdown(rawText);
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'ko-KR';
    utter.onend = onEnd;
    window.speechSynthesis.speak(utter);

    // VAD 설정
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const VAD_THRESHOLD = 35;

      function detect() {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let v of data) sum += (v - 128) ** 2;
        const rms = Math.sqrt(sum / data.length);

        if (rms > VAD_THRESHOLD) {
          window.speechSynthesis.cancel();
          audioCtx.close();
          onEnd();
        } else if (window.speechSynthesis.speaking) {
          requestAnimationFrame(detect);
        } else {
          audioCtx.close();
        }
      }

      detect();
    });
  }, [stopRecognition]);

  // 음성 인식 시작
  const startRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    const rec = new SR();
    rec.lang = 'ko-KR';
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 7;

    rec.onstart = () => setIsListening(true);
    rec.onend   = () => setIsListening(false);
    rec.onerror = (e) => {
      console.error('Recognition error:', e.error);
      setIsListening(false);
    };

    rec.onresult = async (e) => {
      const last = e.results[e.results.length - 1];
      if (!last.isFinal) return;

      const alts = Array.from(last).sort((a, b) => b.confidence - a.confidence);
      const best = alts[0];
      const text = best.transcript.trim();
      if (best.confidence < 0.85 || text.length < 3) return;

      rec.stop();
      addMessage('user', text);
      const reply = await sendToGpt(text);
      addMessage('assistant', reply);
      speak(reply, startRecognition);
    };

    recognitionRef.current = rec;
    rec.start();
  }, [addMessage, sendToGpt, speak]);

  // 대화 종료 시 서버에 로그 전송
  const endConversation = useCallback(async () => {
    try {
      const node_serverToken = localStorage.getItem("server_jwt_token");
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/anaylze_chatlog_bp`, {
      // await fetch(`http://localhost:5000/chatlog`, {
        method: 'POST',
         headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${node_serverToken}`
        },
        body: JSON.stringify({
          history: messages,
          health_feedback: localStorage.getItem('today__health_feedback')  // 오늘 생성된 피드백 전달
        })
      });
      // 필요 시 리포트 페이지로 이동:
      // navigate('/report');
    } catch (err) {
      console.error('대화 로그 전송 실패', err);
    }
  }, [messages]);

  // 마운트 시 자동 시작, 언마운트 시 정리
  useEffect(() => {
    startRecognition();
    return () => stopRecognition();
  }, [startRecognition, stopRecognition]);

  // 버튼 클릭 시 “모드 n번을 선택함” 처리
  const handleModeSelect = useCallback(async (mode) => {
    // (1) 현재 듣기 중이면 멈추고
    if (recognitionRef.current) {
      stopRecognition();
    }
    // (2) 유저 메시지 추가
    const userText = `모드 ${mode}번을 선택함`;
    addMessage('user', userText);
    // (3) GPT에 보내고
    const reply = await sendToGpt(userText);
    addMessage('assistant', reply);
    // (4) TTS 후 다시 듣기 재시작
    speak(reply, startRecognition);
  }, [stopRecognition, addMessage, sendToGpt, speak, startRecognition]);

  return (
    <div className="chat-voice">


      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            {m.content}
          </div>
        ))}
      </div>

      <button
        className="voice-button"
        onClick={() => isListening ? stopRecognition() : startRecognition()}
      >
        {isListening ? '⏹ 일시정지' : '🎤 대화 시작'}
      </button>

      <button
        className="end-button"
        onClick={endConversation}
      >
        대화 종료 &amp; 리포트 생성
      </button>

      {/* 모드 선택 버튼 그룹 */}
      <p style={{ textAlign: 'center' }}>모드 선택</p>
      <ModeSelect onSelect={handleModeSelect} />
    </div>
  );
}

export default ChatVoice;
