# backend/chat.py  
from flask import Blueprint, request, jsonify  
from flask_cors import cross_origin  
import os, openai  
from lia_chat_prompt import LIA_PROMPT

openai.api_key = os.getenv("API_KEY")  

chat_bp = Blueprint("chat", __name__)  

@chat_bp.route("/chat", methods=["POST"])  
@cross_origin(origins=["http://localhost:3000", "https://www.talktolia.org"])  
def chat():
    data      = request.get_json() or {}
    payload   = data.get("payload", data)
    history   = payload.get("history", [])
    user_msg  = payload.get("message", "").strip()
    mode      = payload.get("mode", 1)
    health_in = payload.get("health_info")
    events_in = payload.get("calendar_events")

    print(f"Data received: {data}")
    print("----- 대화 히스토리 시작 -----")
    if history:
        for msg in history:
            role = msg.get("role","").lower()
            label = "LIA" if role=="assistant" else role.upper()
            print(f"[{label}] {msg.get('content')}")
    else:
        print("대화 히스토리가 없습니다.")
    print("----- 대화 히스토리 끝 -----\n")

    print(f"전달 받은 건강 정보: {health_in}")
    print(f"전달 받은 캘린더 정보: {events_in}")

    if not user_msg:
        return jsonify({"error": "No message provided"}), 400
    # access_tok = data.get("access_token")
    # refresh_tok = data.get("refresh_token")

    messages = [{"role": "system", "content": LIA_PROMPT}] + history

    if mode == 2:
        if health_in is not None:
            messages.append({
                "role": "system",
                "content": f"사용자 건강 데이터:\n{health_in}"
            })
        # else:
        #     health_info = ""
        #     print("프론트에서 건강 정보 받아오기 실패")
        #     try:
        #         print("📥 [헬스 정보 로드 중...]")
        #         health_info = get_decrypted_health(days=1, token=jwt_tok)
        #         print("📥 [헬스 정보 로드 완료]")
        #         print(health_info)
        #         messages.append({
        #             "role": "system",
        #             "content": f"사용자 건강 데이터:\n{health_info}"
        #         })
        #     except Exception as e:
        #         messages.append({
        #             "role": "system",
        #             "content": f"⚠️ 건강 정보 로드 실패: {e}"
        #         })

        if events_in is not None:
            evt_str = "\n".join(
                f"- {e['start']}~{e['end']}: {e['summary']}"
                for e in events_in
            ) or "일정이 없습니다."
            messages.append({
                "role": "system",
                "content": f"사용자 일정:\n{evt_str}"
            })
        # else:
        #     print("프론트에서 캘린더 정보 받아오기 실패")
        #     try:
        #         if access_tok and refresh_tok:
        #             events = fetch_calendar_events(access_tok, refresh_tok, days=1)
        #             # 디버그용으로 원본 리스트 찍기
        #             print("📥 [캘린더 원본 이벤트]")
        #             print(events)

        #             # 사람이 읽기 좋은 문자열로 정리
        #             evt_str = "\n".join(
        #                 f"- {e['start']}~{e['end']}: {e['summary']}"
        #                 for e in events
        #             ) or "일정이 없습니다."

        #             # 디버그용으로 문자열 출력
        #             print("📥 [캘린더 읽기용 이벤트]")
        #             print(evt_str)
        #             messages.append({
        #                 "role": "system",
        #                 "content": f"사용자 일정:\n{evt_str}"
        #             })
        #         else:
        #             messages.append({
        #                 "role": "system",
        #                 "content": "⚠️ 캘린더 토큰 정보(access/refresh)가 없습니다."
        #             })
        #     except Exception as e:
        #         messages.append({
        #             "role": "system",
        #             "content": f"⚠️ 캘린더 정보 로드 실패: {e}"
        #         })

    messages.append({"role": "user", "content": user_msg})

    finetuning_model = os.getenv("OPENAI_FINETUNED_MODEL")

    resp = openai.chat.completions.create(
        # model="gpt-4o"
        model=finetuning_model,
        messages=messages,
        temperature=0.2
    )

    reply = resp.choices[0].message.content.strip()
    return jsonify({"reply": reply}), 200