from flask import Blueprint, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from googleapiclient.discovery import build
import os

calender_bp = Blueprint('calender', __name__)

@calender_bp.route('/calendar/events', methods=['POST'])
def get_calendar_events():
    try:
        # 프론트에서 보낸 ID 토큰 (credential)
        token = request.json.get('credential')
        if not token:
            return jsonify({'error': 'No credential token provided'}), 400

        # ID 토큰 검증 및 사용자 정보 추출
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), os.environ['GOOGLE_CLIENT_ID'])

        # 여기서 access_token이 없기 때문에, 서비스 계정 or OAuth 인증 Flow가 필요하지만,
        # ID 토큰만 있는 상황에선 제한된 API 호출만 가능
        # 예시로 user info 정도만 리턴 가능

        # 예시: 유저 이메일
        user_email = idinfo.get('email', 'Unknown')

        # 🎯 실제 Google Calendar API 호출은 Service Account 또는 OAuth2 Flow로 재구성해야 함
        # 이곳에서는 mocking 데이터 또는 로그 확인 용도로만 사용

        return jsonify({
            'user': user_email,
            'events': [
                {'summary': '테스트 일정', 'start': '2025-06-01T10:00:00', 'end': '2025-06-01T11:00:00'}
            ]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500