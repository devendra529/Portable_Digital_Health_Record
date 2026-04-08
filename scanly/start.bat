@echo off
echo Starting Scanly Backend...
start cmd /k "cd backend && npm install && node server.js"
timeout /t 3
echo Starting Scanly Frontend...
start cmd /k "cd frontend && npm install && npm run dev"
echo.
echo Scanly is starting up!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   Demo: admin@scanly.app / admin123
