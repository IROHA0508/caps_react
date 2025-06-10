from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import os
import requests

from Crypto.Cipher import AES
import base64

NODE_SERVER_URL = os.getenv("REACT_APP_IP_PORT", "api.talktolia.org")

def fetch_raw_health(days: int = 1, token: str = None) -> dict:
  print(f"📥 [fetch_raw_health...] days={days}, token={token}")
  url = f"https://{NODE_SERVER_URL}/data"
  headers = {}
  if token:
    headers["Authorization"] = f"Bearer {token}"

  print(f"📥 [fetch_raw_health] 요청 URL: {url}, 헤더: {headers}")
  resp = requests.get(
    url,
    params={"days": days},
    headers=headers,
    timeout=5
  )
  resp.raise_for_status()

  print(f"📥 [fetch_raw_health] 응답 상태: {resp.status_code}")
  return resp.json()

def get_decrypted_health(days: int = 1, token: str = None) -> dict:
  print(f"📥 [get_decrypted_health...] days={days}, token={token}")
  body = fetch_raw_health(days, token)
  raw_data = body.get("data")

  print(f"📥 [get_decrypted_health] raw_data: {raw_data}")
  if not raw_data:
    raise ValueError("Node 서버 응답에 data 필드가 없습니다.")
  # decrypt_data는 health.py에 정의된 함수
  decrypted = decrypt_data(raw_data)
  print(f"📥 [get_decrypted_health] decrypted: {decrypted}")
  return decrypted

AES_KEY = b"MySecretKey12345"  # 그대로 사용
IV = b'\x00' * 16  # CBC 모드용 IV

def unpad(s: bytes) -> bytes:
    return s[:-s[-1]]

def decrypt_value(encrypted_base64: str) -> str:
    try:
        encrypted_bytes = base64.b64decode(encrypted_base64)
        cipher = AES.new(AES_KEY, AES.MODE_CBC, iv=IV)
        decrypted_bytes = cipher.decrypt(encrypted_bytes)
        decrypted_text = unpad(decrypted_bytes).decode('utf-8')
        print(f"✅ 복호화 성공: {encrypted_base64} → {decrypted_text}")
        return decrypted_text
    except Exception as e:
        print(f"❌ 복호화 실패: {encrypted_base64} → {e}")
        return "0"


# 데이터 복호화 함수
def decrypt_data(data: dict) -> dict:
    # ✅ 내부 data 필드에 접근
    # biometrics = data.get("data", {}).get("biometrics", [])
    biometrics = data.get("biometrics", [])
    
    grouped = {
        "step": [],
        "heart_rate": [],
        "calories": [],
        "distance": [],
        "light_sleep": [],
        "rem_sleep": [],
        "deep_sleep": []
    }

    for item in biometrics:
        dtype = item.get("data_type")
        if dtype not in grouped:
            print(f"⚠️ 알 수 없는 타입: {dtype}")
            continue

        encrypted_value = item.get("value")
        print(f"🔑 복호화 시도: type={dtype}, value={encrypted_value}")

        decrypted_item = dict(item)
        try:
            if dtype == "heart_rate":
                decrypted_item["bpm"] = float(decrypt_value(encrypted_value))
            else:
                decrypted_item["value"] = float(decrypt_value(encrypted_value))
        except Exception as e:
            print(f"❌ 복호화 오류 ({dtype}): {e}")
            continue

        grouped[dtype].append(decrypted_item)

    return grouped

def sum_values(entries):
    return sum([entry["value"] for entry in entries])

def print_data(health_data):
    messages = []

    # ✅ 수면 시간 합산
    rem_sleep = sum_values(health_data.get("rem_sleep", []))
    light_sleep = sum_values(health_data.get("light_sleep", []))
    deep_sleep = sum_values(health_data.get("deep_sleep", []))
    total_sleep = rem_sleep + light_sleep + deep_sleep

    # ✅ 거리, 걸음 수, 칼로리
    total_distance = sum_values(health_data.get("distance", []))
    total_steps = sum([entry["value"] for entry in health_data.get("step", [])])
    total_calories = sum([entry["value"] for entry in health_data.get("calories", [])])

    # ✅ 심박수 평균 계산
    heart_rates = [entry["bpm"] for entry in health_data.get("heart_rate", [])]
    avg_heart_rate = sum(heart_rates) / len(heart_rates) if heart_rates else 0

    # ✅ 상태 출력 (디버깅용)
    print(f"총 수면 시간: {total_sleep}분, 총 걸음 수: {total_steps}, 총 칼로리: {total_calories}, 평균 심박수: {avg_heart_rate}")
    print(f"렘수면: {rem_sleep}, 가벼운 수면: {light_sleep}, 깊은 수면: {deep_sleep}, 이동거리: {total_distance} m")

    return messages


dummy_data = {
  "stepData": [
    {
      "date": "2025-06-04",
      "time": "14:00",
      "value": "1w4qTXMmp9mzTsZnoFPTJg=="
    }
  ],
  "heartRateData": [
    {
      "bpm": "1IaVKUbcXL0uwwo6IPWWMg==",
      "date": "2025-06-04",
      "time": "14:00"
    }
  ],
  "caloriesBurnedData": [
    {
      "date": "2025-06-04",
      "time": "14:00",
      "value": "1ymeZTC11uzRG46wm4rcoA=="
    }
  ],
  "distanceWalked": [
    {
      "date": "2025-06-04",
      "time": "14:00",
      "value": "eGmcX8L5YYNFYW/5iWjPEw=="
    }
  ],
  "totalSleepMinutes": "44cO1ZZejbzDUV0OaOg6GQ==",
  "deepSleepMinutes": [
    {
      "date": "2025-06-04",
      "time": "00:00",
      "value": "z1q8yH3dWy9uolk8XbpvAA=="
    }
  ],
  "remSleepMinutes": [
    {
      "date": "2025-06-04",
      "time": "01:30",
      "value": "UgdODt/xr5shC8Ue/x7BlQ=="
    }
  ],
  "lightSleepMinutes": [
    {
      "date": "2025-06-04",
      "time": "02:00",
      "value": "ZVoNNPvRKfJNKUeJfBqIbg=="
    }
  ]
}
