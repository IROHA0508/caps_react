from flask import Blueprint, request, jsonify

import requests
import os
import json
from datetime import datetime


data_bp = Blueprint('data', __name__)

@data_bp.route('/data/receive', methods=['POST'])
def receive_health_data():
    data = request.get_json()
     # 받은 데이터 출력 (디버그용)
    print("받은 데이터:", json.dumps(data, indent=2, ensure_ascii=False))


    # 디버그용 - 나중에 삭제 할 것
    # 📂 저장 폴더 생성 및   폴더 생성 여부 확인
    folder_path = 'temp_data'

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"📁 폴더 생성됨: {folder_path}")
    else:
        print(f"📂 기존 폴더 존재함: {folder_path}")
        
    # 📄 파일 이름: YYYYMMDD_헬스데이터.json
    today_str = datetime.now().strftime('%Y%m%d')
    file_name = f"{today_str}_헬스데이터.json"
    file_path = os.path.join(folder_path, file_name)

    # 📥 JSON 데이터 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"💾 데이터 저장됨: {file_path}")

    # 필요한 로직 처리 (DB 저장, 분석 등)
    return jsonify({"status": "received", "data": data}), 200


@data_bp.route('/data/sendserver', methods=['POST'])
def send_data_to_server():
    try:
        # 요청에서 JSON 추출
        data = request.get_json()
        jwt_token = request.headers.get('Authorization')  # Bearer 토큰 포함됨

        if not jwt_token:
            return jsonify({"error": "Authorization 토큰이 없습니다."}), 401

        # 전달받은 데이터에서 reportType과 content 추출
        report_type = "daily"

        file_path = "temp_data/123456.json"
        with open(file_path, 'r', encoding='utf-8') as f:
            content = json.load(f)

        if report_type not in ["daily", "weekly"] or content is None:
            return jsonify({"error": "유효하지 않은 reportType 또는 content입니다."}), 400

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

        if response.status_code != 201:
            return jsonify({"error": "외부 API 응답 오류", "response": response.text}), response.status_code

        return jsonify({"message": "리포트 전송 성공", "server_response": response.json()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
