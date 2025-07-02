@echo off
echo 🛑 Stopping Latitude Explorer Application...

echo Stopping backend server (port 3001)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001"') do taskkill /f /pid %%a 2>nul

echo Stopping frontend server (port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173"') do taskkill /f /pid %%a 2>nul

echo Cleaning up Node.js processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.cmd 2>nul

echo ✅ All services stopped successfully!
pause
