from flask import Blueprint, request, jsonify
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.exceptions import RefreshError
from dotenv import load_dotenv
from datetime import datetime
import os
import requests
from flask_cors import cross_origin


load_dotenv()

calender_bp = Blueprint('calender', __name__)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

@calender_bp.route('/calendar/events', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["https://www.talktolia.org"], supports_credentials=True)
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
            calendar_list = service.calendarList().list().execute()
        except RefreshError:
            print("🔁 access_token 만료 → refresh_token으로 갱신 시도 실패")
            return jsonify({'error': 'Token expired and refresh failed'}), 401

        all_events = []
        
        colors = service.colors().get().execute()
        event_color_map = colors.get('event', {})
                
        for calendar in calendar_list.get('items', []):
            calendar_id = calendar.get('id')
            calendar_name = calendar.get('summary', 'No Name')

            try:
                events_result = service.events().list(
                    calendarId=calendar_id,
                    timeMin=time_min,
                    timeMax=time_max,
                    maxResults=250,
                    singleEvents=True,
                    orderBy='startTime'
                ).execute()

                events = events_result.get('items', [])

                
                for e in events:
                    color_id = e.get('colorId')
                    color_info = event_color_map.get(color_id, {})
                    all_events.append({
                        'id': e.get('id'),
                        'calendar': calendar_name,
                        'summary': e.get('summary'),
                        'start': e['start'].get('dateTime') or e['start'].get('date'),
                        'end': e['end'].get('dateTime') or e['end'].get('date'),
                        'color': color_info.get('background')  # ✅ 실제 색상 코드로 변환
                    })

            except Exception as e:
                print(f"⚠️ {calendar_name} 캘린더에서 일정 가져오기 실패:", str(e))
                continue

        print(f"📆 총 일정 개수: {len(all_events)}")

        return jsonify({
            'events': all_events,
            'new_access_token': creds.token
        })

    except Exception as e:
        print("❌ 예외 발생:", str(e))
        return jsonify({'error': str(e)}), 500
