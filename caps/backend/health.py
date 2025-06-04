from flask import Blueprint, request, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health/from-node', methods=['POST'])
def receive_node_data():
    data = request.get_json()
    user_id = data.get("user_id")
    health_data = data.get("data")

    if not user_id or not health_data:
        return jsonify({"error": "Missing user_id or data"}), 400

    print(f"📥 Node에서 받은 데이터 (user: {user_id})", health_data)

    # TODO: 데이터 저장 또는 분석 처리
    return jsonify({"status": "success", "message": "데이터 수신 완료"}), 200