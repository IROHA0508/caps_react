# backend/chat.py  
from flask import Blueprint, request, jsonify  
from flask_cors import cross_origin  
import os, openai  
from lia_chat_prompt import LIA_PROMPT
from health import get_decrypted_health
from calendar_client import fetch_calendar_events

openai.api_key = os.getenv("API_KEY")  
chat_bp = Blueprint("chat", __name__)  

@chat_bp.route("/chat", methods=["POST"])  
@cross_origin(origins=["http://localhost:3000", "https://www.talktolia.org"])  
def chat():
    data     = request.get_json() or {}
    history  = data.get("history", [])
    user_msg = data.get("message", "").strip()
    mode     = data.get("mode", 1)
    jwt_tok  = data.get("server_jwt_token")  # 헬스 fetch용
    access_tok  = data.get("access_token")   # 캘린더용
    refresh_tok = data.get("refresh_token")

    if not user_msg:
        return jsonify({"error": "메시지를 입력하세요"}), 400

    messages = [{"role": "system", "content": LIA_PROMPT}] + history

    if mode == 2:
        # 1) 헬스 정보
        health_info = ""
        print("모드 2 선택")
        try:
            print("📥 [헬스 정보 로드 중...]")
            health_info = get_decrypted_health(days=1, token=jwt_tok)
            print("📥 [헬스 정보 로드 완료]")
            print(health_info)
            messages.append({
                "role": "system",
                "content": f"사용자 건강 데이터:\n{health_info}"
            })
        except Exception as e:
            messages.append({
                "role": "system",
                "content": f"⚠️ 건강 정보 로드 실패: {e}"
            })

        # 2) 캘린더 일정
        try:
            if access_tok and refresh_tok:
                events = fetch_calendar_events(access_tok, refresh_tok, days=1)
                # 디버그용으로 원본 리스트 찍기
                print("📥 [캘린더 원본 이벤트]")
                print(events)

                # 사람이 읽기 좋은 문자열로 정리
                evt_str = "\n".join(
                    f"- {e['start']}~{e['end']}: {e['summary']}"
                    for e in events
                ) or "일정이 없습니다."

                # 디버그용으로 문자열 출력
                print("📥 [캘린더 읽기용 이벤트]")
                print(evt_str)
                messages.append({
                    "role": "system",
                    "content": f"사용자 일정:\n{evt_str}"
                })
            else:
                messages.append({
                    "role": "system",
                    "content": "⚠️ 캘린더 토큰 정보(access/refresh)가 없습니다."
                })
        except Exception as e:
            messages.append({
                "role": "system",
                "content": f"⚠️ 캘린더 정보 로드 실패: {e}"
            })

    messages.append({"role": "user", "content": user_msg})

    resp = openai.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0.2
    )

    reply = resp.choices[0].message.content.strip()
    return jsonify({"reply": reply}), 200