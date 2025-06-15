from flask import Flask
from flask_cors import CORS

# from analyze_chatlog import anaylze_chatlog_bp

from chat import chat_bp
from auth import auth_bp
from wake import wake_bp
from health import health_bp
from make_reportcard import make_reportcardbp
from google_tts import tts_bp
from caps.backend.calendar import calendar_bp

app = Flask(__name__)
# CORS(app)
CORS(app,
     resources={r"/*": {"origins": ["https://www.talktolia.org", "http://localhost:3000"]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])

app.register_blueprint(calendar_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(wake_bp)
app.register_blueprint(chat_bp)
# app.register_blueprint(anaylze_chatlog_bp)
app.register_blueprint(health_bp)
app.register_blueprint(make_reportcardbp)
app.register_blueprint(tts_bp)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)