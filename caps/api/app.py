from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


from api import api_bp
from data import data_bp
from users import users_bp
from db import db

app = Flask(__name__)
CORS(app)

# PostgreSQL 연결 정보 (예시)
app.config['SQLALCHEMY_DATABASE_URI'] = (
    'postgresql://dbmasteruser:4x8PNC8DN1Au*KR..Fj1OAuacVaw%26%3C%5Db@'
    'ls-deddfce058ae2787e4c921866cdbb65701d29146.c9a8k0w88jzk.ap-northeast-2.rds.amazonaws.com:5432/LIA-DATABASE'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.register_blueprint(api_bp)
app.register_blueprint(data_bp)
app.register_blueprint(users_bp)   


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)