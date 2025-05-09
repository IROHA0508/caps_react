from flask import Flask
from flask_cors import CORS

from api import api_bp
from data import data_bp  # 🔽 추가

app = Flask(__name__)
CORS(app)

app.register_blueprint(api_bp)
app.register_blueprint(data_bp)  # 🔽 추가

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
