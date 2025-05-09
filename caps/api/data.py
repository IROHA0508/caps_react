from flask import Blueprint, request, jsonify

data_bp = Blueprint('data', __name__)

@data_bp.route('/data/receive', methods=['POST'])
def receive_watch_data():
    data = request.get_json()

    # 예시: 워치에서 전달된 헬스 데이터 처리
    print("워치에서 받은 데이터:", data)

    # 필요한 로직 처리 (DB 저장, 분석 등)
    return jsonify({"message": "워치 데이터 수신 성공", "data": data})
