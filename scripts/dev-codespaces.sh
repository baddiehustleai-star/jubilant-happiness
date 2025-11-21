#!/bin/bash
# GitHub Codespaces development server startup script

echo "🚀 Starting Photo2Profit development server for GitHub Codespaces..."

# Set environment variables for Codespaces
export VITE_HOST=0.0.0.0
export PORT=5173

# Kill any existing processes on port 5173
echo "🔧 Cleaning up existing processes..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Start the development server
echo "🌐 Starting Vite development server..."
echo "📡 Server will be available at:"
echo "   Local:   http://localhost:5173/"
echo "   Network: http://0.0.0.0:5173/"
echo ""
echo "💡 In GitHub Codespaces:"
echo "   1. Check the 'Ports' tab in VS Code"
echo "   2. Look for port 5173"
echo "   3. Click the globe icon to make it public"
echo "   4. Click the port number to open in browser"
echo ""

npm run dev -- --host 0.0.0.0 --port 5173