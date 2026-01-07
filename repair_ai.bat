@echo off
title AI ENGINE REPAIR
echo ===========================================
echo       REPAIRING AI ENGINE (Port 3004)
echo ===========================================
cd services\ai-engine
echo Current Directory: %CD%

echo [1/2] Installing Dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo FAIL: npm install failed.
    pause
    exit /b
)
echo SUCCESS: Dependencies installed.

echo [2/2] Starting AI Server...
node server.js
if %ERRORLEVEL% NEQ 0 (
    echo FAIL: Server crashed.
    pause
)
pause
