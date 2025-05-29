# wake.py
from flask import Blueprint

wake_bp = Blueprint('wake', __name__)

@wake_bp.route('/wake')
def wake():
    return '🟢 서버 정상 동작 중'
