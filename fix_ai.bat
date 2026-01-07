@echo off
echo Attempting to install AI Engine dependencies...
cd services\ai-engine
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo NPM INSTALL FAILED!
    pause
    exit /b %ERRORLEVEL%
)
echo Starting AI Engine...
node server.js
pause
