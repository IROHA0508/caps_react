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
    data = request.get_json() or {}  
    history = data.get("history", [])       # [{role, content}, …]  
    user_msg = data.get("message", "").strip()  
    if not user_msg:  
        return jsonify({"error": "No message provided"}), 400  

    # system 프롬프트 추가 예시  
    messages = [{"role": "system", "content": LIA_PROMPT}]  
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
