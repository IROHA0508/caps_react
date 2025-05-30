from flask import Flask
from flask_cors import CORS

from api import api_bp
from data import data_bp
from calender import calender_bp
from auth import auth_bp
from wake import wake_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(api_bp)
app.register_blueprint(data_bp) 
app.register_blueprint(calender_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(wake_bp)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)