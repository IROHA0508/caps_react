# chatlog.py

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import os, json
from datetime import datetime
import requests

from make_report import generate_report
chatlog_bp = Blueprint('chatlog', __name__)

@chatlog_bp.route('/chatlog', methods=['POST'])
@cross_origin(origins=["http://localhost:3000", "https://www.talktolia.org"])
def chatlog():
    payload = request.get_json() or {}
    history = payload.get("history", [])
    health_feedback = payload.get("health_feedback", "")

    # 1) “건강 데이터 없음”인 경우 → GPT 호출 없이 해당 메시지만 카드로 저장
    if health_feedback == "건강 데이터 없음" or not health_feedback:
        cards = [
            {"title": "💡 건강 행동 추천", "content": health_feedback}
        ]
    # 2) 그 외(유효한 헬스 피드백이 있는 경우) → 기존 흐름대로
    elif health_feedback:
        # use_precomputed_health=True 로 첫 카드만 health_feedback으로 대체
        cards = generate_report(
            history,
            raw_health_data=health_feedback,
            use_precomputed_health=True
        )

    # 4) Node 서버로 전송
    node_host = os.getenv("REACT_APP_IP_PORT", "api.talktolia.org")
    node_url  = f"https://{node_host}/reports"

    auth_header = request.headers.get("Authorization")

    headers = {"Content-Type": "application/json"}

    if auth_header:
        headers["Authorization"] = auth_header

    try:
      resp = requests.post(
          node_url,
          json={"cards": cards},
          headers=headers
      )
      resp.raise_for_status()
      return jsonify({"status": "report_sent", "node_response": resp.json()}), 200

    except Exception as e:
        return jsonify({"error": "report_send_failed", "details": str(e)}), 500
