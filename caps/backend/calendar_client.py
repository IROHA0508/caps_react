# calendar_client.py
# 파이썬에서 캘린더 정보 받아와서 -> Chat.py에 사용
import os
import requests
from datetime import datetime, timedelta, timezone

# Flask 백엔드가 동작 중인 URL
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

def fetch_calendar_events(access_token: str,
                          refresh_token: str,
                          days: int = 1) -> list[dict]:
    
    # ISO 포맷 + 'Z' (UTC)
    now = datetime.now(timezone.utc)
    time_min = (
        now.replace(hour=0, minute=0, second=0, microsecond=0)
        .isoformat()
        .replace("+00:00", "Z")
    )
    
    time_max = (
        (now + timedelta(days=days))
        .replace(hour=0, minute=0, second=0, microsecond=0)
        .isoformat()
        .replace("+00:00", "Z")
    )

    resp = requests.post(
        f"{BACKEND_URL}/calendar/events",
        json={
            "access_token": access_token,
            "refresh_token": refresh_token,
            "timeMin": time_min,
            "timeMax": time_max
        },
        timeout=5
    )
    resp.raise_for_status()
    body = resp.json()
    if body.get("error"):
        raise RuntimeError(body["error"])
    return body.get("events", [])
