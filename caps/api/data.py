from flask import Blueprint, request, jsonify

import os
import json
from datetime import datetime


data_bp = Blueprint('data', __name__)

@data_bp.route('/data/receive', methods=['POST'])
def receive_watch_data():

    data = request.get_json()
     # 받은 데이터 출력 (디버그용)
    print("받은 데이터:", json.dumps(data, indent=2, ensure_ascii=False))

    # 📂 저장 폴더 생성 및및 폴더 생성 여부 확인
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
