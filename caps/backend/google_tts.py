from flask import Blueprint, request, send_file
from flask_cors import cross_origin
from google.cloud import texttospeech
from dotenv import load_dotenv
import io
import re

load_dotenv()
tts_bp = Blueprint("tts", __name__)

@tts_bp.route("/google_tts", methods=["POST"])
@cross_origin(origins=["http://localhost:3000", "https://www.talktolia.org"])
def google_tts():
    data = request.get_json()
    raw_text = data.get("text", "")

    print(f"REACT에서 받은 문자 : {raw_text}")
    # 순수 문자+공백만
    clean_text = re.sub(r'[^ㄱ-ㅎ가-힣a-zA-Z0-9\s\.\,\!\?]', ' ', raw_text)
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    print(f"정제된 문자 : {clean_text}")

    if not clean_text:
        return {"error": "No text provided"}, 400

    client = texttospeech.TextToSpeechClient()

    # ✅ 입력 파라미터 구성
    input_text = texttospeech.SynthesisInput(text=clean_text)

    voice = texttospeech.VoiceSelectionParams(
        language_code="ko-KR",
        name="ko-KR-Chirp3-HD-Zephyr"  # ✅ 예시 음성 이름으로 변경
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16,  # ✅ 공식 문서 기준
        effects_profile_id=["small-bluetooth-speaker-class-device"],
        pitch=0.0,
        speaking_rate=1.07
    )

    # ✅ 요청 body를 콘솔에 출력
    request_body = {
        "audioConfig": {
            "audioEncoding": "LINEAR16",
            "effectsProfileId": [
                "handset-class-device"
              ],
            "pitch": 0.0,
            "speakingRate": 1.05
        },
        "input": {"text": clean_text},
        "voice": {
            "languageCode": voice.language_code,
            "name": voice.name
        }
    }
    print("📤 Google TTS Request Body:")
    print(request_body)

    # ✅ API 호출
    response = client.synthesize_speech(
        input=input_text,
        voice=voice,
        audio_config=audio_config
    )

    audio_stream = io.BytesIO(response.audio_content)
    audio_stream.seek(0)

    return send_file(
        audio_stream,
        mimetype="audio/wav",  # LINEAR16은 일반적으로 .wav 형식
        as_attachment=False,
        download_name="response.wav"
    )
