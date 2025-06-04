from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

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

    # ✅ 데이터 복호화화
    decrypted_data = decrypt_data(health_data)

    # ✅ 추천 생성
    recommendations = generate_recommendations(health_data)

    return jsonify({"status": "success", "message": "데이터 수신 완료"}), 200

def decrypt_data(data):
    # 이 함수는 실제로 데이터를 복호화하는 로직을 구현해야 합니다.
    # 현재는 단순히 입력 데이터를 그대로 반환합니다.
    # 예시로, 암호화된 데이터를 복호화하는 로직을 여기에 추가할 수 있습니다.
    return data

def generate_recommendations(health_data):
    messages = []

    # 렘수면 시간
    rem_sleep = health_data.get("rem_sleep", 0)

    # 가벼운 수면 시간
    light_sleep = health_data.get("light_sleep", 0)

    # 깊은 수면 시간
    deep_sleep = health_data.get("deep_sleep", 0)

    # 총 수면 시간
    total_sleep = sum([rem_sleep, light_sleep, deep_sleep])
    
    # 이동거리
    distance = health_data.get("distance", 0)

    # 걸음 수
    step_values = [entry["value"] for entry in health_data.get("step", [])]
    total_steps = sum(step_values)

    # 칼로리
    calorie_values = [entry["value"] for entry in health_data.get("calories", [])]
    total_calories = sum(calorie_values)

    # 심박수
    heart_rates = [entry["bpm"] for entry in health_data.get("heart_rate", [])]
    avg_heart_rate = sum(heart_rates) / len(heart_rates) if heart_rates else 0

    print(f"총 수면 시간: {total_sleep}분, 총 걸음 수: {total_steps}, 총 칼로리: {total_calories}, 평균 심박수: {avg_heart_rate}")
    print(f"렘수면: {rem_sleep}, 가벼운 수면: {light_sleep}, 깊은 수면: {deep_sleep}, 이동거리: {distance}")
