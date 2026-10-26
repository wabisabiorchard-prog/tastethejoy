@echo off
echo ========================================================
echo   Starting Taste the Joy (Backend + React Frontend)
echo ========================================================
echo.

start "Taste the Joy - Node.js Backend" cmd /k "cd backend && node server.js"
start "Taste the Joy - React Frontend" cmd /k "cd frontend && npm.cmd run dev"

echo Backend running on http://localhost:5000
echo Frontend running on http://localhost:3000
echo.
