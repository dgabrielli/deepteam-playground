#!/bin/bash

echo "🚀 Starting DeepTeam Results Viewer..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16.0 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start both servers
echo "🌐 Starting backend server on port 3001..."
echo "⚛️  Starting React development server on port 3000..."
echo ""
echo "📱 Open http://localhost:3000 in your browser"
echo "🔌 Backend API available at http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Run both servers concurrently
npm run dev
