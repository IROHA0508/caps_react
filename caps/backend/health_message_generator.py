from openai import OpenAI
import os
from dotenv import load_dotenv

# 환경 변수에서 API 키 읽기
API_KEY = os.getenv("API_KEY")

def generate_message(data):
  openai = OpenAI(api_key = API_KEY)

  prompt = f"""
            '{data}'를 보고 건강 정보 중에서 평균치에서 벗어나는 내용을 파악


             ### 출력 스타일
              - 영어로 번역된 결과만 출력해줘
            """
  # GPT 호출
  response = openai.chat.completions.create(
      model="gpt-4o-mini",
      messages=[
          {"role": "system", "content": f"너는 사용자에게 격려해주는 사람이야"},
          {"role": "user", "content": prompt}
      ],
      temperature=0.7
  )

  result = response.choices[0].message
  return result