@echo off
echo 🚀 Starting Latitude Explorer Application...

echo 📡 Starting Backend Server...
cd backend
start "Backend" cmd /k "npm run dev"

echo 🌐 Starting Frontend Development Server...
cd ..\frontend
start "Frontend" cmd /k "npm run dev"

cd ..
echo.
echo ✅ Both services are starting up!
echo 📍 Backend API: http://localhost:3001
echo 🌍 Frontend App: http://localhost:5173
echo.
echo 💡 Click on the map to discover cities at the same latitude!
echo.
echo ❌ To stop services, run: stop.bat
pause
