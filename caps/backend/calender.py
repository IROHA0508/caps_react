# calender.py
from flask import Blueprint, request, jsonify
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.exceptions import RefreshError
from dotenv import load_dotenv
from datetime import datetime
import os
import requests

load_dotenv()

calender_bp = Blueprint('calender', __name__)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

@calender_bp.route('/calendar/events', methods=['POST'])
def get_calendar_events():
    try:
        print("📥 [요청 수신] /calendar/events")

        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
        time_min = request.json.get('timeMin')
        time_max = request.json.get('timeMax')

        if not access_token:
            return jsonify({'error': 'No access token provided'}), 400
        if not time_min or not time_max:
            return jsonify({'error': 'Missing timeMin or timeMax'}), 400

        creds = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET
        )

        service = build('calendar', 'v3', credentials=creds)

        try:
            events_result = service.events().list(
                calendarId='primary',
                timeMin=time_min,
                timeMax=time_max,
                maxResults=250,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
        except RefreshError as e:
            print("🔁 access_token 만료 → refresh_token으로 갱신 시도")
            return jsonify({'error': 'Token expired and refresh failed'}), 401

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
            ],
            'new_access_token': creds.token  # 새 access_token 반환
        })

    except Exception as e:
        print("❌ 예외 발생:", str(e))
        return jsonify({'error': str(e)}), 500