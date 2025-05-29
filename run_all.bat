@echo off
chcp 65001 > nul

@REM echo [1] 백엔드 서버 시작 중...
@REM cd caps\backend
@REM start "flask" cmd /k "call venv\Scripts\activate && flask run --host=0.0.0.0 --port=5000"
@REM set BACKEND_TITLE=flask
@REM cd ..

echo [2] 프론트엔드 React 앱 시작 중...
cd caps
start "react" cmd /k "npm start"
set FRONTEND_TITLE=react

echo --------------------------------------
echo [✅] 프론트엔드가 실행되었습니다.
echo --------------------------------------

:wait_input
set /p user_input=종료하려면 [q]를 누르세요: 
if /i "%user_input%"=="q" goto shutdown
goto wait_input

:shutdown
echo [⛔] 실행 중인 프로세스를 종료합니다...

:: 백엔드 종료
taskkill /FI "WINDOWTITLE eq %BACKEND_TITLE%" /T /F > nul

:: 프론트엔드 종료
taskkill /FI "WINDOWTITLE eq %FRONTEND_TITLE%" /T /F > nul

echo [✅] 종료 완료
exit
