# calender.py
from flask import Blueprint, request, jsonify
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os

load_dotenv()

calender_bp = Blueprint('calender', __name__)

@calender_bp.route('/calendar/events', methods=['POST'])
def get_calendar_events():
    try:
        print("📥 [요청 수신] /calendar/events")
        access_token = request.json.get('access_token')
        if not access_token:
            return jsonify({'error': 'No access token provided'}), 400

        creds = Credentials(token=access_token)
        service = build('calendar', 'v3', credentials=creds)

        now = datetime.utcnow().isoformat() + 'Z'
        max_time = (datetime.utcnow() + timedelta(days=7)).isoformat() + 'Z'

        events_result = service.events().list(
            calendarId='primary',
            timeMin=now,
            timeMax=max_time,
            maxResults=10,
            singleEvents=True,
            orderBy='startTime'
        ).execute()

        events = events_result.get('items', [])
        print("📆 일정 불러오기 완료:", events)

        return jsonify({
            'events': [
                {
                    'summary': e.get('summary'),
                    'start': e['start'].get('dateTime') or e['start'].get('date'),
                    'end': e['end'].get('dateTime') or e['end'].get('date')
                } for e in events
            ]
        })

    except Exception as e:
        print("❌ 예외 발생:", str(e))
        return jsonify({'error': str(e)}), 500
