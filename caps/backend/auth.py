# backend/auth.py
from flask import Blueprint, redirect, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/login')
def login():
    client_id = os.environ['GOOGLE_CLIENT_ID']
    redirect_uri = os.environ['REDIRECT_URI']
    scope = 'https://www.googleapis.com/auth/calendar.readonly'
    return redirect(
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={client_id}&redirect_uri={redirect_uri}"
        f"&response_type=code&scope={scope}&access_type=offline&prompt=consent"
    )

@auth_bp.route('/auth/callback')
def callback():
    try:
        code = request.args.get('code')
        if not code:
            return 'Missing code', 400

        token_url = 'https://oauth2.googleapis.com/token'
        data = {
            'code': code,
            'client_id': os.environ['GOOGLE_CLIENT_ID'],
            'client_secret': os.environ['GOOGLE_CLIENT_SECRET'],
            'redirect_uri': os.environ['REDIRECT_URI'],
            'grant_type': 'authorization_code',
        }

        token_res = requests.post(token_url, data=data)
        token_json = token_res.json()

        print("🪪 Access Token Info:", token_json)

        access_token = token_json.get('access_token')
        if not access_token:
            return 'Failed to get access token', 400

        # ✅ React로 access_token 포함한 리다이렉트
        return redirect(f'http://localhost:3000/main/routine?access_token={access_token}')

    except Exception as e:
        print("❌ Error:", e)
        return f'Error: {str(e)}', 500