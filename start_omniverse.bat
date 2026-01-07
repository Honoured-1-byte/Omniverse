@echo off
title OMNIVERSE KERNEL
color 0A
echo ===================================================
echo      STARTING OMNIVERSE HYBRID SYSTEM
echo      (Mongo + SQLite Engines Online)
echo ===================================================

:: 0. KILL SWITCH (Prevents EADDRINUSE errors)
echo [0/5] Cleaning up old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: 1. TRAVEL ENGINE (MongoDB) - Port 3001
echo [1/5] Igniting Travel Engine (Wanderlust)...
start "Travel Service" /min cmd /k "cd services\travel-engine && npm start"

:: 2. COMMERCE ENGINE (MongoDB) - Port 3002
echo [2/5] Igniting Commerce Engine (Shop)...
start "Commerce Service" /min cmd /k "cd services\shop-engine && npm start"

:: 3. SOCIAL ENGINE (SQLite) - Port 3003
echo [3/5] Igniting Social Engine (Kapota)...
start "Social Service" /min cmd /k "cd services\social-engine && npm start"

:: 4. AI ENGINE (Gemini) - Port 3004
echo [4/5] Igniting AI Engine (OmniBrain)...
start "AI Service" cmd /k "cd services\ai-engine && npm install && npm start"

:: 5. DESKTOP UI (Vite) - Port 5173
echo [5/5] Launching Desktop Interface...
cd apps\desktop-ui
echo.
echo SYSTEM ONLINE. OPENING INTERFACE...
echo.
npm run dev