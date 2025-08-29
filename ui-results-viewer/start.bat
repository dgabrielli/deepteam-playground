@echo off
echo 🚀 Starting DeepTeam Results Viewer...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16.0 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Start both servers
echo 🌐 Starting backend server on port 3001...
echo ⚛️  Starting React development server on port 3000...
echo.
echo 📱 Open http://localhost:3000 in your browser
echo 🔌 Backend API available at http://localhost:3001
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Run both servers concurrently
npm run dev

pause
