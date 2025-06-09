# make_report.py

from openai import OpenAI
import os
from health import decrypt_data                                # 복호화 로직
from health_message_generator import generate_message as gen_health_msg  # 헬스 메시지 생성

# OpenAI 클라이언트 초기화
API_KEY = os.getenv("API_KEY")
openai = OpenAI(api_key=API_KEY)

def generate_routine_recommendations(history):
    convo = "\n".join(f"{m['role']}: {m['content']}" for m in history)
    prompt = (
        f"아래 대화 기록을 보고 사용자의 감정 상태를 분석한 후, "
        "하루 동안 실천할 수 있는 루틴 3가지를 추천해줘. "
        "추천 항목마다 간단한 설명을 한 문장씩 덧붙여줘.\n\n"
        f"대화 기록:\n{convo}"
    )
    resp = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "당신은 감정 분석 전문가이자 루틴 코치입니다."},
            {"role": "user",   "content": prompt}
        ],
        temperature=0.7
    )
    return resp.choices[0].message.content.strip()

def generate_routine_feedback(history, recommendations):
    convo = "\n".join(f"{m['role']}: {m['content']}" for m in history)
    prompt = (
        f"아래 대화 기록과 추천된 루틴을 바탕으로, 사용자가 "
        "해당 루틴을 얼마나 실천했는지 판단하여 피드백을 작성해줘.\n\n"
        f"추천된 루틴:\n{recommendations}\n\n"
        f"대화 기록:\n{convo}"
    )
    resp = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "당신은 루틴 실천 피드백 전문가입니다."},
            {"role": "user",   "content": prompt}
        ],
        temperature=0.7
    )
    return resp.choices[0].message.content.strip()

def generate_report(history, raw_health_data=None, use_precomputed_health=False):
    """
    전체 리포트 카드를 반환합니다.
    - use_precomputed_health=True 면 raw_health_data를 '건강 행동 추천' 카드로 사용.
    - 그렇지 않으면 복호화 → 헬스 메시지 생성 후 카드로 추가.
    """
    cards = []

    # 1) 건강 행동 추천 카드
    if use_precomputed_health:
        cards.append({"title": "💡 건강 행동 추천", "content": raw_health_data})
    else:
        decrypted = decrypt_data(raw_health_data or {})
        health_msg = gen_health_msg(decrypted)
        cards.append({"title": "💡 건강 행동 추천", "content": health_msg})

    # 2) 루틴 추천 카드
    recs = generate_routine_recommendations(history)
    cards.append({"title": "📋 루틴 추천", "content": recs})

    # 3) 루틴 실천 피드백 카드
    feedback = generate_routine_feedback(history, recs)
    cards.append({"title": "✅ 루틴 실천 피드백", "content": feedback})

    return cards
