from flask import Blueprint, request, send_file, after_this_request
from flask_cors import cross_origin
from google.cloud import texttospeech
from dotenv import load_dotenv
import tempfile, os

load_dotenv()
tts_bp = Blueprint("tts", __name__)

@tts_bp.route("/google_tts", methods=["POST"])
@cross_origin(origins=["http://localhost:3000", "https://www.talktolia.org"])
def google_tts():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return {"error": "No text provided"}, 400

    client = texttospeech.TextToSpeechClient()
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="ko-KR",
        name="ko-KR-Wavenet-B",
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=1.0,
        pitch=0.0,
    )

    response = client.synthesize_speech(
        input=input_text, voice=voice, audio_config=audio_config
    )

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as out:
        out.write(response.audio_content)
        temp_path = out.name

    @after_this_request
    def cleanup(response):
        try:
            os.remove(temp_path)
        except Exception as e:
            print(f"임시 파일 삭제 실패: {e}")
        return response

    return send_file(temp_path, mimetype="audio/mpeg")
