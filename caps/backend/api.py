from flask import request, Blueprint, jsonify
from openai import OpenAI
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import requests
import time

import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# 환경 변수에서 API 키 읽기
API_KEY = os.getenv("API_KEY")


api_bp = Blueprint('api', __name__)

@api_bp.route('/api/hello', methods=['GET'])
def hello():
    return "Hello world!"


@api_bp.route('/api/emotion_analyze', methods=['POST'])
def emotion_analyze():
    data = request.get_json()
    text = data.get('text', '')

    tokenizer = AutoTokenizer.from_pretrained("joeddav/distilbert-base-uncased-go-emotions-student")
    model = AutoModelForSequenceClassification.from_pretrained("joeddav/distilbert-base-uncased-go-emotions-student")

    translate_result = translate_kor2eng(text).content

    # 토크나이즈
    inputs = tokenizer(translate_result, return_tensors="pt")

    # 모델 추론
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probs = torch.sigmoid(logits)[0]

    # 감정 레이블 정의
    emotion_labels = [
        "admiration", "amusement", "anger", "annoyance", "approval", "caring", "confusion",
        "curiosity", "desire", "disappointment", "disapproval", "disgust", "embarrassment",
        "excitement", "fear", "gratitude", "grief", "joy", "love", "nervousness", "optimism",
        "pride", "realization", "relief", "remorse", "sadness", "surprise", "neutral"
    ]

    # 감정 확률 정리
    emotion_probabilities = list(zip(emotion_labels, probs.tolist()))
    sorted_emotions = sorted(emotion_probabilities, key=lambda x: x[1], reverse=True)
    top5_emotions = sorted_emotions[:5]

    # 응답
    return jsonify({
        "translated_text": translate_result,
        "top_emotions": [
            {"label": label, "probability": round(prob, 4)}
            for label, prob in top5_emotions
        ]
    })

# 한국 -> 영어 대화 번역 함수
def translate_kor2eng(text):
    from openai import OpenAI

    openai = OpenAI(
    # 각자 api_key 입력할 것
    api_key = API_KEY
    )

    prompt = f"""
            '{text}'를 영어로 번역해줘.

             ### 출력 스타일
              - 영어로 번역된 결과만 출력해줘
            """
    # GPT 호출
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"너는 한국어로 영어로 번역하는 전문가야."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    result = response.choices[0].message
    return result
