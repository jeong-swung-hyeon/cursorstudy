@echo off
chcp 65001 >nul
echo 스포츠 시설 대시보드 프론트엔드를 시작합니다...
echo.
cd /d "%~dp0"
call npm run dev
pause
