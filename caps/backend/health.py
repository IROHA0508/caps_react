from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from Crypto.Cipher import AES
import base64

from health_message_generator import generate_message

health_bp = Blueprint('health', __name__)

@health_bp.route('/health/from-node', methods=['POST', 'OPTIONS'])
@cross_origin(origins="*", allow_headers=["Content-Type", "Authorization"])
def receive_node_data():
    print(f"🔍 Method: {request.method}")
    if request.method == 'OPTIONS':
        return '', 200  # ✅ 명시적으로 OPTIONS 응답 처리 (보완적)
    
    data = request.get_json()
    user_id = data.get("user_id")
    health_data = data.get("data")

    if not user_id or not health_data:
        return jsonify({"error": "Missing user_id or data"}), 400

    print(f"📥 Node에서 받은 데이터 (user: {user_id})", health_data)

    # # ✅ 데이터 복호화
    # decrypted_data = decrypt_data(health_data)

    # # ✅ 추천 생성
    # recommendations = generate_recommendations(decrypted_data)

    return jsonify({"status": "success", "message": "데이터 수신 완료"}), 200

# # 복호화 함수
# # AES 키 설정 (16바이트)
# AES_KEY = "MySecretKey12345".encode("utf-8")

# # PKCS5 언패딩
# def unpad(s: bytes) -> bytes:
#     return s[:-s[-1]]

# # 단일 값 복호화 함수
# def decrypt_value(encrypted_base64: str) -> str:
#     cipher = AES.new(AES_KEY, AES.MODE_ECB)
#     encrypted_bytes = base64.b64decode(encrypted_base64)
#     decrypted_bytes = cipher.decrypt(encrypted_bytes)
#     return unpad(decrypted_bytes).decode('utf-8')


# # 데이터 복호화 함수
# def decrypt_data(data: dict) -> dict:
#     biometrics = data.get("biometrics", [])
#     grouped = {
#         "step": [],
#         "heart_rate": [],
#         "calories": [],
#         "distance": [],
#         "light_sleep": [],
#         "rem_sleep": [],
#         "deep_sleep": []
#     }

#     for item in biometrics:
#         dtype = item.get("data_type")
#         if dtype not in grouped:
#             continue

#         decrypted_item = dict(item)  # 복사
#         if dtype == "heart_rate":
#             decrypted_item["bpm"] = int(decrypt_value(item["bpm"]))
#         else:
#             decrypted_item["value"] = float(decrypt_value(item["value"]))

#         grouped[dtype].append(decrypted_item)

#     return grouped

# def sum_values(entries):
#     return sum([entry["value"] for entry in entries])

# def generate_recommendations(health_data):
#     messages = []

#     # ✅ 수면 시간 합산
#     rem_sleep = sum_values(health_data.get("rem_sleep", []))
#     light_sleep = sum_values(health_data.get("light_sleep", []))
#     deep_sleep = sum_values(health_data.get("deep_sleep", []))
#     total_sleep = rem_sleep + light_sleep + deep_sleep

#     # ✅ 거리, 걸음 수, 칼로리
#     total_distance = sum_values(health_data.get("distance", []))
#     total_steps = sum([entry["value"] for entry in health_data.get("step", [])])
#     total_calories = sum([entry["value"] for entry in health_data.get("calories", [])])

#     # ✅ 심박수 평균 계산
#     heart_rates = [entry["bpm"] for entry in health_data.get("heart_rate", [])]
#     avg_heart_rate = sum(heart_rates) / len(heart_rates) if heart_rates else 0

#     # ✅ 상태 출력 (디버깅용)
#     print(f"총 수면 시간: {total_sleep}분, 총 걸음 수: {total_steps}, 총 칼로리: {total_calories}, 평균 심박수: {avg_heart_rate}")
#     print(f"렘수면: {rem_sleep}, 가벼운 수면: {light_sleep}, 깊은 수면: {deep_sleep}, 이동거리: {total_distance} km")

#     # ✅ 추천 메시지 예시 (간단한 기준으로 작성)
#     if total_sleep < 360:
#         messages.append("어제 수면이 부족했어. 오늘은 일찍 자는 걸 추천해!")
#     elif total_sleep > 540:
#         messages.append("어제 푹 잘 잤구나! 오늘도 좋은 컨디션을 유지해봐.")

#     if total_steps < 4000 or total_calories < 200:
#         messages.append("활동량이 적었네. 오늘은 산책 30분 어때?")
#     elif total_steps > 9000:
#         messages.append("많이 걸었구나! 오늘은 가볍게 스트레칭 정도면 충분해.")

#     if avg_heart_rate > 100:
#         messages.append("어제 심박수가 높았어. 오늘은 명상이나 휴식을 추천해.")

#     return messages
