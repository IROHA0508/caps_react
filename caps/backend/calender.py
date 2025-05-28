from flask import Blueprint, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from googleapiclient.discovery import build
import os

calender_bp = Blueprint('calender', __name__)

@calender_bp.route('/calendar/events', methods=['POST'])
def get_calendar_events():
    try:
        print("📥 [요청 수신] /calendar/events 엔드포인트 호출됨")
        print("📦 요청 JSON 데이터:", request.json)

        # 프론트에서 보낸 ID 토큰 (credential)
        token = request.json.get('credential')
        if not token:
            print("⚠️ credential 누락됨")
            return jsonify({'error': 'No credential token provided'}), 400

        # ID 토큰 검증 및 사용자 정보 추출
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), os.environ['GOOGLE_CLIENT_ID'])
        print("✅ ID 토큰 검증 성공:", idinfo)

        # 예시: 유저 이메일
        user_email = idinfo.get('email', 'Unknown')

        # 응답 mock 데이터
        response = {
            'user': user_email,
            'events': [
                {'summary': '테스트 일정', 'start': '2025-06-01T10:00:00', 'end': '2025-06-01T11:00:00'}
            ]
        }

        print("📤 응답 데이터:", response)
        return jsonify(response)

    except Exception as e:
        print("❌ 예외 발생:", str(e))
        return jsonify({'error': str(e)}), 500
