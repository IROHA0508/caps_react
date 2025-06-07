# backend/chat.py  
from flask import Blueprint, request, jsonify  
from flask_cors import cross_origin  
import os, openai  

openai.api_key = os.getenv("API_KEY")  
chat_bp = Blueprint("chat", __name__)  

@chat_bp.route("/chat", methods=["POST"])  
@cross_origin(origins=["http://localhost:3000", "https://www.talktolia.org"])  
def chat():  
    data = request.get_json() or {}  
    history = data.get("history", [])       # [{role, content}, …]  
    user_msg = data.get("message", "").strip()  
    if not user_msg:  
        return jsonify({"error": "No message provided"}), 400  

    # system 프롬프트 추가 예시  
    messages = [{"role": "system", "content": "너는 친절하고 유능한 AI 어시스턴트야. 사용자의 질문에 정확하고 도움이 되는 답변을 제공해."}]  
    messages += history  
    messages.append({"role": "user", "content": user_msg})  

    resp = openai.chat.completions.create(  
        # model="gpt-4o-mini",  
        model="gpt-4o",
        messages=messages,  
        temperature=0.2    # 낮은 온도로 정확도↑  
    )  
    reply = resp.choices[0].message.content.strip()  
    return jsonify({"reply": reply})  
