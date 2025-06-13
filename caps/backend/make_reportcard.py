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
              - 루틴의 성공 여부(success): 항상 빈 문자열
              - LIA의 피드백(feedback): 항상 빈 문자열

              대화 이력:
              {json.dumps(history, ensure_ascii=False, indent=2)}

              건강 정보:
              {json.dumps(health, ensure_ascii=False, indent=2)}

              캘린더 이벤트:
              {json.dumps(events, ensure_ascii=False, indent=2)}

              출력 예시:
              {{
                "recommended_routine": "조깅",
                "start_time": "오전 7시",
                "duration": "30분",
                "reason": "심폐 기능 강화를 위해",
                "success": "",
                "feedback": ""
              }}

              주의 사항:
              1. 반드시 JSON 형식으로 출력해야 합니다
              2. 루틴을 시작할 시간은 "오전 7시"와 같이 구체적인 시간을 사용해야 합니다
              3. 루틴을 지속할 시간은 "30분"과 같이 구체적인 시간을 사용해야 합니다
              4. 루틴을 시작할 시간은 "오전 7시"와 같이 오전/오후를 포함해야 합니다
              5. 루틴을 추천한 이유는 "심폐 기능 강화를 위해"와 같이 구체적인 이유를 작성하되 1~2줄 정도의 양이어야 합니다
              6. 루틴을 시작할 시간을 정할 때, 받아온 캘린더 이벤트를 참고하여 사용자의 일정을 고려해야 합니다
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
    except json.JSONDecodeError:
        print(f"Parse error, raw response: {content}")
        return jsonify({"error": "JSON 파싱 실패", "raw": content}), 500
    

    return jsonify(result)
