from flask import Blueprint, request, jsonify
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.exceptions import RefreshError
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os
import requests
from flask_cors import cross_origin


load_dotenv()

calendar_bp = Blueprint('calendar_info', __name__)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

@calendar_bp.route('/calendar/events', methods=['POST', 'OPTIONS'])
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

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import dateutil.parser
import pytz
import traceback

@calendar_bp.route('/calendar/insert', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000", "https://www.talktolia.org"], supports_credentials=True)
def add_routine_to_calendar():
    try:
        data = request.get_json()
        access_token = data.get("access_token")
        refresh_token = data.get("refresh_token")
        report = data.get("report")

        print("📥 calendar/insert 요청 수신")
        print("access_token:", access_token)
        print("refresh_token:", refresh_token)
        print("report:", report)
        print("🔑 client_id:", os.getenv("GOOGLE_CLIENT_ID"))
        print("🔑 client_secret:", os.getenv("GOOGLE_CLIENT_SECRET"))

        if not (access_token and report):
            return jsonify({"error": "Missing access_token or report data"}), 400

        # Google 인증 설정
        creds = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri='https://oauth2.googleapis.com/token',
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
        )

        service = build("calendar", "v3", credentials=creds)

        # start_time: "오전 7시" 같은 표현 → datetime 변환 필요
        now = datetime.now(pytz.timezone('Asia/Seoul'))

        print("🕒 start_time 원본:", report.get("start_time"))
        hour_min = parse_korean_time(report.get("start_time"))
        print("🕒 파싱된 시간:", hour_min)

        start_dt = now.replace(hour=hour_min[0], minute=hour_min[1], second=0, microsecond=0)

        # duration: "30분", "1시간" → timedelta 변환
        duration = parse_duration(report.get("duration"))
        end_dt = start_dt + duration

        event_body = {
            "summary": report.get("recommended_routine", "추천 루틴"),
            "description": report.get("reason", ""),
            "start": {
                "dateTime": start_dt.isoformat(),
                "timeZone": "Asia/Seoul"
            },
            "end": {
                "dateTime": end_dt.isoformat(),
                "timeZone": "Asia/Seoul"
            }
        }

        print("📤 이벤트 바디:", event_body)
        event = service.events().insert(calendarId='primary', body=event_body).execute()
        return jsonify({"status": "success", "event": event})

    except Exception as e:
        print("❌ 예외 발생:")
        traceback.print_exc()  # 전체 스택트레이스 콘솔 출력
        return jsonify({"error": str(e)}), 500


# --- 보조 함수 ---
def parse_korean_time(korean_str):
    import re
    match = re.search(r"(오전|오후)\s*(\d{1,2})시\s*(\d{1,2})?분?", korean_str or "")
    if not match:
        return (9, 0)  # 기본값: 오전 9시

    period, hour, minute = match.groups()
    hour = int(hour)
    minute = int(minute or 0)

    if period == "오후" and hour != 12:
        hour += 12
    if period == "오전" and hour == 12:
        hour = 0

    return (hour, minute)


def parse_duration(duration_str):
    import re
    if not duration_str:
        return timedelta(minutes=30)
    
    h_match = re.search(r"(\d+)시간", duration_str)
    m_match = re.search(r"(\d+)분", duration_str)

    hours = int(h_match.group(1)) if h_match else 0
    minutes = int(m_match.group(1)) if m_match else 0
    return timedelta(hours=hours, minutes=minutes)