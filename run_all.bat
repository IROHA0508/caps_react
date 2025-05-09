@echo off
echo [1] 백엔드 가상환경 실행 및 Flask 서버 시작
cd caps\api
call venv\Scripts\activate
start cmd /k "flask run"

echo [2] 프론트엔드 React 앱 시작
cd ..\..
cd caps
start cmd /k "npm start"

echo 모든 서버가 별도 창에서 실행되었습니다.
pause