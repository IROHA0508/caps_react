# backend/make_reportcard.py
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin  
import os, openai, json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("API_KEY")
make_reportcardbp = Blueprint("make_reportcard", __name__)

@make_reportcardbp.route("/make_reportcard", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000", "https://www.talktolia.org"])  
def make_reportcard():
    data = request.get_json() or {}
    history = data.get("history", [])
    health = data.get("health_info", {})
    events = data.get("calendar_events", [])

    # 1) Prompt 구성: 필요한 필드만 추출하고, success/feedback은 빈 문자열로 고정
    prompt = f"""
              아래 대화 이력을 분석하여 JSON으로 출력해주세요.
              - 추천 루틴(recommended_routine)
              - 루틴을 시작할 시간(start_time)
              - 루틴을 지속할 시간(duration)
              - 루틴을 추천한 이유(reason)
              - 루틴의 성공 여부(success): 항상 F로 설정
              - LIA의 피드백(feedback): 항상 빈 문자열

              대화 이력:
              {json.dumps(history, ensure_ascii=False, indent=2)}

              건강 정보:
              {json.dumps(health, ensure_ascii=False, indent=2)}

              캘린더 이벤트:
              {json.dumps(events, ensure_ascii=False, indent=2)}

              출력 예시 (순서를 아래와 맞춰서)
              {{
                "recommended_routine": "조깅",
                "start_time": "오전 7시",
                "duration": "30분",
                "reason": "심폐 기능 강화를 위해",
                "success": "F",
                "feedback": ""
              }}
              """
    
    # 2) OpenAI 호출
    resp = openai.chat.completions.create(
        model="gpt-4o-mini",
        # model = finetuning_model
        messages=[
            {"role": "system", "content": "You are an assistant that extracts structured report data."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    content = resp.choices[0].message.content
    print(f"\nOpenAI 응답: {content}\n")

    raw = content.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
    if not raw.lstrip().startswith("{"):
        raw = raw[raw.find("{"):]
    raw = raw[: raw.rfind("}") + 1]

    try:
        result = json.loads(raw)
        print(f"\nresult: {result}\n")
    except json.JSONDecodeError:
        print(f"Parse error, raw response: {content}")
        return jsonify({"error": "JSON 파싱 실패", "raw": content}), 500
    
    return jsonify(result)
