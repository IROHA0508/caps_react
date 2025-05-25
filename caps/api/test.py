import requests
import json

jwt_token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaGFwcHlkYXk3ODYyQGdtYWlsLmNvbSIsImlhdCI6MTc0ODA3NjkyMCwiZXhwIjoxNzQ4MTYzMzIwfQ.d_-mTQ3ck54TnyFAgqks0thk0dixsuSCNj95o02jw_E"  # JWT 토큰 직접 입력

report_type = "daily"

file_path = "C:\\Users\\sb730\\Desktop\\caps_react\\caps\\api\\temp_data\\123456.json"  # 📂 JSON 파일 경로
with open(file_path, 'r', encoding='utf-8') as f:
  content = json.load(f)

# 외부 API 요청
response = requests.post(
  "http://15.165.19.114:3000/reports",  # 📌 목적지 API 주소
  headers={
      "Content-Type": "application/json",
      "Authorization": jwt_token  # 그대로 전달 (예: Bearer abc.def.ghi)
  },
  json={
      "reportType": report_type,
      "content": content
  }
)

print("상태 코드:", response.status_code)
print("응답:", response.text)
