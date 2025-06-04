from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

health_bp = Blueprint('health', __name__)

@health_bp.route('/health/from-node', methods=['POST', 'OPTIONS'])
# @cross_origin(origins="*", allow_headers=["Content-Type", "Authorization"])
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

    return jsonify({"status": "success", "message": "데이터 수신 완료"}), 200
