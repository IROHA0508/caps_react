// src/components/ChatVoice/ChatVoice.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatVoice.css';

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

  // 음성 인식 시작/중단 함수
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
    // 1) 답변 재생 전 인식 중단
    stopRecognition();

    // 2) 기존 TTS가 있으면 모두 취소
    window.speechSynthesis.cancel();

    // **마크다운 별표 제거**
    const cleanText = stripMarkdown(rawText);

    // 3) 새 Utterance 생성
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'ko-KR';
    // 재생이 완전히 끝나면 onEnd() 호출
    utter.onend = onEnd;
    window.speechSynthesis.speak(utter);

    // 4) VAD(Voice Activity Detection) 설정
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const VAD_THRESHOLD = 35; // RMS 임계값 (실환경에 맞춰 조정)

      function detect() {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let v of data) sum += (v - 128) ** 2;
        const rms = Math.sqrt(sum / data.length);

        // 사용자가 말을 시작하면 TTS 즉시 취소
        if (rms > VAD_THRESHOLD) {
          window.speechSynthesis.cancel();
          audioCtx.close();
          onEnd();
        }
        // TTS 재생 중이면 계속 모니터링
        else if (window.speechSynthesis.speaking) {
          requestAnimationFrame(detect);
        }
        // TTS가 끝나면 청취 종료
        else {
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

    // 후보 문장 개수
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

      // confidence 순 정렬
      const alts = Array.from(last).sort((a,b) => b.confidence - a.confidence);
      const best = alts[0];
      const text = best.transcript.trim();

      // confidence 및 최소 길이 필터링
      if (best.confidence < 0.85 || text.length < 3) {
        return;
      }

      // 발화 완료 판단 → GPT 요청
      rec.stop();
      addMessage('user', text);
      const reply = await sendToGpt(text);
      addMessage('assistant', reply);

      // TTS 출력 후 다시 청취 모드
      speak(reply, startRecognition);
    };

    recognitionRef.current = rec;
    rec.start();
  }, [addMessage, sendToGpt, speak]);

  // 마운트 시 자동 시작, 언마운트 시 정리
  useEffect(() => {
    startRecognition();
    return () => stopRecognition();
  }, [startRecognition, stopRecognition]);

  return (
    <div className="chat-voice">

      <div className="messages">
        {messages.map((m,i) =>
          <div key={i} className={m.role}>{m.content}</div>
        )}
      </div>
      <button
        className="voice-button"
        onClick={() => isListening ? stopRecognition() : startRecognition()}
      >
        {isListening ? '⏹ 일시정지' : '🎤 대화 시작'}
      </button>
    </div>
  );
}

export default ChatVoice;
