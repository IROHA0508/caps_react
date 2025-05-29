# calender.py
from flask import Blueprint, request, jsonify
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()

calender_bp = Blueprint('calender', __name__)

@calender_bp.route('/calendar/events', methods=['POST'])
def get_calendar_events():
    try:
        print("📥 [요청 수신] /calendar/events")
        access_token = request.json.get('access_token')
        time_min = request.json.get('timeMin')
        time_max = request.json.get('timeMax')

        print(f"\n\ntimeMin: {time_min}, timeMax: {time_max}\n\n")

        if not access_token:
            return jsonify({'error': 'No access token provided'}), 400
        if not time_min or not time_max:
            return jsonify({'error': 'Missing timeMin or timeMax'}), 400

        creds = Credentials(token=access_token)
        service = build('calendar', 'v3', credentials=creds)

        events_result = service.events().list(
            calendarId='primary',
            timeMin=time_min,
            timeMax=time_max,
            maxResults=250,  # 충분한 수로 설정
            singleEvents=True,
            orderBy='startTime'
        ).execute()

        events = events_result.get('items', [])
        print(f"📆 일정 개수: {len(events)}")

        return jsonify({
            'events': [
                {
                    'id': e.get('id'),
                    'summary': e.get('summary'),
                    'start': e['start'].get('dateTime') or e['start'].get('date'),
                    'end': e['end'].get('dateTime') or e['end'].get('date')
                } for e in events
            ]
        })

    except Exception as e:
        print("❌ 예외 발생:", str(e))
        return jsonify({'error': str(e)}), 500
