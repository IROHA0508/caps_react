import React, { useState, useRef } from 'react';
import './VoiceRecognizer.css';

function VoiceRecognizer({ onResult }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const fullText = finalTranscript + interimTranscript;
      setTranscript(fullText);
      if (onResult) onResult(fullText);
    };

    recognition.onerror = (event) => {
      alert("음성 인식 오류: " + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="voice-recognizer">
      <button className="voice-button" onClick={toggleSpeechRecognition}>
        {isListening ? '⏹ 인식 멈추기' : '🎤 인식 시작'}
      </button>

      {isListening && <p>🟢 실시간 음성 인식 중...</p>}
      {transcript && <p><strong>결과:</strong> {transcript}</p>}
    </div>
  );
}

export default VoiceRecognizer;
