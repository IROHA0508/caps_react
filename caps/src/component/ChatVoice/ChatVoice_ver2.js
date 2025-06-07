// src/components/ChatVoice/ChatVoice_ver2.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatVoice.css';

function ChatVoice_ver2() {
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content }

  // 메시지 추가
  const addMessage = useCallback((role, content) => {
    setMessages(msgs => [...msgs, { role, content }]);
  }, []);

  // 음성 인식 중단 함수
  const stopRecognition = useCallback(() => {
    setIsListening(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
  }, []);

  // GPT 호출 (history 포함)
  const sendToGpt = useCallback(async (userMsg) => {
    const res = await fetch(`http://localhost:5000/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: messages, message: userMsg })
    });
    const { reply } = await res.json();
    return reply;
  }, [messages]);

  // 오디오 -> STT -> GPT -> TTS
  const sendAudioToGpt = useCallback(async (transcript) => {
    addMessage('user', transcript);
    const reply = await sendToGpt(transcript);
    addMessage('assistant', reply);
    speak(reply, startRecognition);
  }, [sendToGpt, addMessage, speak, startRecognition]);

  // TTS 재생 (VAD로 중간 끊기 감지)
  const speak = useCallback((text, onEnd) => {
    stopRecognition();
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    utter.onend = onEnd;
    window.speechSynthesis.speak(utter);

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

  // Google Cloud STT 기반 음성 인식 시작
  const startRecognition = useCallback(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 2048;
        const dataArray = new Uint8Array(analyser.fftSize);
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        const options = { mimeType: 'audio/webm' };
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        let chunks = [];
        let speaking = false;
        let silenceStart = null;
        const SILENCE_DELAY = 1000; // ms
        const VAD_THRESHOLD = 30;

        mediaRecorder.ondataavailable = e => chunks.push(e.data);

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: chunks[0].type });
          chunks = [];
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            fetch(
              `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.REACT_APP_GOOGLE_CLOUD_STT_KEY}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  config: {
                    encoding: 'WEBM_OPUS',
                    sampleRateHertz: audioCtx.sampleRate,
                    languageCode: 'ko-KR',
                    enableAutomaticPunctuation: true
                  },
                  audio: { content: base64 }
                })
              }
            )
              .then(res => res.json())
              .then(data => {
                const result = data.results?.[0]?.alternatives?.[0];
                const transcript = result?.transcript?.trim();
                const confidence = result?.confidence ?? 0;
                if (transcript && confidence > 0.8 && transcript.length >= 3) {
                  sendAudioToGpt(transcript);
                }
              })
              .catch(err => console.error('STT error', err));
          };
          reader.readAsDataURL(blob);
        };

        mediaRecorder.start();
        setIsListening(true);

        // VAD로 말 끝 판단
        const detectSpeech = () => {
          analyser.getByteTimeDomainData(dataArray);
          let sum = 0;
          for (let v of dataArray) sum += (v - 128) ** 2;
          const rms = Math.sqrt(sum / dataArray.length);
          if (rms > VAD_THRESHOLD) {
            if (!speaking) { speaking = true; silenceStart = null; }
          } else if (speaking) {
            if (silenceStart === null) {
              silenceStart = Date.now();
            } else if (Date.now() - silenceStart > SILENCE_DELAY) {
              mediaRecorder.stop();
              stream.getTracks().forEach(t => t.stop());
              return;
            }
          }
          requestAnimationFrame(detectSpeech);
        };
        detectSpeech();
      })
      .catch(err => alert('음성 인식 사용 불가: ' + err.message));
  }, [sendAudioToGpt, speak]);

  useEffect(() => {
    startRecognition();
    return () => stopRecognition();
  }, [startRecognition, stopRecognition]);

  return (
    <div className="chat-voice">
      <p>Google Cloud STT 대화 모드</p>
      <div className="messages">
        {messages.map((m, i) => <div key={i} className={m.role}>{m.content}</div>)}
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

export default ChatVoice_ver2;
