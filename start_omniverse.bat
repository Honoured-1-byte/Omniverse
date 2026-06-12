@echo off
title OMNIVERSE KERNEL
color 0A
echo ===================================================
echo      STARTING OMNIVERSE HYBRID SYSTEM
echo      (OmniBrain Engine Online)
echo ===================================================

:: 0. KILL SWITCH (Prevents EADDRINUSE errors)
echo [1/3] Cleaning up old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul


:: 2. AI ENGINE (Gemini) - Port 3004
echo [2/3] Igniting AI Engine (OmniBrain)...
start "AI Service" cmd /k "cd ai-engine && npm install && npm start"

:: 3. DESKTOP UI (Vite) - Port 5173
echo [3/3] Launching Desktop Interface...
cd desktop-ui
echo.
echo SYSTEM ONLINE. OPENING INTERFACE...
echo.
npm run dev