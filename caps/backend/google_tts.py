# backend/google_tts.py
from flask import Blueprint, request, send_file
from google.cloud import texttospeech
import tempfile

tts_bp = Blueprint("tts", __name__)

@tts_bp.route("/google_tts", methods=["POST"])
def google_tts():
    data = request.get_json()
    text = data.get("text", "")

    client = texttospeech.TextToSpeechClient()
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="ko-KR",
        name="ko-KR-Wavenet-B",  # 여성: Wavenet-B, D / 남성: A, C
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
    )
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

    response = client.synthesize_speech(
        input=input_text,
        voice=voice,
        audio_config=audio_config
    )

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as out:
        out.write(response.audio_content)
        temp_path = out.name

    return send_file(temp_path, mimetype="audio/mpeg")
