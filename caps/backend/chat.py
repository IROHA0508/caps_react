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

    # print(f"Data received: {data}")
    print(f"\n선택된 모드: {mode}\n")
    print("\n----- 대화 히스토리 시작 -----")
    if history:
        for msg in history:
            role = msg.get("role","").lower()
            label = "LIA" if role=="assistant" else role.upper()
            print(f"[{label}] {msg.get('content')}")
    else:
        print("대화 히스토리가 없습니다.")
    print("----- 대화 히스토리 끝 -----\n")

    print(f"\n전달 받은 건강 정보: {health_in}\n")
    print(f"\n전달 받은 캘린더 정보: {events_in}\n")

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

        if events_in is not None:
            evt_str = "\n".join(
                f"- {e['start']}~{e['end']}: {e['summary']}"
                for e in events_in
            ) or "일정이 없습니다."
            messages.append({
                "role": "system",
                "content": f"사용자 일정:\n{evt_str}"
            })

    messages.append({"role": "user", "content": user_msg})

    finetuning_model = os.getenv("OPENAI_FINETUNED_MODEL")

    resp = openai.chat.completions.create(
        # model="gpt-4o"
        model=finetuning_model,
        messages=messages,
        temperature=0.2
    )

    reply = resp.choices[0].message.content.strip()
    emotion = analyze_emotion(reply) 
    
    return jsonify({
        "reply": reply,
        "emotion": emotion
    }), 200


def analyze_emotion(reply):
    # 하드코딩된 감정 매칭
    if any(keyword in reply.lower() for keyword in ["안녕", "반가워", "하이"]):
        return "waving"
    elif any(keyword in reply.lower() for keyword in ["발표", "시험", "면접", "축하"]):
        return "cheering"
    elif any(keyword in reply.lower() for keyword in ["춤", "춤춰", "춤추"]):
        return "dance"
    elif any(keyword in reply.lower() for keyword in ["추천", "루틴", "운동", "식단"]):
        return "joy"
    
    # 기존 감정 분석 로직
    emotion_prompt = f"""다음 메시지의 감정을 분석하여 다음 중 하나로 분류해주세요: anger, dance, cheering, joy, surprise, Nothing associated
    메시지: {reply}
    감정:"""
    messages = [
        {"role": "system", "content": "You are an emotion analysis system. Respond with only one of these emotions: anger, dance, cheering, joy, surprise"},
        {"role": "user", "content": emotion_prompt}
    ]

    resp = openai.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0.1
    )

    emotion = resp.choices[0].message.content.strip().lower()
    
    print(f"분석된 감정: {emotion}")
    return emotion