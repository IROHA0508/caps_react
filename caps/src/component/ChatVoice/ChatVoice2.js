// src/components/ChatVoice/ChatVoice.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatVoice.css';
import ModeSelect from '../ModeSelect/ModeSelect.js';          
import '../ModeSelect/ModeSelect.css';
import dayjs from 'dayjs';

// 마크다운 제거
function stripMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

function ChatVoice({ onMessage = () => {} }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content }

  const [healthInfo, setHealthInfo] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState(null);


  // JSON 다운로드 함수
  const downloadJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // messages의 최신 값을 저장할 ref
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  // 1) mode state: localStorage에서 꺼내오고 기본값은 1
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('lia_mode');
    return saved ? Number(saved) : 1;
  });
  
  const prevModeRef = useRef(mode);

  // 2) mode 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('lia_mode', mode);
    console.log(`모드 ${mode}번을 선택함`);
    console.log("현재 모드:", mode);
    console.log("이전 모드:", prevModeRef.current);
    prevModeRef.current = mode;
  }, [mode]);

  const loadMode2Data = useCallback(async () => {
    const serverToken   = localStorage.getItem("server_jwt_token");
    const access_token  = localStorage.getItem("google_access_token");
    const refresh_token = localStorage.getItem("google_refresh_token");

    // 결과 담을 변수
    let health = "";
    let events = [];
    
    // 현재 날짜 기준으로 이번 달의 시작과 끝 날짜 계산
    const now = dayjs();
    const startOfMonth = now.startOf('month').toDate();
    const endOfMonth = now.endOf('month').toDate();

    // console.log("timeMin:", startOfMonth.toISOString());
    // console.log("timeMax:", endOfMonth.toISOString());
    try {
      // 헬스 데이터만 불러오는 엔드포인트
      const res1 = await fetch(`${process.env.REACT_APP_BACKEND_URL}/health/from-node`, {
      // const res1 = await fetch(`http://localhost:5000/health/from-node`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server_jwt_token: serverToken,  // Python 에서 기대하는 필드명
          days: 3                         // 조회 기간
        })
      });

      console.log("헬스 API 응답:", res1.status);
      if (res1.ok) {
        const { data: decryptedHealth } = await res1.json();
        console.log("🔐 복호화된 헬스 데이터:", decryptedHealth);
        health = decryptedHealth ?? "";
        setHealthInfo(health);
      } else {
        console.error("❌ 헬스 API 오류:", res1.status);
      }
    } catch (e) {
      console.error("💥 헬스 로드 실패:", e);
      health = "";
    }

    try{
      // 캘린더 일정만 불러오는 엔드포인트
      const res2 = await fetch(`${process.env.REACT_APP_BACKEND_URL}/calendar/events`, {
      // const res2 = await fetch(`http://localhost:5000/calendar/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token, 
          refresh_token,
          timeMin: startOfMonth.toISOString(),
          timeMax: endOfMonth.toISOString() })
      });
      console.log("캘린더 API 응답:", res2.status);
      if (res2.ok) {
        const { events: returnedEvents } = await res2.json();
        console.log("일정 데이터:", returnedEvents);
        events = returnedEvents ?? [];
        setCalendarEvents(events);
      } else {
        console.error("❌ 캘린더 API 오류:", res2.status);
      }
    } catch (e) {
      console.error("💥 캘린더 로드 실패:", e);
      events = [];
    }

    // setDataLoaded(true);

    return { health, events };
  }, []);

  // 음성 인식 중단
  const stopRecognition = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  // GPT 호출 (history 포함)
  const sendToGpt = useCallback(async (historyList, userMsg, overrideMode, overrideHealth, overrideEvents) => {
    let  usedMode = overrideMode !== undefined ? overrideMode : mode;
    const selectedMode = localStorage.getItem('lia_mode');
    
    if (selectedMode !== usedMode.toString()) {
      console.warn(`선택된 모드(${selectedMode})와 사용 모드(${usedMode})가 다릅니다!`);
      console.warn(`선택된 모드: ${selectedMode}, 사용 모드: ${usedMode}`);
      usedMode = Number(selectedMode);
      console.log('👉 사용 모드가 선택된 모드로 변경됨:', usedMode);
    }

    const usedMode2 = localStorage.getItem('lia_mode');
    console.log('👉 userMode2:', usedMode2);
    
    const payload = {
      history: historyList,
      message: userMsg,
      mode: usedMode 
    };

    console.log('👉 보내는 payload의 mode:', payload.mode);

    if (usedMode  === 2) {
      if (healthInfo != null) {
        payload.health_info     = overrideHealth ?? healthInfo ?? "";
      }
      if (calendarEvents != null) {
        payload.calendar_events = overrideEvents ?? calendarEvents ?? [];
      }
    }

    console.log('👉 보내는 payload.history:', historyList);

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat`, {
    // const res = await fetch(`http://localhost:5000/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const { reply, emotion } = await res.json();
    console.log('GPT 응답:', emotion);
    localStorage.setItem('lia_emotion', emotion);
    onMessage();
    return { reply, emotion };
  }, [mode, healthInfo, calendarEvents]);

  // Google TTS 음성 출력
  const speak = useCallback(async (rawText, onEnd) => {
    stopRecognition();

    const cleanText = stripMarkdown(rawText);

    try {
      // (1) Google TTS로 mp3 파일 받아오기
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/google_tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText })
      });

      if (!res.ok) throw new Error("TTS 요청 실패");

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      // (2) 사용자 음성 감지(VAD)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const VAD_THRESHOLD = 35;

      function detectVoice() {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let v of data) sum += (v - 128) ** 2;
        const rms = Math.sqrt(sum / data.length);

        if (rms > VAD_THRESHOLD) {
          // 사용자 음성 감지 → TTS 중단
          audio.pause();
          audio.src = ""; // 메모리 해제
          audioCtx.close();
          onEnd();
        } else if (!audio.paused) {
          requestAnimationFrame(detectVoice);
        } else {
          audioCtx.close();
        }
      }

      // (3) TTS 종료 시 처리
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioCtx.close();
        onEnd();
      };

      // (4) 음성 재생 및 감지 시작
      audio.play();
      detectVoice();

    } catch (err) {
      console.error("🔊 TTS 오류:", err);
      onEnd();
    }
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
      const newHistory = [...messagesRef.current, { role: 'user', content: text }];
      setMessages(newHistory);
      const {reply} = await sendToGpt(newHistory, text);

      const withReply = [...newHistory, { role: 'assistant', content: reply }];
      setMessages(withReply);

      speak(reply, startRecognition);
    };

    recognitionRef.current = rec;
    rec.start();
  }, [sendToGpt, speak]);

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
  const handleModeSelect = useCallback(async (selectedMode) => {
    const prevMode = prevModeRef.current;

    // (1) 현재 듣기 중이면 멈추고
    if (recognitionRef.current) {
      stopRecognition();
    }
    setMode(selectedMode);
    localStorage.setItem('lia_mode', selectedMode);
    console.log(` 299줄 : 모드 ${selectedMode}번을 선택함`);

    // (2) 모드 2 전용: 데이터 로드
    let health = "";
    let events = [];
    if (selectedMode === 2) {
      const data = await loadMode2Data();
      health = data.health;
      events = data.events;
    }

    // (3) 모드2에서 벗어나는 경우, mode2 히스토리만 백엔드로 전송 (비동기)
    if (prevMode === 2 && selectedMode !== 2) {
      const hist = messagesRef.current;
      const lastIdx = [...hist].reverse().findIndex(
        m => m.role === 'user' && m.content === '모드 2번을 선택함'
      );
      const start = lastIdx >= 0 ? hist.length - 1 - lastIdx : 0;
      const mode2History = hist.slice(start);

      console.log('모드2 히스토리:', mode2History);

    try{
      const reportRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/make_reportcard`, {
      // const reportRes = await fetch('http://localhost:5000/make_reportcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: messagesRef.current,
            health_info: health,
            calendar_events: events,
          }),
        }
      );
      if (!reportRes.ok) {
        console.error('리포트 생성 실패:', reportRes.status);
      } else {
        const reportJson = await reportRes.json();
        console.log('ReportCard JSON:', reportJson);

        // 4) 받은 JSON 자동 다운로드
        downloadJSON(reportJson);

        // (3-2) Node 서버로 생성된 리포트 전송
        const nodeServerUrl = process.env.REACT_APP_IP_PORT;
        const nodeServerToken = localStorage.getItem('server_jwt_token');
        const nodeRes = await fetch(
          `https://${nodeServerUrl}/reports`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${nodeServerToken}`,
            },
            body: JSON.stringify(reportJson),
          }
        );
        if (!nodeRes.ok) {
          console.error('리포트 카드 전송 실패:', nodeRes.status);
        } else {
          console.log('리포트 카드 전송 성공');
            
          // (3-3) 리포트 카드 전송 이후에 구글 캘린더에 등록
          const calenderRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/calendar/insert`, {
          // const calenderRes = await fetch('http://localhost:5000/calendar/insert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: localStorage.getItem("google_access_token"),
              refresh_token: localStorage.getItem("google_refresh_token"),
              report: reportJson,
            }),
          })
          if (!calenderRes.ok) {
            console.error('📅 캘린더 등록 실패:', calenderRes.status);
          } else {
            console.log('📅 캘린더 등록 성공');

            const calendarJson = await calenderRes.json();
            downloadJSON(calendarJson); 
          }
        }
      }
    } catch (err) {
      console.error('리포트 처리 중 예외 발생:', err);
    }
  }

    // (2) 유저 메시지 추가
    const userText = `모드 ${selectedMode}번을 선택함`;

    // 버튼일 때도 동일 패턴: 전체 히스토리 계산 → sendToGpt 호출
    const historyAfterMode = [...messagesRef.current, { role: 'user', content: userText }];
    setMessages(historyAfterMode);

    const payload = {
      history: historyAfterMode,
      message: userText,
      mode: selectedMode,
      ...(selectedMode === 2 && { health_info: health, calendar_events: events })
    };

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat`, {
    // const res = await fetch(`http://localhost:5000/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const {reply} = await res.json();

    setMessages(prev => [...historyAfterMode, { role: 'assistant', content: reply }]);

    // (4) TTS 후 다시 듣기 재시작
    speak(reply, startRecognition);
  }, [stopRecognition, loadMode2Data, speak, startRecognition]);

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

      {/* <button
        className="end-button"
        onClick={endConversation}
      >
        대화 종료 &amp; 리포트 생성
      </button> */}

      {/* 모드 선택 버튼 그룹 */}
      <p style={{ textAlign: 'center' }}>모드 선택</p>
      <ModeSelect onSelect={handleModeSelect} />
    </div>
  );
}

export default ChatVoice;
