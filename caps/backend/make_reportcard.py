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
    # 1) Prompt 구성: 필요한 필드만 추출하고, success/feedback은 빈 문자열로 고정
    prompt = f"""
              아래 대화 이력을 분석하여 JSON으로 출력해주세요.
              - 추천 루틴(recommended_routine)
              - 루틴을 지속할 시간(duration)
              - 루틴을 추천한 이유(reason)
              - 루틴의 성공 여부(success): 항상 빈 문자열
              - LIA의 피드백(feedback): 항상 빈 문자열

              대화 이력:
              {json.dumps(history, ensure_ascii=False, indent=2)}

              출력 예시:
              {{
                "recommended_routine": "조깅",
                "duration": "30분",
                "reason": "심폐 기능 강화를 위해",
                "success": "",
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

    # strip ``` fences (and any leading “json” tag) so we end up with pure JSON
    # fallback to grabbing between the first '{' and last '}'
    raw = content.strip()
    if raw.startswith("```"):
        # remove both opening and closing fences
        raw = raw.split("```", 2)[1]
    # if it still has a leading language hint, drop until the first '{'
    if not raw.lstrip().startswith("{"):
        raw = raw[raw.find("{"):]
    # drop anything after the last '}'
    raw = raw[: raw.rfind("}") + 1]

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        print(f"Parse error, raw response: {content}")
        return jsonify({"error": "JSON 파싱 실패", "raw": content}), 500
    

    return jsonify(result)
