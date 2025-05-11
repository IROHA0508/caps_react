from flask import request, Blueprint, jsonify
from db import db
from datetime import datetime

users_bp = Blueprint('users', __name__)

# DB 모델 정의 : USER 테이블
class users(db.Model):
    __tablename__ = 'users'  # 정확히 대문자 USER로 명시

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nickname = db.Column(db.String)
    major = db.Column(db.String)
    goal = db.Column(db.String)
    emotion = db.Column(db.String)
    created_at = db.Column(db.DateTime)

# 로그인 정보를 DB에 저장하는 API
@users_bp.route('/users/google_login', methods=['POST'])
def google_login():
    data = request.get_json()
    created_at_str = data.get('created_at')

    if not created_at_str:
        return jsonify({'error': 'created_at 누락'}), 400

    # datetime 변환
    created_at = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))

    new_user = users(
        nickname=None,
        major=None,
        goal=None,
        emotion=None,
        created_at=created_at
    )
    db.session.add(new_user)
    db.session.commit()
    print(f"[신규 사용자 등록] ID: {new_user.id}, 시간: {created_at}")

    return jsonify({'message': '사용자 저장 완료', 'user_id': new_user.id})