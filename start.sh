#!/bin/bash
# ==============================================================
#  PHOTO2PROFIT DEV SERVER LAUNCHER
#  Auto-restarts on crashes, watches for changes
# ==============================================================

set -e

echo "💎 Photo2Profit Development Launcher"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
  echo "⚠️  No .env file found!"
  echo "   Run './setup.sh' first or copy .env.example to .env"
  exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies first..."
  npm install
fi

# Function to cleanup background processes
cleanup() {
  echo ""
  echo "🛑 Shutting down servers..."
  if [ -n "$API_PID" ]; then
    kill $API_PID 2>/dev/null || true
  fi
  if [ -n "$VITE_PID" ]; then
    kill $VITE_PID 2>/dev/null || true
  fi
  exit 0
}

trap cleanup SIGINT SIGTERM

# --- Option 1: Launch both frontend + API ------------------------------------
if [ "$1" = "all" ] || [ "$1" = "both" ]; then
  echo "🚀 Starting API server (port 8080)..."
  
  if [ -d "api" ] && [ -f "api/server.js" ]; then
    cd api
    node server.js &
    API_PID=$!
    cd ..
    
    echo "✓ API running (PID: $API_PID)"
    sleep 2
    
    # Health check
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
      echo "✅ API health check passed"
    else
      echo "⚠️  API may not be ready yet"
    fi
  else
    echo "⚠️  API directory not found - skipping API server"
  fi
  
  echo ""
  echo "⚡ Starting Vite dev server (port 5173)..."
  npm run dev &
  VITE_PID=$!
  
  echo ""
  echo "✅ Both servers running!"
  echo "   Frontend: http://localhost:5173"
  echo "   API:      http://localhost:8080"
  echo ""
  echo "Press Ctrl+C to stop all servers"
  
  # Wait for both processes
  wait

# --- Option 2: API only -------------------------------------------------------
elif [ "$1" = "api" ]; then
  echo "🚀 Starting API server only..."
  
  if [ -d "api" ] && [ -f "api/server.js" ]; then
    cd api
    node server.js
  else
    echo "❌ API directory not found"
    exit 1
  fi

# --- Option 3: Frontend only (default) ----------------------------------------
else
  echo "⚡ Starting Vite dev server..."
  echo ""
  echo "💡 Tip: Use './start.sh all' to launch both frontend + API"
  echo "   Or:  './start.sh api' for API only"
  echo ""
  
  npm run dev
fi
