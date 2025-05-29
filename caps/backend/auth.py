# backend/auth.py
from flask import Blueprint, redirect, request, jsonify
import os
import requests
from dotenv import load_dotenv
from urllib.parse import urljoin
from urllib.parse import urlencode

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

        print("🪪 Access Token 전공:", token_json)

        access_token = token_json.get('access_token')
        refresh_token = token_json.get('refresh_token')

        if not access_token:
            return 'Failed to get access token', 400

        # ✅ React로 access_token, refresh_token 포함 리다이렉트
        main_uri = os.environ.get('MAIN_URI')
        params = urlencode({
            'access_token': access_token,
            'refresh_token': refresh_token or ''
        })
        redirect_url = urljoin(main_uri, f'/popup/callback?{params}')
        print("🔗 Redirecting to:", redirect_url)
        return redirect(redirect_url)

    except Exception as e:
        print("❌ Error:", e)
        return f'Error: {str(e)}', 500