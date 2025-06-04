from openai import OpenAI
import os
from dotenv import load_dotenv

# 환경 변수에서 API 키 읽기
API_KEY = os.getenv("API_KEY")

def generate_message(data):
  openai = OpenAI(api_key = API_KEY)

  prompt = f"""
            '{data}'를 보고 건강 정보 중에서 평균치에서 벗어나는 내용을 파악하고
            해당 내용을 바탕으로 사용자가 해야하는 행동을 제안하는 메세지를 작성해줘.

            
             ### 예시 출력 메세지
              - "어제는 권장 수면 시간 보다 적게 잔 것 같아. 오늘은 한시간 일찍 자는 건 어때?"
              - "어제 권장 칼로리 섭취량 보다 적게 먹은 것 같아. 저녁에 간단한 간식을 먹는 건 어때?"
              - "어제 권장 걸음 수 보다 적게 걸은 것 같아. 30분 정도 산책해보는건 어때?"
              - "최근에 운동량이 부족한 것 같아. 오늘은 30분 정도 운동해보는 건 어때?"
              - "어제 푹 잘 잤구나! 오늘도 좋은 컨디션을 유지해봐."
              - "어제 심박수가 높았어. 오늘은 명상이나 휴식을 추천해."
                            
             ### 출력 스타일
              - 건강 정보를 분석한 결과를 가지고 사용자가 해야하는 행동을 제아하는 메세지 작성
              - 친근한 말투로 작성할 것
              - 사용자가 이해하기 쉽게 작성할 것
              - 메세지 내용만 나타낼 것
            """
  
  # GPT 호출
  response = openai.chat.completions.create(
      model="gpt-4o-mini",
      messages=[
          {"role": "system", "content": f"너는 사용자에게 격려해주는 사람이야"},
          {"role": "system", "content": f"너는 건강 정보 분석 전문가 겸 의사야야"},
          {"role": "user", "content": prompt}
      ],
      temperature=0.7
  )

  result = response.choices[0].message
  return result